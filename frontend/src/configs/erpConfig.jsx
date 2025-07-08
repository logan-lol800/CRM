import { AppstoreOutlined ,
  UserOutlined,
  RobotOutlined,
  BarChartOutlined,
  DesktopOutlined,
  GiftOutlined, // 新增圖示
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const erpConfig = {
  route: {
    path: '/',
    routes: [
      {
        path: '/erp/dashboard',
        name: '儀表板',
        icon: <AppstoreOutlined />,
      },
      {
        path: '/erp/inventory',
        name: '庫存管理',
        icon: <DesktopOutlined />,
        routes: [
          {
            path: '/erp/inventory/products',
            name: '產品清單',
          },
          {
            path: '/erp/inventory/purchaseorders',
            name: '進貨單管理',
          },
          {
            path: '/erp/inventory/stocklevels',
            name: '庫存明細',
          },
        ],
      },
      {
        path: '/erp/sales',
        name: '銷售管理',
        icon: <BarChartOutlined />,
        routes: [
          {
            path: '/erp/sales/orders',
            name: '訂單管理',
          },
          {
            path: '/erp/sales/customers',
            name: '客戶管理',
          },
          {
            path: '/erp/sales/returns',
            name: '退貨管理',
          },
        ],
      },
      {
        path: '/erp/finance',
        name: '財務管理',
        icon: <UserOutlined />,
      },
      {
        path: '/erp/coupons', // 優惠券列表頁路徑
        name: '優惠券管理',
        icon: <GiftOutlined />, // 使用禮物圖示
      },
    ],
  },
  location: {
    pathname: '/erp/dashboard',
  },
};

export default erpConfig;
