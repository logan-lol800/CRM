import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, Pagination, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosBackend from '../../api/axiosBackend';

const PAGE_SIZE = 10; // 每頁顯示的項目數量

const CouponManage = () => {
  const actionRef = useRef();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      // 【修正】API 路徑，並調整分頁參數以符合 Spring Boot 後端 (page 從 0 開始)
      const response = await axiosBackend.get('/coupons', {
        params: {
          page: page - 1, // Antd 分頁從 1 開始，Spring Boot 從 0 開始
          size: PAGE_SIZE,
        },
      });

      // 【修正】根據 Spring Boot Page 物件的返回格式來設定狀態
      if (response.data) {
        setData(response.data.content); // 列表資料在 content 欄位
        setTotal(response.data.totalElements); // 總筆數在 totalElements 欄位
      }

    } catch (error) {
      console.error('獲取優惠券列表失敗:', error);
      message.error(`獲取資料失敗: ${error.response?.data?.message || '伺服器錯誤'}`);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '優惠券名稱',
      dataIndex: 'name', // 【修正】後端 DTO 欄位為 'name'
      key: 'name',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '優惠券代碼',
      dataIndex: 'code', // 【修正】後端 DTO 欄位為 'code'
      key: 'code',
      copyable: true,
    },
    {
      title: '折扣類型',
      dataIndex: 'couponType', // 【修正】後端 DTO 欄位為 'couponType'
      key: 'couponType',
      valueEnum: {
        PERCENTAGE: { text: '百分比', status: 'Processing' },
        FIXED_AMOUNT: { text: '固定金額', status: 'Success' },
      },
    },
    {
      title: '折扣值',
      dataIndex: 'discountValue',
      key: 'discountValue',
      align: 'right',
      render: (value, record) => {
        if (record.couponType === 'PERCENTAGE') {
          return `${value}%`;
        }
        return `${value} 元`;
      },
    },
    {
      title: '最低消費',
      dataIndex: 'minPurchaseAmount',
      key: 'minPurchaseAmount',
      align: 'right',
      render: (value) => (value > 0 ? `${value} 元` : '-'),
    },
    {
      title: '有效開始日期',
      dataIndex: 'validFrom',
      key: 'validFrom',
      valueType: 'date',
    },
    {
      title: '有效結束日期',
      dataIndex: 'validTo',
      key: 'validTo',
      valueType: 'date',
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        ACTIVE: { text: '有效', status: 'Success' },
        INACTIVE: { text: '未啟用', status: 'Default' },
        EXPIRED: { text: '已過期', status: 'Error' },
      },
    },
    {
      title: '發行/已用',
      key: 'usage',
      align: 'center',
      render: (text, record) => `${record.issuedQuantity || 0} / ${record.totalQuantity || '不限'}`,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 120,
      fixed: 'right',
      render: (text, record, _, action) => [
        <a key="edit" onClick={() => navigate(`/cms/coupon/edit/${record.id}`)}>
          編輯
        </a>,
        <a
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: '確認刪除',
              content: `確定要刪除優惠券 "${record.name}" (ID: ${record.id}) 嗎？`,
              okText: '確認刪除',
              okType: 'danger',
              cancelText: '取消',
              onOk: async () => {
                try {
                  message.loading({ content: `正在刪除...`, key: `delete-${record.id}` });
                  // 【修正】API 路徑和成功判斷邏輯
                  const response = await axiosBackend.delete(`/coupons/${record.id}`);
                  if (response.status === 204) {
                    message.success({ content: '刪除成功!', key: `delete-${record.id}` });
                    if (data.length === 1 && currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    } else {
                      fetchData(currentPage);
                    }
                  } else {
                    message.error({ content: '刪除失敗，請重試。', key: `delete-${record.id}` });
                  }
                } catch (error) {
                  message.error({ content: error.response?.data?.message || '刪除時發生錯誤', key: `delete-${record.id}` });
                }
              },
            });
          }}
          style={{ color: 'red' }}
        >
          刪除
        </a>,
      ],
    },
  ];

  return (
    <div className="bg-white p-4">
      <ProTable
        columns={columns}
        actionRef={actionRef}
        dataSource={data}
        loading={loading}
        rowKey="id"
        search={false}
        pagination={false}
        dateFormatter="string"
        headerTitle="優惠券管理列表"
        scroll={{ x: 1300 }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => navigate('/cms/coupon/new')}
          >
            新增優惠券
          </Button>,
        ]}
      />
      {total > 0 && (
        <div className="flex justify-center py-4">
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default CouponManage;