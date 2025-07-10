import React, { useState, useEffect } from 'react';
import useUserStore from '../../stores/userStore';
import axios from '../../api/axiosFrontend'; // 【新增】引入 axios
import { message } from 'antd'; // 【新增】引入 antd 的 message 元件

function Coupons() {
  // --- 狀態管理 ---
  const { user, fetchProfile } = useUserStore();
  const coupons = user?.coupons || [];

  const [couponCode, setCouponCode] = useState(''); // 【新增】管理輸入框的狀態
  const [loading, setLoading] = useState(false); // 【新增】管理兌換按鈕的載入狀態

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  // --- 事件處理 ---
  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) {
      message.error('請輸入優惠券代碼！');
      return;
    }
    setLoading(true);
    try {
      // 【新增】呼叫後端兌換 API
      const response = await axios.post('/customer/coupons/redeem', {
        code: couponCode.trim().toUpperCase(), // 建議轉為大寫以增加匹配成功率
      });

      if (response.data && response.data.success) {
        message.success(response.data.message || '兌換成功！');
        setCouponCode(''); // 清空輸入框
        await fetchProfile(); // 【關鍵】成功後，重新獲取一次個人資料，優惠券列表就會更新
      } else {
        message.error(response.data.message || '兌換失敗，請稍後再試。');
      }
    } catch (error) {
      console.error("兌換優惠券失敗:", error);
      message.error(error.response?.data?.message || '兌換時發生錯誤。');
    } finally {
      setLoading(false);
    }
  };

  // --- 輔助函式 ---
  const formatDiscount = (coupon) => {
    if (coupon.couponType === 'PERCENTAGE') {
      return `${coupon.discountValue / 10}折`;
    }
    if (coupon.couponType === 'FIXED_AMOUNT') {
      return `NT$${coupon.discountValue} 折扣`;
    }
    return '未知優惠';
  };

  return (
    <div className="space-y-6 text-sm">
      <h2 className="text-base font-bold text-gray-800">我的優惠券</h2>

      {/* 【新增】輸入兌換碼區塊 */}
      <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
        <input
          type="text"
          placeholder="請輸入優惠券兌換碼"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs focus:ring-2 focus:ring-logo-blue focus:border-logo-blue transition"
        />
        <button
          onClick={handleRedeemCoupon}
          disabled={loading}
          className="bg-logo-blue text-white px-5 py-2 rounded-md hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
        >
          {loading ? '兌換中...' : '兌換'}
        </button>
      </div>

      {/* 優惠券清單區域 */}
      <div className="border-t border-gray-200 pt-4">
        {coupons.length === 0 ? (
          <p className="text-gray-500">您目前沒有任何優惠券。</p>
        ) : (
          <ul className="space-y-3">
            {coupons.map((coupon) => (
              <li
                key={coupon.customerCouponId}
                className={`flex justify-between items-center p-4 border rounded-lg transition-all ${
                  coupon.status === 'UNUSED'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}
              >
                <div>
                  <div className="font-semibold text-gray-800">{coupon.name}</div>
                  <div className="text-gray-600">{formatDiscount(coupon)}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    到期日: {new Date(coupon.validTo).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    coupon.status === 'UNUSED'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-300 text-gray-600 line-through'
                  }`}
                >
                  {coupon.status === 'UNUSED' ? '可使用' : '已失效'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Coupons;
