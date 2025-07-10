import { DesktopOutlined ,
  UserOutlined,
  AppstoreOutlined,
  RobotOutlined,
  BarChartOutlined,
  GiftOutlined // 新增圖示
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const cmsConfig = {
  route: {
    path: '/',
    routes: [
      {
        path: '/cms/dashboard',
        name: '儀表板',
        icon: <DesktopOutlined />,
      },
      {
        path: '/cms/section',
        name: '欄目資訊',
        icon: <DesktopOutlined />,
      },
      {
        path: '/cms/banner',
        name: '輪播圖管理',
        icon: <DesktopOutlined />,
      },
      {
        path: '/cms/message',
        name: '留言管理',
        icon: <DesktopOutlined />,
      },
      {
        path: '/cms/promotion',
        name: '促銷活動',
        icon: <DesktopOutlined />,
      },
      {
        path: '/cms/system',
        name: '系統管理',
        icon: <DesktopOutlined />,
      },
      {
          path: '/cms/coupons', // 優惠券列表頁路徑
          name: '優惠券管理',
          icon: <GiftOutlined />, // 使用禮物圖示
        },
    ],
  },
  location: {
    pathname: '/cms/dashboard',
  },
};
export default cmsConfig;
