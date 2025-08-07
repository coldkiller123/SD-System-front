import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Truck, Receipt, Plus, ShoppingCart, Package, RefreshCw, Shield } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';
import { PermissionCard } from '@/components/PermissionCard';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const Index = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const { currentRole, originalRole, canSwitchRole, permissions } = usePermission();
  const navigate = useNavigate();

  // 获取用户信息
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // 模拟icon
  const iconMap = {
  Users,
  FileText,
  Package,
  Receipt,
};

  const modules = [
    {
      id: 'customer',
      title: '客户管理',
      description: '管理客户信息、联系记录和信用评估',
      icon: Users,
      color: 'blue',
      path: '/customer/list'
    },
    {
      id: 'sales',
      title: '销售管理',
      description: '处理销售订单、报价和合同管理',
      icon: ShoppingCart,
      color: 'green',
      path: '/order/sales'
    },
    {
      id: 'inventory',
      title: '库存管理',
      description: '管理库存、发货单和物流跟踪',
      icon: Package,
      color: 'purple',
      path: '/inventory/delivery-orders'
    },
    {
      id: 'finance',
      title: '发票管理',
      description: '处理发票开具、收款和财务对账',
      icon: Receipt,
      color: 'red',
      path: '/finance/invoice-management'
    }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleModuleClick = (path) => {
    navigate(path);
  };

  // api/activity.js
 const fetchDashboardData = async () => {
  const res = await fetch('/api/activities/latest');
  if (!res.ok) throw new Error('无法获取最近动态');
  return await res.json(); // 返回一个数组
};

const { data, isLoading } = useQuery({
  queryKey: ['dashboardData'],
  queryFn: fetchDashboardData,
  refetchInterval: 10000, // 每10秒拉取一次
});
  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          欢迎回来，{user?.name || '用户'}！
        </h1>
        <p className="text-blue-100">
          今天是 {new Date().toLocaleDateString('zh-CN')}，您当前的角色是：{currentRole}
        </p>
        {canSwitchRole && (
          <p className="text-sm text-blue-200 mt-1 flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            系统管理员权限，可切换至其他角色
          </p>
        )}
        {!canSwitchRole && currentRole !== originalRole && (
          <p className="text-sm text-yellow-200 mt-1">
            注意：您当前使用的是临时角色，实际角色为 {originalRole}
          </p>
        )}
      </div>

      {/* 数据看板区域 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">业务概览</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          刷新数据
        </Button>
      </div>
      
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {data?.data?.activities?.map((stat, index) => {
    const Icon = iconMap[stat.icon]; // 动态拿到对应图标组件
    return (
      <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">{stat.titleSta}</CardTitle>
          <div className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
            {Icon && <Icon className="h-6 w-6" />} {/* 渲染图标组件 */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
          <p className="text-xs text-gray-500">{stat.todayNew}</p>
        </CardContent>
      </Card>
    );
  })}
</div>


      {/* 权限管理卡片区域 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">功能模块权限</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => (
            <PermissionCard
              key={module.id}
              module={module}
              hasPermission={permissions[module.id]}
              onClick={() => handleModuleClick(module.path)}
            />
          ))}
        </div>
      </div>
      
      {/* 快捷操作区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-gray-200">
  <CardHeader className="bg-gray-50">
    <CardTitle className="text-gray-800">最近动态</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {isLoading ? (
        <p className="text-gray-400 text-sm">加载中...</p>
      ) : (
        data?.data?.activities?.map((item, index) => (
          <div key={index} className={`flex items-center justify-between p-4 rounded-lg bg-${item.color}-50`}>
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full bg-${item.color}-500`}></div>
              <div>
                <p className="text-sm font-medium text-gray-800">{item.titleAct}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
            <span className={`text-xs text-${item.color}-600`}>{item.module}</span>
          </div>
        ))
      )}
    </div>
  </CardContent>
</Card>

        
        <Card className="border border-gray-200">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-gray-800">快捷操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate('/customer/new')}
              disabled={!permissions.customer}
            >
              <Plus className="mr-2 h-4 w-4" /> 新建客户
            </Button>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => navigate('/order/sales')}
              disabled={!permissions.sales}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> 新建销售订单
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/inventory/delivery-orders')}
              disabled={!permissions.inventory}
            >
              <Package className="mr-2 h-4 w-4" /> 查看库存变化
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
