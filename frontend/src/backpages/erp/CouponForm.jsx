import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Card,
  Space,
  message,
  Spin, // 用於載入狀態
} from 'antd';
import axiosBackend from '../../api/axiosBackend';
import moment from 'moment'; // 用於處理日期

const { Option } = Select;
const DATE_FORMAT = 'YYYY-MM-DD'; // 統一日期格式

const CouponForm = () => {
  const { couponId } = useParams(); // 從 URL 獲取 couponId，如果存在則為編輯模式
  const navigate = useNavigate();
  const [form] = Form.useForm(); // Ant Design Form 實例
  const [loading, setLoading] = useState(false); // 頁面/表單載入狀態
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (couponId) {
      setIsEditMode(true);
      setLoading(true);
      message.loading({ content: '正在載入優惠券資料...', key: 'loadCoupon' });
      axiosBackend.get(`/erp/coupons/${couponId}`)
        .then(response => {
          if (response.data && response.data.success) {
            const couponData = response.data.data;
            // 需要將日期字符串轉換為 moment 物件以供 DatePicker 使用
            form.setFieldsValue({
              ...couponData,
              validFrom: couponData.validFrom ? moment(couponData.validFrom, DATE_FORMAT) : null,
              validTo: couponData.validTo ? moment(couponData.validTo, DATE_FORMAT) : null,
            });
            message.success({ content: '優惠券資料載入成功!', key: 'loadCoupon' });
          } else {
            message.error({ content: response.data.message || '獲取優惠券詳情失敗', key: 'loadCoupon' });
            navigate('/erp/coupons'); // 獲取失敗則跳轉回列表頁
          }
        })
        .catch(error => {
          message.error({ content: '載入優惠券資料失敗，請檢查網路或聯繫管理員', key: 'loadCoupon' });
          console.error("獲取優惠券詳情失敗:", error);
          navigate('/erp/coupons'); // 獲取失敗則跳轉回列表頁
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setIsEditMode(false);
      // 新增模式下可以設定一些預設值
      form.setFieldsValue({
        discountType: 'percentage', // 預設折扣類型
        status: 'active', // 預設狀態
      });
    }
  }, [couponId, form]);

  // 表單提交成功後的處理函式
  const onFinish = async (values) => {
    setLoading(true);
    // 日期需要格式化回字串再發送給後端
    const payload = {
      ...values,
      validFrom: values.validFrom ? values.validFrom.format(DATE_FORMAT) : null,
      validTo: values.validTo ? values.validTo.format(DATE_FORMAT) : null,
    };

    console.log('表單提交資料 (格式化後):', payload);

    // TODO: 在步驟 11 (新增) 和 步驟 13 (編輯) 中實作 API 呼叫
    if (isEditMode) {
      // TODO: 步驟 13 實作編輯邏輯
      message.loading({ content: '正在更新優惠券...', key: 'updateCoupon' });
      // 模擬 API 呼叫
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success({ content: `模擬編輯成功: ${payload.couponName}`, key: 'updateCoupon' });
      navigate('/erp/coupons');
    } else {
      // 新增邏輯
      try {
        message.loading({ content: '正在建立優惠券...', key: 'createCoupon' });
        const response = await axiosBackend.post('/erp/coupons', payload);
        if (response.data && response.data.success) {
          message.success({ content: response.data.message || '優惠券建立成功!', key: 'createCoupon' });
          navigate('/erp/coupons'); // 成功後跳轉回列表頁
        } else {
          message.error({ content: response.data.message || '建立優惠券失敗，請重試。', key: 'createCoupon' });
        }
      } catch (error) {
        console.error('建立優惠券失敗:', error);
        let errorMessage = '建立優惠券時發生錯誤。';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        message.error({ content: errorMessage, key: 'createCoupon' });
      }
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('表單校驗失敗:', errorInfo);
    message.error('請檢查表單輸入項！');
  };

  return (
    <Spin spinning={loading}>
      <Card title={isEditMode ? '編輯優惠券' : '新增優惠券'}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{ // 可以設定表單欄位的初始預設值
            minPurchaseAmount: 0,
            usageLimit: 100, // 例如預設發行100張
          }}
        >
          <Form.Item
            name="couponName"
            label="優惠券名稱"
            rules={[{ required: true, message: '請輸入優惠券名稱!' }]}
          >
            <Input placeholder="例如：夏季清涼節九折券" />
          </Form.Item>

          <Form.Item
            name="couponCode"
            label="優惠券代碼"
            rules={[
              { required: true, message: '請輸入優惠券代碼!' },
              { pattern: /^[A-Z0-9]+$/, message: '代碼只能包含大寫字母和數字' },
              { min: 6, message: '代碼至少需要6個字元' },
            ]}
            help="用戶將使用此代碼來兌換優惠券，建議使用易於記憶和輸入的組合。"
          >
            <Input placeholder="例如：SUMMERCOOL10" />
          </Form.Item>

          <Form.Item
            name="discountType"
            label="折扣類型"
            rules={[{ required: true, message: '請選擇折扣類型!' }]}
          >
            <Select placeholder="選擇折扣類型">
              <Option value="percentage">百分比折扣 (例如：10%)</Option>
              <Option value="fixed_amount">固定金額折扣 (例如：減 50 元)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discountValue"
            label="折扣值"
            rules={[{ required: true, message: '請輸入折扣值!' }]}
            help="如果是百分比，請輸入數字 (如 10 代表 10%)；如果是固定金額，請輸入金額。"
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="例如：10 或 50" />
          </Form.Item>

          <Form.Item
            name="minPurchaseAmount"
            label="最低消費金額 (可選)"
            help="訂單金額達到此數值才可使用此優惠券，設為 0 或留空則無門檻。"
          >
            <InputNumber min={0} style={{ width: '100%' }} placeholder="例如：199" />
          </Form.Item>

          <Space wrap>
            <Form.Item
              name="validFrom"
              label="有效開始日期"
              rules={[{ required: true, message: '請選擇開始日期!' }]}
            >
              <DatePicker format={DATE_FORMAT} style={{ width: '100%' }} placeholder="選擇日期"/>
            </Form.Item>
            <Form.Item
              name="validTo"
              label="有效結束日期"
              rules={[{ required: true, message: '請選擇結束日期!' }]}
            >
              <DatePicker format={DATE_FORMAT} style={{ width: '100%' }} placeholder="選擇日期"/>
            </Form.Item>
          </Space>

          <Form.Item
            name="usageLimit"
            label="發行總數 / 使用上限"
            rules={[{ required: true, message: '請輸入發行總數!' }]}
            help="此優惠券可被使用的總次數。"
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="例如：1000" />
          </Form.Item>

          <Form.Item
            name="status"
            label="狀態"
            rules={[{ required: true, message: '請選擇狀態!' }]}
          >
            <Select placeholder="選擇優惠券狀態">
              <Option value="active">有效 (Active)</Option>
              <Option value="inactive">未啟用 (Inactive)</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditMode ? '儲存變更' : '建立優惠券'}
              </Button>
              <Button onClick={() => navigate('/erp/coupons')}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </Spin>
  );
};

export default CouponForm;
