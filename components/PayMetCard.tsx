import { Banknote, CreditCard, Wallet } from 'lucide-react';

type cardProps = {
  paymentMethod: string;
  totalAmount: number;
};

const PayMetCard = ({ paymentMethod, totalAmount }: cardProps) => {
  return (
    <div className="rounded-2xl p-4 flex-1 min-w-[130px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors relative overflow-hidden">
      <div className="absolute right-8 top-12 text-green-500 dark:text-green-300 opacity-100 text-5xl">
        {paymentMethod === 'cash' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bitcoin-icon lucide-bitcoin"
          >
            <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727" />
          </svg>
        ) : (
          <>
            {paymentMethod === 'linepay' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-credit-card-icon lucide-credit-card"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-scan-qr-code-icon lucide-scan-qr-code"
              >
                <path d="M17 12v4a1 1 0 0 1-1 1h-4" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M17 8V7" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M7 17h.01" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <rect x="7" y="7" width="5" height="5" rx="1" />
              </svg>
            )}
          </>
        )}
      </div>

      <div className="flex justify-between items-center ">
        <span className="text-[10px] bg-white dark:bg-gray-800 py-1 text-green-600 ml-4">
          total
        </span>
      </div>
      <h1 className="text-2xl font-semibold my-4 ml-4">{totalAmount}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500 dark:text-gray-400 ml-4">
        {paymentMethod}
      </h2>
    </div>
  );
};

export default PayMetCard;
