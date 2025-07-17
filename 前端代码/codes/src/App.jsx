import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { navItems, customerDetailRoutes, orderDetailRoutes } from "./nav-items";
import MainLayout from "./layouts/MainLayout";
import CustomerDetail from "./pages/customer/Detail.jsx";
import SalesOrderDetail from "./pages/order/SalesOrderDetail.jsx";
import InvoiceManagement from "./pages/finance/InvoiceManagement.jsx"; // Added

const queryClient = new QueryClient();

const flattenRoutes = (items) => {
  return items.reduce((acc, item) => {
    if (item.children) {
      return [...acc, ...flattenRoutes(item.children)];
    }
    return [...acc, item];
  }, []);
};

const allRoutes = [...flattenRoutes(navItems)];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {allRoutes.map(({ to, page }) => (
              <Route key={to} path={to} element={page} />
            ))}
            <Route path="/customer/detail/:id" element={<CustomerDetail />} />
            <Route path="/order/detail/:id" element={<SalesOrderDetail />} />
            <Route path="/finance/invoice-management" element={<InvoiceManagement />} /> {/* Added */}
          </Route>
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
