'use client';

import { useEffect, useState, useActionState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cuprod } from './actions';
import ProductModal from '@/components/ProductModal';
import { useFormToast } from '@/hooks/useFormToast';
import { Database } from '@/types/supabase';

type Product = Database['public']['Tables']['product']['Row'];

type currentProduct = {
  id: string | null;
  name: string | null;
  price: number | null;
  cost: number | null;
  attachments: string | null;
  // add more fields as needed
};

const initialState = {
  success: false,
  message: null as string | null,
};

export default function ProductPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit' | 'view' | null>(null);
  const [currentProduct, setCurrentProduct] = useState<currentProduct | null>(
    null,
  );
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
    void fetchProduct(); // Fetch products on initial render
  }, []); // Empty dependency array to run only once when the component mounts

  useFormToast(formState, {
    onSuccess: () => {
      setIsOpen(false);
      setImageState({ success: true, message: '' });
      void fetchProduct();
      setShouldShowError(false);
    },
    onError: () => {
      setShouldShowError(true);
    },
  });

  // refresh dashboard // ^^ รวมได้หรือไม่
  useEffect(() => {
    if (shouldRefresh) {
      fetchProduct()
        .then(() => {
          setShouldRefresh(false);
        })
        .catch((err) => {
          console.error('Failed to fetch product:', err);
        });
    }
  }, [shouldRefresh]);

  const handleOpen = (
    mode: 'create' | 'edit' | 'view',
    product?: currentProduct,
  ) => {
    setMode(mode);
    if (mode === 'create') {
      setCurrentProduct({
        id: '',
        name: '',
        cost: 0,
        price: 0,
        attachments: '',
      });
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

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product? This action can be undone later.',
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from('product')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Failed to soft delete:', error.message);
      return;
    }

    // Optimistically update UI
    setProducts(products.filter((p: Product) => p.id !== id));
  };

  const productSupabaseQuery = () => {
    return supabase
      .from('product')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: true });
  };

  const fetchProduct = async () => {
    setLoading(true);
    const { data: productData, error } = await productSupabaseQuery();
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
    <div className="relative w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto">
      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 min-h-screen">
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
            <table className="min-w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400">
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
                  <th scope="col" className="py-4 flex justify-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {products?.map((product: Product, index: number) => (
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    key={product.id}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      {product.attachments && (
                        <img
                          src={product.attachments}
                          alt={product.name ?? undefined}
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
                        className="p-2 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
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
                        className="p-2 rounded-md bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
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
                        className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
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
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
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
