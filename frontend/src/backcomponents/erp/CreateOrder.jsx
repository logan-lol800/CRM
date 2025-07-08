import React from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormText,
  ProFormDatePicker,
  ProFormSelect,
  ProFormTextArea,
  ProFormList,
  ProFormDigit,
} from "@ant-design/pro-components";
import axios from "../../api/axiosBackend";

const CreateOrder = ({ onSuccess }) => {
  const handleSubmit = async (values) => {
    try {
      await axios.post("/sales-orders", values);
      message.success("訂單新增成功！");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("新增訂單失敗:", error);
      message.error("新增訂單失敗，請稍後再試");
    }
  };

  return (
    <ProForm
      layout="vertical"
      onFinish={handleSubmit}
      submitter={{
        searchConfig: {
          submitText: "新增訂單",
          resetText: "清除",
        },
        render: (_, dom) => (
          <div style={{ textAlign: "right" }}>
            {dom}
          </div>
        ),
      }}
    >
      <ProFormSelect
        name="customerId"
        label="客戶"
        placeholder="請選擇客戶"
        request={async () => {
          const res = await axios.get("/customers");
          return res.data.content.map((c) => ({
            label: c.name,
            value: c.customerId,
          }));
        }}
        rules={[{ required: true, message: "請選擇客戶" }]}
      />

      <ProFormDatePicker
        name="orderDate"
        label="出貨日期"
        rules={[{ required: true, message: "請選擇出貨日期" }]}
      />

      <ProFormText
        name="shippingAddress"
        label="出貨地址"
        placeholder="請輸入出貨地址"
        rules={[{ required: true, message: "請輸入出貨地址" }]}
      />

      <ProFormText
        name="shippingMethod"
        label="出貨方式"
        placeholder="請輸入出貨方式"
        rules={[{ required: true, message: "請輸入出貨方式" }]}
      />

      <ProFormText
        name="paymentMethod"
        label="付款方式"
        placeholder="請輸入付款方式"
        rules={[{ required: true, message: "請輸入付款方式" }]}
      />

      <ProFormTextArea
        name="remarks"
        label="備註"
        placeholder="請輸入備註"
      />

      <ProFormSelect
        name="warehouseId"
        label="倉庫"
        placeholder="請選擇倉庫"
        request={async () => {
          const res = await axios.get("/warehouses");
          return res.data.content.map((w) => ({
            label: w.name,
            value: w.warehouseId,
          }));
        }}
        rules={[{ required: true, message: "請選擇倉庫" }]}
      />

      <ProFormList
        name="details"
        label="訂單明細"
        creatorButtonProps={{
          creatorButtonText: "新增商品",
        }}
        initialValue={[
          { productId: null, quantity: 1, unitPrice: 0 },
        ]}
      >
        <ProForm.Group>
          <ProFormSelect
            name="productId"
            label="商品"
            placeholder="請選擇商品"
            request={async () => {
              const res = await axios.get("/products");
              return res.data.content.map((p) => ({
                label: p.name,
                value: p.productId,
              }));
            }}
            rules={[{ required: true, message: "請選擇商品" }]}
          />
          <ProFormDigit
            name="quantity"
            label="數量"
            min={1}
            rules={[{ required: true, message: "請輸入數量" }]}
          />
          <ProFormDigit
            name="unitPrice"
            label="單價"
            min={0}
            rules={[{ required: true, message: "請輸入單價" }]}
          />
        </ProForm.Group>
      </ProFormList>
    </ProForm>
  );
};

export default CreateOrder;
