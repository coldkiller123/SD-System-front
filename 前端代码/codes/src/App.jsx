import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { navItems, customerDetailRoutes, orderDetailRoutes } from "./nav-items";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import CustomerDetail from "./pages/customer/Detail.jsx";
import SalesOrderDetail from "./pages/order/SalesOrderDetail.jsx";
import SalesOrderForm from "./pages/order/SalesOrderForm.jsx";
import InvoiceManagement from "./pages/finance/InvoiceManagement.jsx";
import { usePermission } from "./hooks/usePermission";

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

// 检查用户是否已登录
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
    setLoading(false);
  }, []);

  return { isAuthenticated, loading };
};

// 权限验证组件
const PermissionRoute = ({ children, path }) => {
  const { hasRoutePermission } = usePermission();
  
  if (!hasRoutePermission(path)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {allRoutes.map(({ to, page }) => (
                <Route 
                  key={to} 
                  path={to} 
                  element={
                    <PermissionRoute path={to}>
                      {page}
                    </PermissionRoute>
                  } 
                />
              ))}
              <Route 
                path="/customer/detail/:id" 
                element={
                  <PermissionRoute path="/customer">
                    <CustomerDetail />
                  </PermissionRoute>
                } 
              />
              <Route 
                path="/order/detail/:id" 
                element={
                  <PermissionRoute path="/order">
                    <SalesOrderDetail />
                  </PermissionRoute>
                } 
              />
              <Route 
                path="/order/sales/edit/:id" 
                element={
                  <PermissionRoute path="/order">
                    <SalesOrderForm />
                  </PermissionRoute>
                } 
              />
              <Route 
                path="/finance/invoice-management" 
                element={
                  <PermissionRoute path="/finance">
                    <InvoiceManagement />
                  </PermissionRoute>
                } 
              />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
