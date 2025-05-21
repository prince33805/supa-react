import Link from 'next/link';
import HeaderAuth from './header-auth'; // Server component
import { EnvVarWarning } from '@/components/env-var-warning';
import MobileMenuToggle from './MobileMenuToggle'; // Client component
import { createClient } from '@/utils/supabase/server';

export default async function NavBar({
  hasEnvVars,
  isLoggedIn,
}: {
  hasEnvVars: boolean;
  isLoggedIn: boolean;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role;
  // console.log('user', user?.user_metadata);

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 dark:border-b-gray-700 bg-white dark:bg-gray-900 h-16 relative">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm text-gray-800 dark:text-gray-200">
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-5 md:gap-0 items-center font-semibold">
          <Link
            href="/"
            className="block px-4 py-3 text-base font-semibold rounded hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-all duration-200"
          >
            HOME
          </Link>
          <Link
            href="/product"
            className={`block px-4 py-3 text-base font-semibold rounded transition-all duration-200
              ${
                isLoggedIn
                  ? 'hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400'
                  : 'pointer-events-none opacity-40 cursor-not-allowed'
              }
            `}
          >
            PRODUCT
          </Link>
          <Link
            href="/order"
            className={`block px-4 py-3 text-base font-semibold rounded transition-all duration-200
              ${
                isLoggedIn
                  ? 'hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400'
                  : 'pointer-events-none opacity-40 cursor-not-allowed'
              }
            `}
          >
            ORDER
          </Link>
          <Link
            href="/dashboard"
            className={`block px-4 py-3 text-base font-semibold rounded transition-all duration-200
              ${
                isLoggedIn && role === 'admin'
                  ? 'hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-gray-700 dark:hover:text-blue-400'
                  : 'pointer-events-none opacity-40 cursor-not-allowed'
              }
            `}
          >
            DASHBOARD
          </Link>
        </div>
        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <MobileMenuToggle isLoggedIn={isLoggedIn} />
        </div>

        {/* Right-side */}
        {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
      </div>
    </nav>
  );
}
