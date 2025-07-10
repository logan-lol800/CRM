import { useEffect, useState } from "react";
import useCartStore from "../stores/cartStore";
import useUserStore from "../stores/userStore"; // 【新增】引入使用者狀態管理器
import axios from "../api/axiosFrontend";
import { useNavigate } from "react-router-dom";

function Cart() {
  // --- 從 Zustand Store 取得需要的狀態和方法 ---
  const {
    items,
    fetchCartFromServer,
    updateItemQuantityOnServer,
    removeItemFromServer,
    getTotalPrice,
  } = useCartStore();

  const { user, fetchProfile } = useUserStore(); // 【新增】取得使用者資料和獲取資料的方法

  const navigate = useNavigate();

  // --- 元件內部自己的狀態 ---
  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELIVERY");
  const [city, setCity] = useState("台北市");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedCouponId, setSelectedCouponId] = useState(""); // 【新增】用來記錄使用者選擇了哪張券

  // --- 資料載入 ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 同時開始獲取購物車和使用者資料
        await Promise.all([
          fetchCartFromServer(),
          fetchProfile()
        ]);
      } catch (err) {
        setErrorMsg("載入頁面資料失敗，請稍後再試");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchCartFromServer, fetchProfile]); // 依賴這兩個方法，確保它們在元件載入時被呼叫

  // --- 處理購物車項目數量的函式 (維持不變) ---
  const handleDecrease = async (item) => {
    const newQty = item.quantity - 1;
    if (newQty <= 0) return;
    try {
      await updateItemQuantityOnServer(item.cartDetailId, newQty);
      fetchCartFromServer();
    } catch {
      setErrorMsg("更新數量失敗");
    }
  };

  const handleIncrease = async (item) => {
    const newQty = item.quantity + 1;
    try {
      await updateItemQuantityOnServer(item.cartDetailId, newQty);
      fetchCartFromServer();
    } catch {
      setErrorMsg("更新數量失敗");
    }
  };

  // --- 處理結帳的函式 ---
  const handleCheckout = async () => {
      if (!address) {
        setErrorMsg("請填寫送貨地址");
        return;
      }

      try {
        const res = await axios.post("/orders/create", {
          address: city + address,
          paymentMethod,
          customerCouponId : 2,

        });

        const order = res.data;
        console.log("訂單建立成功", order);

        if (paymentMethod === "ONLINE_PAYMENT") {
          try {
            const payRes = await axios.get(
              `/payments/order/${order.orderid}`
            );
            console.log("取得付款連結", payRes.data);

            const { ecpayUrl, aioCheckoutDto } = payRes.data;

            const form = document.createElement("form");
            form.method = "POST";
            form.action = ecpayUrl;
            form.target = "_blank";

            for (const key in aioCheckoutDto) {
              const input = document.createElement("input");
              input.type = "hidden";
              input.name = key;
              input.value = aioCheckoutDto[key];
              form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
            await fetchCartFromServer();
            navigate("/");
          } catch (err) {
            console.error("取得綠界連結失敗", err);
            setErrorMsg("無法跳轉綠界付款，請稍後再試");
          }
        } else {
          await fetchCartFromServer();
          navigate("/");
        }
      } catch (err) {
        console.error("建立訂單失敗", err);
        setErrorMsg("建立訂單失敗，請稍後再試");
      }
    };

  // --- 金額與折扣計算 ---
  const subtotal = getTotalPrice();
  let discount = 0;

  // 【新增】從 user 的優惠券列表中，只篩選出「未使用」的券
  const availableCoupons = user?.coupons?.filter(c => c.status === 'UNUSED') || [];

  // 如果使用者選了優惠券，就計算折扣金額
  if (selectedCouponId) {
    const selectedCoupon = availableCoupons.find(c => c.customerCouponId == selectedCouponId);
    if (selectedCoupon) {
      // 檢查是否達到低消門檻
      if (subtotal >= selectedCoupon.minPurchaseAmount) {
        if (selectedCoupon.couponType === 'FIXED_AMOUNT') {
          discount = selectedCoupon.discountValue;
        } else if (selectedCoupon.couponType === 'PERCENTAGE') {
          // 後端折扣值如果是 90 (九折)，則計算方式為 (1 - 90/100)
          discount = Math.round(subtotal * (1 - (selectedCoupon.discountValue / 100)));
        }
      }
    }
  }

  const total = subtotal - discount; // 計算最終合計金額

  if (loading) {
    return <div className="text-center py-10">載入中...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-100 text-green-700 p-2 rounded text-sm">
          {successMsg}
        </div>
      )}

      {/* 【維持不變】購物車項目區塊 */}
      <div className="border rounded-md p-4">
        <h2 className="text-lg font-bold mb-4">購物車（{items.length} 件）</h2>
        {items.map((item) => (
          <div
            key={item.cartDetailId} // 使用唯一的 cartDetailId
            className="flex items-center justify-between border-b pb-4 mb-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">NT${item.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDecrease(item)}
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleIncrease(item)}
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                ＋
              </button>
            </div>
            <p className="font-bold">NT${(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* 【維持不變】訂單資訊區塊 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">送貨與付款</h3>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">城市/縣市</label>
              <select
                className="w-full border p-2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option>台北市</option>
                <option>新北市</option>
                <option>台中市</option>
                <option>高雄市</option>
                <option>台南市</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm">詳細地址</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="例如：中山區南京東路3段20號"
                className="w-full border p-2"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm">付款方式</label>
              <select
                className="w-full border p-2"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="CASH_ON_DELIVERY">貨到付款</option>
                <option value="ONLINE_PAYMENT">線上支付</option>
              </select>
            </div>
          </div>
        </div>

        {/* 【強化】訂單資訊區塊 */}
        <div className="border p-4 rounded-md">
          <h3 className="font-semibold mb-4">訂單資訊</h3>

          {/* 【新增】優惠券選擇區塊 */}
          <div className="mb-4">
            <label className="block mb-1 text-sm">使用優惠券</label>
            <select
              className="w-full border p-2 rounded bg-white disabled:bg-gray-100"
              value={selectedCouponId}
              onChange={(e) => setSelectedCouponId(e.target.value)}
              disabled={availableCoupons.length === 0}
            >
              <option value="">{availableCoupons.length > 0 ? '— 不使用優惠券 —' : '無可用優惠券'}</option>
              {availableCoupons.map(coupon => (
                <option
                  key={coupon.customerCouponId}
                  value={coupon.customerCouponId}
                  disabled={subtotal < coupon.minPurchaseAmount}
                >
                  {coupon.name}
                  {subtotal < coupon.minPurchaseAmount ? ` (低消 NT$${coupon.minPurchaseAmount})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>小計</span>
              <span>NT${subtotal.toLocaleString()}</span>
            </div>

            {/* 【新增】顯示折扣金額 */}
            <div className="flex justify-between text-green-600">
              <span>優惠券折抵</span>
              <span>- NT${discount.toLocaleString()}</span>
            </div>

            <div className="border-t mt-2 pt-2 flex justify-between font-bold text-lg">
              <span>合計</span>
              {/* 【修正】顯示最終金額 */}
              <span>NT${total.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            前往結帳
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
