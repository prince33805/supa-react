import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

interface FormState {
  success: boolean;
  message: string | null;
}

export function useFormToast(
  formState: FormState,
  options?: {
    onSuccess?: () => void;
    onError?: () => void;
  },
) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!formState) return;

    if (formState.success) {
      toast.success(formState.message || 'Operation successful!');
      options?.onSuccess?.();
    } else if (formState.message) {
      toast.error(formState.message);
      options?.onError?.();
    }
  }, [formState]);
}
