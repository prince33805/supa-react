import Link from 'next/link';
import HeaderAuth from './header-auth'; // Server component
import { EnvVarWarning } from '@/components/env-var-warning';
import MobileMenuToggle from './MobileMenuToggle'; // Client component

export default function NavBar({ hasEnvVars }: { hasEnvVars: boolean }) {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 relative">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-5 items-center font-semibold">
          <Link
            href="/"
            className="block px-4 py-3 text-base font-semibold rounded hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
          >
            HOME
          </Link>
          <Link
            href="/product"
            className="block px-4 py-3 text-base font-semibold rounded hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
          >
            PRODUCT
          </Link>
          <Link
            href="/dashboard"
            className="block px-4 py-3 text-base font-semibold rounded hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
          >
            DASHBOARD
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <MobileMenuToggle />
        </div>

        {/* Right-side */}
        {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
      </div>
    </nav>
  );
}
