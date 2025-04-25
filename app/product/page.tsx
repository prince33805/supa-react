'use client';

import { useEffect, useState, useActionState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cuprod } from './actions';
import ProductModal from '@/components/ProductModal';
import { useFormToast } from '@/hooks/useFormToast';

const initialState = {
  success: false,
  message: null as string | null,
};

export default function ProductPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit' | 'view' | null>(null);
  const [currentProduct, setCurrentProduct] = useState<any | null>(null);
  const [formState, formAction] = useActionState(cuprod, initialState);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageState, setImageState] = useState({
    success: true,
    message: '',
  });
  const [shouldShowError, setShouldShowError] = useState(false);
  const [loading, setLoading] = useState(true);

  // init
  useEffect(() => {
    fetchProduct(); // Fetch products on initial render
  }, []); // Empty dependency array to run only once when the component mounts

  //
  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false;
  //     return;
  //   }
  //   if (formState.success) {
  //     toast.success(formState.message || 'Success');
  //     setIsOpen(false);
  //     setImageState({ success: true, message: '' });
  //     setShouldRefresh(true);
  //     setShouldShowError(false);
  //   } else if (formState.message) {
  //     toast.error(formState.message);
  //     setShouldShowError(true);
  //   }
  // }, [formState]);

  useFormToast(formState, {
    onSuccess: () => {
      setIsOpen(false);
      setImageState({ success: true, message: '' });
      fetchProduct();
      setShouldShowError(false);
    },
    onError: () => {
      setShouldShowError(true);
    },
  });

  // refresh dashboard // ^^ รวมได้หรือไม่
  useEffect(() => {
    if (shouldRefresh) {
      fetchProduct().then(() => {
        setShouldRefresh(false);
      });
    }
  }, [shouldRefresh]);

  // if update success then trigger
  // useEffect(() => {
  //   if (formState.success) {
  //     setIsOpen(false);
  //     setImageState({ success: true, message: '' });
  //     setShouldRefresh(true);
  //   }
  // }, [formState]);

  // toast
  // useEffect(() => {
  //   if (isFirstRender.current) {
  //     isFirstRender.current = false;
  //     return;
  //   }
  //   if (formState.message) {
  //     if (formState.success) {
  //       toast.success(formState.message);
  //     } else {
  //       toast.error(formState.message);
  //     }
  //   }
  //   if (formState.success) {
  //     setShouldRefresh(true);
  //     setIsOpen(false);
  //   }
  // }, [formState]);

  // เมื่อมี error เกิดขึ้น ให้แสดง error
  // useEffect(() => {
  //   if (formState?.success === false) {
  //     setShouldShowError(true);
  //   }
  // }, [formState]);

  const handleOpen = (mode: 'create' | 'edit' | 'view', product?: any) => {
    setMode(mode);
    if (mode === 'create') {
      setCurrentProduct({ name: '', cost: '', price: '', image: '' });
    } else {
      // view + edit
      setCurrentProduct(product || null);
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentProduct(null);
    setMode(null);
    setShouldShowError(false); // ซ่อน error message เมื่อปิด
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p: any) => p.id !== id));
  };

  const productSupabaseQuery = () => {
    let query = supabase
      .from('product')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: true });
    console.log('product', query);
    return query;
  };

  const fetchProduct = async () => {
    setLoading(true);
    const { data: productData, error, count } = await productSupabaseQuery();
    if (!productData || error) {
      return false;
    }
    setProducts(productData);
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
    const isTooLarge = file.size > 1024 * 1024;

    if (!isValidType) {
      setImageState({
        success: false,
        message: 'Only JPEG and PNG files are allowed.',
      });
      e.target.value = '';
    } else if (isTooLarge) {
      setImageState({
        success: false,
        message: 'File is too large! Max size is 1MB.',
      });
      e.target.value = '';
    } else {
      setPreviewImage(URL.createObjectURL(file));
      setImageState({
        success: true,
        message: '',
      });
    }
  };

  return (
    <div className="relative w-full xl:w-[70%]">
      {loading ? (
        <div className="text-center py-10 text-gray-500 min-h-screen">
          Loading products...
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => handleOpen('create')}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 text-sm"
            >
              + Create Product
            </button>
          </div>
          <div className="overflow-x-auto rounded-2xl shadow-md">
            <table className="min-w-full text-left text-sm text-gray-600 ">
              <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Cost
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Price
                  </th>
                  <th scope="col" className="py-4 flex justify-center ">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products?.map((product: any, index: number) => (
                  <tr className="hover:bg-gray-50" key={product.id}>
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      {product.attachments && (
                        <img
                          src={product.attachments}
                          alt={product.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      {/* {product.name} */}
                    </td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">฿ {product.cost}</td>
                    <td className="px-6 py-4">฿ {product.price}</td>
                    <td className="py-4 flex justify-center gap-4">
                      <button
                        onClick={() => handleOpen('view', product)}
                        className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleOpen('edit', product)}
                        className="p-2 rounded-md bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 011 1v0a1 1 0 01-1 1H7a1 1 0 01-1-1v0a1 1 0 011-1h10z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Popup Detail Card */}
      {isOpen && currentProduct && mode && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-6">
              {
                {
                  view: 'Product Details',
                  edit: 'Edit Product',
                  create: 'Create Product',
                }[mode]
              }
            </h2>

            <ProductModal
              isOpen={isOpen}
              mode={mode}
              currentProduct={currentProduct}
              onClose={handleClose}
              onSubmit={formAction}
              formState={formState}
              imageState={imageState}
              previewImage={previewImage}
              onImageChange={handleImageChange}
              shouldShowError={shouldShowError}
            />
          </div>
        </div>
      )}

      {/* Toast container to show notifications */}
      <ToastContainer />
    </div>
  );
}
