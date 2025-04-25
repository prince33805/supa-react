import Cart from '@/components/Cart';
import { CartProvider } from '@/components/CartContext';
import ProductTable from '@/components/ProductTable';
// import Hero from '@/components/hero';
// import ProductList from '@/components/ProductList';
// import ConnectSupabaseSteps from '@/components/tutorial/connect-supabase-steps';
// import SignUpUserSteps from '@/components/tutorial/sign-up-user-steps';
// import { hasEnvVars } from '@/utils/supabase/check-env-vars';

export default function Home() {
  return (
    <CartProvider>
      <div className="flex flex-col md:flex-row lg:flex-row w-full max-w-5xl mt-2 mx-auto">
        <div className="w-full md:w-1/2 lg:w-2/3 bg-green-100">
          <ProductTable />
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-100">
          <Cart />
        </div>
      </div>
      {/* <div className="flex w-full max-w-5xl">
        <div className="w-2/3 bg-green-100">
          <ProductTable />
        </div>
        <div className="w-1/3 bg-gray-100">
          <Cart />
        </div>
      </div> */}
    </CartProvider>
  );
}
