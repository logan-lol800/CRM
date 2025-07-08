import React, { useRef, useState, useEffect } from "react";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import {
  Button,
  Pagination,
  Modal,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import axios from "../../api/axiosBackend";

const PAGE_SIZE = 10;

const ERPProducts = () => {
  const actionRef = useRef();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [createVisible, setCreateVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [form] = Form.useForm();
  const { confirm } = Modal;

  const fetchData = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const res = await axios.get("/products", {
        params: {
          ...filters,
          page: page - 1, // 後端從 0 開始
          size: PAGE_SIZE,
          sort: "productId",
        },
      });
      setData(res.data.content);
      setTotal(res.data.totalElements);
    } catch (error) {
      console.error("產品清單抓取失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validateFields();
      await axios.post("/products", values);
      message.success("新增成功");
      setCreateVisible(false);
      createForm.resetFields();
      fetchData(currentPage, searchFilters);
    } catch (error) {
      console.error("新增失敗", error);
      message.error("新增失敗");
    }
  };

  const fetchProductDetail = async (id) => {
    try {
      setEditVisible(false);
      const res = await axios.get(`/products/${id}`);
      setSelectedProduct(res.data);
      setDetailVisible(true);
    } catch (error) {
      console.error("取得產品詳情失敗", error);
    }
  };

  const handleDelete = (id) => {
    setDeletingProductId(id);
    setDeleteVisible(true);
  };

  const confirmDelete = async () => {
    try {
      console.log("刪除產品 ID:", deletingProductId);
      await axios.delete(`/products/${deletingProductId}`);
      message.success("刪除成功");
      setDeleteVisible(false);
      fetchData(currentPage, searchFilters);
    } catch (error) {
      console.error("刪除失敗", error);
      message.error("刪除失敗");
    }
  };

  const handleEdit = async (id) => {
    try {
      setDetailVisible(false);
      setEditProduct(null);
      const res = await axios.get(`/products/${id}`);
      const product = res.data;
      setEditProduct(product);
      console.log("編輯產品資料:", product);
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        isSalable: product.isSalable,
        categoryId: product.categoryId,
        unitId: product.unitId,
      });
      setEditVisible(true);
    } catch (err) {
      console.error("取得產品資料失敗", err);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchFilters);
  }, [currentPage, searchFilters]);

  const columns = [
    {
      title: "產品名稱",
      dataIndex: "name",
      copyable: true,
      ellipsis: true,
      formItemProps: {
        label: "產品名稱",
      },
      fieldProps: {
        placeholder: "請輸入產品名稱",
      },
      search: {
        transform: (value) => ({ keyword: value }),
      },
    },
    {
      title: "產品編號",
      dataIndex: "productCode",
      hideInSearch: true,
    },
    {
      title: "分類",
      dataIndex: "categoryName",
      hideInSearch: true,
    },
    {
      title: "價格",
      dataIndex: "basePrice",
      render: (price) => <span>${price.toFixed(2)}</span>,
      hideInSearch: true,
    },
    {
      title: "狀態",
      dataIndex: "isSalable",
      ellipsis: true,
      valueType: "select",
      fieldProps: {
        placeholder: "請選擇",
      },
      valueEnum: {
        true: {
          text: "上架中",
          status: "Success",
        },
        false: {
          text: "已下架",
          status: "Default",
        },
      },
      search: {
        transform: (value) => ({ isSalable: value }),
      },
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (_, record) => [
        <a
          key="edit"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(record.productId);
          }}
        >
          編輯
        </a>,
        <span onClick={(e) => e.stopPropagation()}>
          <TableDropdown
            key="dropdown"
            menus={[{ key: "delete", name: "刪除" }]}
            onSelect={(key) => {
              if (key === "delete") {
                handleDelete(record.productId);
              }
            }}
          />
        </span>,
      ],
      hideInSearch: true,
    },
  ];

  return (
    <div className="bg-white px-2">
      <ProTable
        columns={columns}
        actionRef={actionRef}
        dataSource={data}
        loading={loading}
        rowKey="id"
        search={{
          labelWidth: "auto",
          searchText: "搜尋",
          resetText: "清除",
        }}
        pagination={false}
        dateFormatter="string"
        headerTitle="產品清單"
        options={false}
        onSubmit={(params) => {
          setSearchFilters(params);
          setCurrentPage(1);
        }}
        onRow={(record) => {
          return {
            onClick: () => fetchProductDetail(record.productId),
          };
        }}
        toolBarRender={() => [
          <Button
            key="new"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              createForm.resetFields();
              setCreateVisible(true);
            }}
          >
            新增產品
          </Button>,
        ]}
      />

      <div className="flex justify-center py-4">
        <Pagination
          current={currentPage}
          pageSize={PAGE_SIZE}
          total={total}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>

      <Modal
        title="產品詳細資訊"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
      >
        {selectedProduct && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="產品編號">
              {selectedProduct.productCode}
            </Descriptions.Item>
            <Descriptions.Item label="產品名稱">
              {selectedProduct.name}
            </Descriptions.Item>
            <Descriptions.Item label="描述">
              {selectedProduct.description}
            </Descriptions.Item>
            <Descriptions.Item label="價格">
              ${selectedProduct.basePrice.toFixed(2)}
            </Descriptions.Item>
            <Descriptions.Item label="狀態">
              {selectedProduct.isSalable ? "上架中" : "已下架"}
            </Descriptions.Item>
            <Descriptions.Item label="分類">
              {selectedProduct.categoryName}
            </Descriptions.Item>
            <Descriptions.Item label="單位">
              {selectedProduct.unitName}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="編輯產品"
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        onOk={() => form.submit()}
        okText="儲存"
      >
        {editProduct && (
          <Form
            layout="vertical"
            form={form}
            onFinish={async (values) => {
              try {
                await axios.put(`/products/${editProduct.productId}`, {
                  ...editProduct,
                  ...values,
                });
                message.success("更新成功");
                setEditVisible(false);
                fetchData(currentPage, searchFilters); // 重新載入清單
              } catch (err) {
                message.error("更新失敗");
              }
            }}
          >
            <Form.Item
              label="商品名稱"
              name="name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="描述" name="description">
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="分類"
              name="categoryId"
              rules={[{ required: true, message: "請選擇分類" }]}
            >
              <Select placeholder="請選擇分類">
                <Select.Option value={2}>經典冰淇淋</Select.Option>
                <Select.Option value={3}>水果雪酪</Select.Option>
                <Select.Option value={4}>雪糕系列</Select.Option>
                <Select.Option value={5}>巧酥雪糕系列</Select.Option>
                <Select.Option value={6}>季節限定</Select.Option>
                <Select.Option value={7}>純素系列</Select.Option>
                <Select.Option value={8}>品牌聯名系列</Select.Option>
                <Select.Option value={9}>週邊商品</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="單位"
              name="unitId"
              rules={[{ required: true, message: "請選擇單位" }]}
            >
              <Select placeholder="請選擇單位">
                <Select.Option value={1}>個</Select.Option>
                <Select.Option value={2}>箱</Select.Option>
                <Select.Option value={3}>打</Select.Option>
                <Select.Option value={4}>公克</Select.Option>
                <Select.Option value={5}>支</Select.Option>
                <Select.Option value={6}>杯</Select.Option>
                <Select.Option value={7}>盒</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="售價"
              name="basePrice"
              rules={[
                { required: true },
                { type: "number", min: 0.01, message: "售價必須大於 0" },
              ]}
            >
              <InputNumber min={0.01} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="是否上架"
              name="isSalable"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title="確認刪除"
        open={deleteVisible}
        onOk={confirmDelete}
        onCancel={() => setDeleteVisible(false)}
        okText="確定"
        cancelText="取消"
      >
        <p>確定要刪除這個產品嗎？</p>
      </Modal>

      <Modal
        title="新增產品"
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={handleCreateSubmit}
        okText="新增"
      >
        <Form
          layout="vertical"
          form={createForm}
          initialValues={{ basePrice: 1 }}
        >
          <Form.Item
            label="商品代號"
            name="productCode"
            rules={[{ required: true, message: "商品代號不可為空" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="商品名稱"
            name="name"
            rules={[{ required: true, message: "商品名稱不可為空" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="描述" name="description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="分類"
            name="categoryId"
            rules={[{ required: true, message: "請選擇分類" }]}
          >
            <Select placeholder="請選擇分類">
              <Select.Option value={2}>經典冰淇淋</Select.Option>
              <Select.Option value={3}>水果雪酪</Select.Option>
              <Select.Option value={4}>雪糕系列</Select.Option>
              <Select.Option value={5}>巧酥雪糕系列</Select.Option>
              <Select.Option value={6}>季節限定</Select.Option>
              <Select.Option value={7}>純素系列</Select.Option>
              <Select.Option value={8}>品牌聯名系列</Select.Option>
              <Select.Option value={9}>週邊商品</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="單位"
            name="unitId"
            rules={[{ required: true, message: "請選擇單位" }]}
          >
            <Select placeholder="請選擇單位">
              <Select.Option value={1}>個</Select.Option>
              <Select.Option value={2}>箱</Select.Option>
              <Select.Option value={3}>打</Select.Option>
              <Select.Option value={4}>公克</Select.Option>
              <Select.Option value={5}>支</Select.Option>
              <Select.Option value={6}>杯</Select.Option>
              <Select.Option value={7}>盒</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="售價"
            name="basePrice"
            rules={[
              { required: true, message: "售價不可為空" },
              { type: "number", min: 0.01, message: "售價必須大於 0" },
            ]}
          >
            <InputNumber min={0.01} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ERPProducts;
