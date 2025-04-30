'use client'

import Cart from '@/components/Cart';
import { CartProvider } from '@/components/CartContext';
import ProductTable from '@/components/ProductTable';
import { useState } from 'react';
// import Hero from '@/components/hero';
// import ProductList from '@/components/ProductList';
// import ConnectSupabaseSteps from '@/components/tutorial/connect-supabase-steps';
// import SignUpUserSteps from '@/components/tutorial/sign-up-user-steps';
// import { hasEnvVars } from '@/utils/supabase/check-env-vars';

export default function Home() {
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});

  const handleClearQuantities = () => setQuantities({});

  return (
    <CartProvider>
      <div className="flex flex-col md:flex-row lg:flex-row w-full max-w-5xl mt-2 mx-auto">
        <div className="w-full md:w-1/2 lg:w-2/3 bg-gray-100 dark:bg-black">
          <ProductTable
            quantities={quantities}
            setQuantities={setQuantities}
          />
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-100 dark:bg-black">
          <Cart
            onOrderSubmitted={handleClearQuantities}
          />
        </div>
      </div>
    </CartProvider>
  );
}
