'use client';

import React from 'react';
// import { Database } from '@/types/supabase';

// type Product = Database['public']['Tables']['product']['Row'];

type currentProduct = {
  id: string | null;
  name: string | null;
  price: number | null;
  cost: number | null;
  attachments: string | null;
  // add more fields as needed
};

type formState = {
  success: boolean;
  message: string | null;
};

interface ProductModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view' | null;
  currentProduct: currentProduct;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  formState: formState;
  imageState: {
    success: boolean;
    message: string;
  };
  previewImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  shouldShowError: boolean;
}

export default function ProductModal({
  isOpen,
  mode,
  currentProduct,
  onClose,
  onSubmit,
  formState,
  imageState,
  previewImage,
  onImageChange,
  shouldShowError,
}: ProductModalProps) {
  if (!isOpen || !currentProduct || !mode) return null;

  return (
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

        <form
          action={onSubmit}
          onSubmit={(e) => {
            const message =
              imageState.success === false
                ? 'คุณแน่ใจหรือไม่ว่าต้องการส่งข้อมูลโดยที่ไม่มีการเปลี่ยนแปลงรูปภาพ?'
                : 'คุณแน่ใจหรือไม่ว่าต้องการส่งข้อมูล?';

            const confirmed = window.confirm(message);
            if (!confirmed) e.preventDefault();
          }}
        >
          <input type="hidden" name="mode" value={mode} />
          {mode === 'edit' && (
            <input type="hidden" name="id" value={currentProduct.id ?? ''} />
          )}

          {/* Image Preview */}
          <div className="flex items-center gap-4 mb-6">
            {mode === 'view' && currentProduct.attachments && (
              <img
                src={currentProduct.attachments}
                alt={currentProduct.name ?? undefined}
                className="w-16 h-16 rounded-full object-cover border"
              />
            )}
            {(mode === 'edit' || mode === 'create') && (
              <>
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                ) : currentProduct.attachments ? (
                  <img
                    src={currentProduct.attachments}
                    alt={currentProduct.name ?? undefined}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </>
            )}
          </div>

          {/* Image Input */}
          {mode !== 'view' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Upload Image
              </label>
              <input
                type="file"
                name="image"
                className="text-sm"
                accept="image/png, image/jpeg"
                onChange={onImageChange}
              />
            </div>
          )}

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                defaultValue={currentProduct.name ?? undefined}
                disabled={mode === 'view'}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cost</label>
              <input
                name="cost"
                type="number"
                step="0.01"
                defaultValue={currentProduct.cost ?? undefined}
                disabled={mode === 'view'}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={currentProduct.price ?? undefined}
                disabled={mode === 'view'}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Errors */}
          {shouldShowError && formState?.success === false && (
            <p className="mt-4 text-sm text-red-500">{formState.message}</p>
          )}
          {imageState?.success === false && (
            <p className="mt-4 text-sm text-red-500">{imageState.message}</p>
          )}

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            {mode !== 'view' && (
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 rounded-lg"
              >
                Save
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
