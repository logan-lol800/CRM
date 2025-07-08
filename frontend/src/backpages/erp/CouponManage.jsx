import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, Pagination, message, Modal } from 'antd'; // Added Modal for delete confirmation
import { useNavigate } from 'react-router-dom';
import axiosBackend from '../../api/axiosBackend'; // Corrected import path

const PAGE_SIZE = 10; // 每頁顯示的項目數量

const CouponManage = () => {
  const actionRef = useRef();
  const navigate = useNavigate();

  const [data, setData] = useState([]); // 表格數據
  const [loading, setLoading] = useState(false); // 載入狀態
  const [total, setTotal] = useState(0); // 總項目數
  const [currentPage, setCurrentPage] = useState(1); // 當前頁碼

  // TODO: 在步驟 8 中實作獲取 Coupon 列表資料的邏輯
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      // 使用 axiosBackend.get 從後端 API 獲取 Coupon 列表
      // 假設 API 路徑為 /api/erp/coupons
      const response = await axiosBackend.get('/erp/coupons', {
        params: {
          page: page,
          pageSize: PAGE_SIZE,
          // 如果有其他篩選或排序參數，也可以在這裡加入
          // e.g., sortBy: 'creationDate', order: 'desc'
        },
      });

      // 根據後端回應的實際格式來設定狀態
      // 假設回應格式為 { data: [], total: 0, success: true }
      if (response.data && response.data.success) {
        setData(response.data.data);
        setTotal(response.data.total);
      } else {
        // 如果後端回應中沒有明確的 success 標誌，但有 data 陣列
        // 也可以直接使用 response.data.data 和 response.data.total
        // 這取決於後端 API 的設計
        setData(response.data?.data || []); // 使用可選鏈和預設空陣列以防萬一
        setTotal(response.data?.total || 0);
        if (!response.data?.success && response.data?.message) {
          message.error(response.data.message || '獲取優惠券列表時發生未知錯誤');
        } else if (!response.data?.success) {
          message.error('獲取優惠券列表時發生未知錯誤');
        }
      }
    } catch (error) {
      console.error('獲取優惠券列表失敗:', error);
      // 更細緻的錯誤處理
      if (error.response) {
        // 請求已發出，伺服器回應了錯誤狀態碼 (例如 40x, 50x)
        message.error(`獲取資料失敗: ${error.response.data?.message || error.response.statusText || '伺服器錯誤'}`);
      } else if (error.request) {
        // 請求已發出，但沒有收到回應
        message.error('網路錯誤，無法連接到伺服器');
      } else {
        // 設定請求時發生了錯誤
        message.error('請求設定錯誤');
      }
      setData([]); // 發生錯誤時清空數據
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 元件載入時或頁碼改變時獲取數據
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      copyable: true,
      ellipsis: true,
    },
    {
      title: '優惠券名稱',
      dataIndex: 'couponName',
      key: 'couponName',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '優惠券代碼',
      dataIndex: 'couponCode',
      key: 'couponCode',
      copyable: true,
    },
    {
      title: '折扣類型',
      dataIndex: 'discountType',
      key: 'discountType',
      valueEnum: {
        percentage: { text: '百分比', status: 'Processing' },
        fixed_amount: { text: '固定金額', status: 'Success' },
      },
    },
    {
      title: '折扣值',
      dataIndex: 'discountValue',
      key: 'discountValue',
      align: 'right',
      render: (value, record) => {
        if (record.discountType === 'percentage') {
          return `${value}%`;
        }
        // 假設是金額，可以加上貨幣符號或格式化
        return `¥${value}`; // 假設是人民幣，你可以根據需要修改
      },
    },
    {
      title: '最低消費',
      dataIndex: 'minPurchaseAmount',
      key: 'minPurchaseAmount',
      align: 'right',
      render: (value) => (value ? `¥${value}` : '-'),
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
        active: { text: '有效', status: 'Success' },
        inactive: { text: '未啟用', status: 'Default' },
        expired: { text: '已過期', status: 'Error' },
        used: { text: '已使用', status: 'Warning' }, // 假設有此狀態
      },
    },
    {
      title: '發行/已用',
      dataIndex: 'usageLimit',
      key: 'usage',
      align: 'center',
      render: (text, record) => `${record.timesUsed || 0} / ${record.usageLimit || '不限'}`,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 120,
      fixed: 'right', // 如果欄位很多，可以固定操作欄
      render: (text, record, _, action) => [
        <a
          key="edit"
          onClick={() => {
            navigate(`/erp/coupon/edit/${record.id}`); // 實際導航到編輯頁
          }}
        >
          編輯
        </a>,
        <a
          key="delete"
          onClick={() => {
            // TODO: 實作刪除邏輯，例如彈出確認 Modal
            Modal.confirm({
              title: '確認刪除',
              content: `確定要刪除優惠券 "${record.couponName}" (ID: ${record.id}) 嗎？此操作無法撤銷。`,
              okText: '確認刪除',
              okType: 'danger',
              cancelText: '取消',
              onOk: async () => {
                try {
                  message.loading({ content: `正在刪除優惠券 ${record.couponName}...`, key: `delete-${record.id}` });
                  const response = await axiosBackend.delete(`/erp/coupons/${record.id}`);
                  if (response.data && response.data.success) {
                    message.success({ content: response.data.message || '優惠券刪除成功!', key: `delete-${record.id}` });
                    // 如果刪除的是當前頁的最後一條數據，且當前頁不是第一頁，可能需要將 currentPage減1
                    if (data.length === 1 && currentPage > 1) {
                      setCurrentPage(currentPage - 1); // 這會觸發 useEffect 重新獲取上一頁數據
                    } else {
                      fetchData(currentPage); // 重新獲取當前頁數據
                    }
                  } else {
                    message.error({ content: response.data.message || '刪除失敗，請重試。', key: `delete-${record.id}` });
                  }
                } catch (error) {
                  console.error('刪除優惠券失敗:', error);
                  let errorMessage = '刪除時發生錯誤。';
                  if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                  } else if (error.message) {
                    errorMessage = error.message;
                  }
                  message.error({ content: errorMessage, key: `delete-${record.id}` });
                }
              },
            });
          }}
          style={{ color: 'red' }} // 讓刪除按鈕醒目一些
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
        search={false} // 暫時禁用搜索，可以配置為 true 並定義 search form
        pagination={false}
        dateFormatter="string" // ProTable 內部日期格式化方式
        headerTitle="優惠券管理列表"
        scroll={{ x: 1300 }} // 如果欄位總寬度超過容器，允許水平滾動
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              navigate('/erp/coupon/new'); // 實際導航到新增頁面
            }}
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
            showSizeChanger={false} // 通常與 PAGE_SIZE 固定搭配使用
          />
        </div>
      )}
    </div>
  );
};

export default CouponManage;
