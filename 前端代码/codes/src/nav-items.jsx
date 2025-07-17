import { 
  HomeIcon, 
  UsersIcon, 
  UserPlusIcon, 
  FileTextIcon,
  ListIcon,
  ShoppingCart,
  FileSearch,
  File,
  Package
} from "lucide-react";
import Index from "./pages/Index.jsx";
import CustomerList from "./pages/customer/List.jsx";
import CustomerDetail from "./pages/customer/Detail.jsx";
import CustomerForm from "./pages/customer/Form.jsx";
import SalesOrderList from "./pages/order/SalesOrderList.jsx";
import SalesOrderDetail from "./pages/order/SalesOrderDetail.jsx";
import InquiryQuote from "./pages/order/InquiryQuote.jsx";
import GenerateDeliveryOrder from "./pages/inventory/GenerateDeliveryOrder.jsx";
import DeliveryOrderList from "./pages/inventory/DeliveryOrderList.jsx";
import InvoiceManagement from "./pages/finance/InvoiceManagement.jsx"; // Updated

export const navItems = [
  {
    title: "首页",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "客户管理",
    icon: <UsersIcon className="h-4 w-4" />,
    children: [
      {
        title: "客户列表",
        to: "/customer/list",
        icon: <ListIcon className="h-4 w-4" />,
        page: <CustomerList />,
      },
      {
        title: "新增客户",
        to: "/customer/new",
        icon: <UserPlusIcon className="h-4 w-4" />,
        page: <CustomerForm />,
      }
    ]
  },
  {
    title: "订单管理",
    icon: <ShoppingCart className="h-4 w-4" />,
    children: [
      {
        title: "销售订单管理",
        to: "/order/sales",
        icon: <ListIcon className="h-4 w-4" />,
        page: <SalesOrderList />,
      },
      {
        title: "询价报价处理",
        to: "/order/inquiry",
        icon: <FileSearch className="h-4 w-4" />,
        page: <InquiryQuote />,
      }
    ]
  },
  {
    title: "库存管理",
    icon: <Package className="h-4 w-4" />,
    children: [
      {
        title: "发货单管理",
        to: "/inventory/delivery-orders",
        icon: <ListIcon className="h-4 w-4" />,
        page: <DeliveryOrderList />,
      },
      {
        title: "生成发货单",
        to: "/inventory/generate-delivery",
        icon: <FileTextIcon className="h-4 w-4" />,
        page: <GenerateDeliveryOrder />,
      }
    ]
  },
  {
    title: "财务管理",
    icon: <File className="h-4 w-4" />,
    children: [
      {
        title: "发票管理",
        to: "/finance/invoice-management",
        icon: <FileTextIcon className="h-4 w-4" />,
        page: <InvoiceManagement />, // Updated
      }
    ]
  }
];

export const customerDetailRoutes = (id) => [
  {
    title: "客户详情",
    to: `/customer/detail/${id}`,
    icon: <FileTextIcon className="h-4 w-4" />,
    page: <CustomerDetail customerId={id} />,
  }
];

export const orderDetailRoutes = (id) => [
  {
    title: "订单详情",
    to: `/order/detail/${id}`,
    icon: <FileTextIcon className="h-4 w-4" />,
    page: <SalesOrderDetail orderId={id} />,
  }
];
