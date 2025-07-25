import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { ProgressBar } from '@/components/ProgressBar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 获取用户信息
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // 模拟页面加载状态
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLogout = () => {
    // 记录登出日志
    const logoutData = {
      username: user?.username,
      name: user?.name,
      role: user?.role,
      logoutTime: new Date().toISOString()
    };
    console.log('登出日志:', logoutData);

    // 清除本地存储
    localStorage.removeItem('user');
    localStorage.removeItem('rememberedUsername');
    
    // 跳转到登录页
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          user={user}
          onLogout={handleLogout}
        />
        {loading && <ProgressBar />}
        
        <main className="flex-1 overflow-y-auto p-6 bg-blue-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;