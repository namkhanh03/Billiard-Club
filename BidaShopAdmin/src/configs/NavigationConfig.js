import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  FileTextOutlined,
  GiftOutlined,
  ShoppingOutlined,
  UserOutlined,
  FileDoneOutlined,
  TabletOutlined,
  DollarOutlined,
  HomeOutlined,  // Thêm icon mới phù hợp
  BankOutlined,
  TeamOutlined,
  TableOutlined,
  PayCircleOutlined,  // Icon thay thế nếu cần
} from "@ant-design/icons";
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from "configs/AppConfig";

// Lấy user từ localStorage với kiểm tra null
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

// Cấu hình menu cho USER role
const dashBoardNavTreeForUser = [
  {
    key: "dashboards",
    path: `${APP_PREFIX_PATH}/dashboards`,
    title: "sidenav.dashboard",
    icon: DashboardOutlined,
    breadcrumb: false,
    submenu: [
      {
        key: "booking-management",
        path: `${APP_PREFIX_PATH}/apps/booking`,
        title: "sidenav.dashboard.booking-management",
        icon: TabletOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "invoice-management",
        path: `${APP_PREFIX_PATH}/apps/invoice`,
        title: "sidenav.dashboard.invoice-management",
        icon: FileDoneOutlined,
        breadcrumb: true,
        submenu: [],
      }
    ],
  },
];
const dashBoardNavTreeForManager = [
  {
    key: "dashboards",
    path: `${APP_PREFIX_PATH}/dashboards`,
    title: "sidenav.dashboard",
    icon: DashboardOutlined,
    breadcrumb: false,
    submenu: [

      {
        key: "dashboards-default",
        path: `${APP_PREFIX_PATH}/dashboards/default`,
        title: "sidenav.dashboard.default",
        icon: DashboardOutlined,
        breadcrumb: false,
        submenu: [],
      },
      {
        key: "booking-management",
        path: `${APP_PREFIX_PATH}/apps/booking`,
        title: "sidenav.dashboard.booking-management",
        icon: TabletOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "product-main",
        path: `${APP_PREFIX_PATH}/apps/drinkFood`,
        title: "sidenav.dashboard.product-management",
        icon: ShoppingOutlined,
        breadcrumb: true,
        submenu: [
          {
            key: "category-management",
            path: `${APP_PREFIX_PATH}/apps/category`,
            title: "sidenav.dashboard.category",
            icon: AppstoreOutlined,
            breadcrumb: true,
            submenu: [],
          },
          {
            key: "product-details",
            path: `${APP_PREFIX_PATH}/apps/drinkFood`,
            title: "sidenav.dashboard.product",
            icon: TagOutlined,
            breadcrumb: true,
            submenu: []
          }
        ],
      },
      {
        key: "facility-management",
        path: `${APP_PREFIX_PATH}/apps/facility-management`,
        title: "sidenav.dashboard.facility-management",
        icon: HomeOutlined, // Đổi icon từ AppstoreOutlined sang HomeOutlined
        breadcrumb: true,
        submenu: [
          {
            key: "branch-management",
            path: `${APP_PREFIX_PATH}/apps/facility`,
            title: "sidenav.dashboard.branch-management",
            icon: BankOutlined,
            breadcrumb: true,
            submenu: [],
          },
          {
            key: "table-management",
            path: `${APP_PREFIX_PATH}/apps/table`,
            title: "sidenav.dashboard.table-management",
            icon: TableOutlined,
            breadcrumb: true,
            submenu: [],
          },
          {
            key: "finance-management",
            path: `${APP_PREFIX_PATH}/apps/finance`,
            title: "sidenav.dashboard.finance-management",
            icon: DollarOutlined,
            breadcrumb: true,
            submenu: [],
          },
        ],
      },
      {
        key: "invoice-management",
        path: `${APP_PREFIX_PATH}/apps/invoice`,
        title: "sidenav.dashboard.invoice-management",
        icon: FileDoneOutlined,
        breadcrumb: true,
        submenu: [],
      }
    ],
  },
];
const dashBoardNavTreeFull = [
  {
    key: "dashboards",
    path: `${APP_PREFIX_PATH}/dashboards`,
    title: "sidenav.dashboard",
    icon: DashboardOutlined,
    breadcrumb: false,
    submenu: [
      {
        key: "dashboards-default",
        path: `${APP_PREFIX_PATH}/dashboards/default`,
        title: "sidenav.dashboard.default",
        icon: DashboardOutlined,
        breadcrumb: false,
        submenu: [],
      },
      {
        key: "booking-management",
        path: `${APP_PREFIX_PATH}/apps/booking`,
        title: "sidenav.dashboard.booking-management",
        icon: TabletOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "product-main",
        path: `${APP_PREFIX_PATH}/apps/drinkFood`,
        title: "sidenav.dashboard.product-management",
        icon: ShoppingOutlined,
        breadcrumb: true,
        submenu: [
          {
            key: "category-management",
            path: `${APP_PREFIX_PATH}/apps/category`,
            title: "sidenav.dashboard.category",
            icon: AppstoreOutlined,
            breadcrumb: true,
            submenu: [],
          },
          {
            key: "product-details",
            path: `${APP_PREFIX_PATH}/apps/drinkFood`,
            title: "sidenav.dashboard.product",
            icon: TagOutlined,
            breadcrumb: true,
            submenu: []
          }
        ],
      },
      {
        key: "pricing-management",
        path: `${APP_PREFIX_PATH}/apps/pricing`,
        title: "sidenav.dashboard.pricing",
        icon: PayCircleOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "news-management",
        path: `${APP_PREFIX_PATH}/apps/post`,
        title: "sidenav.dashboard.new",
        icon: FileTextOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "facility-management",
        path: `${APP_PREFIX_PATH}/apps/facility-management`,
        title: "sidenav.dashboard.facility-management",
        icon: HomeOutlined, // Đổi icon từ AppstoreOutlined sang HomeOutlined
        breadcrumb: true,
        submenu: [
          {
            key: "branch-management",
            path: `${APP_PREFIX_PATH}/apps/facility`,
            title: "sidenav.dashboard.branch-management",
            icon: BankOutlined,
            breadcrumb: true,
            submenu: [],
          },
          {
            key: "table-management",
            path: `${APP_PREFIX_PATH}/apps/table`,
            title: "sidenav.dashboard.table-management",
            icon: TableOutlined,
            breadcrumb: true,
            submenu: [],
          },
          {
            key: "finance-management",
            path: `${APP_PREFIX_PATH}/apps/finance`,
            title: "sidenav.dashboard.finance-management",
            icon: DollarOutlined,
            breadcrumb: true,
            submenu: [],
          },
        ],
      },
      {
        key: "invoice-management",
        path: `${APP_PREFIX_PATH}/apps/invoice`,
        title: "sidenav.dashboard.invoice-management",
        icon: FileDoneOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "customer-management",
        path: `${APP_PREFIX_PATH}/apps/customer`,
        title: "sidenav.dashboard.customer",
        icon: UserOutlined,
        breadcrumb: true,
        submenu: [],
      },
      {
        key: "user-management",
        path: `${APP_PREFIX_PATH}/apps/user`,
        title: "sidenav.dashboard.user",
        icon: TeamOutlined,
        breadcrumb: true,
        submenu: [],
      }
    ],
  },
];

// Lựa chọn menu hiển thị dựa trên role
const dashBoardNavTree =
  user && user.role === "STAFF" ? dashBoardNavTreeForUser : user && user.role === "MANAGER" ? dashBoardNavTreeForManager : dashBoardNavTreeFull;

const navigationConfig = [...dashBoardNavTree];

export default navigationConfig;
