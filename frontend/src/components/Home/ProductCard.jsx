// components/ProductCard.jsx
import { Link } from "react-router-dom";
import img from "../../assets/product1.png"; // 假設有一個預設圖片
function ProductCard({ product }) {
  return (
    <Link
      to={`/store`}
      className="group w-full max-w-[230px] bg-white rounded-2xl shadow-sm hover:shadow-md p-4 pt-3 pb-12 flex flex-col items-center text-center relative transition-shadow duration-300 hover:scale-[1.01]">
      {/* 圖片區 */}
      <div className="relative mb-2 w-full h-[190px] overflow-hidden rounded-lg">
        <img
          src={product.imageSrc || img}
          alt={product.title}
          className="w-full h-[190px] object-cover rounded-lg transform transition-transform duration-500 ease-in-out group-hover:scale-[1.8]"
        />
      </div>

      {/* tag + label 區塊：保留結構 + 固定高度 */}
      <div className="min-h-[15px] w-full mb-1 leading-none">
        {product.tag && (
          <div className="text-xs text-red-500 font-semibold text-left">{product.tag}</div>
        )}
        {product.label && (
          <div className="text-xs text-orange-600 font-semibold">{product.label}</div>
        )}
      </div>

      {/* 商品名稱 */}
      <p className="text-sm font-semibold text-gray-800 leading-snug text-left self-start mb-3">
        {product.title}
      </p>

      {/* 左下角價格 */}
      <p className="absolute bottom-3 left-4 text-sm text-gray-700">
        {product.price}
      </p>
    </Link>

  );
}

export default ProductCard;
