import Image from "next/image";

type ProductCardProps = {
  productId: string;
  name: string;
  totalSales: number;
};

const ProductCard = ({ name, totalSales }: ProductCardProps) => {
  return (
    <div className="rounded-2xl p-4 flex-1 min-w-[130px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white py-1 text-green-600">
          Total
        </span>
        {/* <Image src="/more.png" alt="" width={20} height={20} /> */}
      </div>
      <h1 className="text-2xl font-semibold my-4">{totalSales}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500 dark:text-gray-400">{name}</h2>
    </div>
  );
};

export default ProductCard;
