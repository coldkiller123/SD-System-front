import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Truck, Receipt, Plus, ShoppingCart, Package, RefreshCw } from 'lucide-react';

const Index = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  // 获取用户信息
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // 模拟业务数据
  const stats = [
    { 
      title: '客户总数', 
      value: '1,248', 
      icon: <Users className="h-6 w-6" />, 
      todayNew: '+12 今日新增',
      color: 'blue'
    },
    { 
      title: '订单总数', 
      value: '3,567', 
      icon: <FileText className="h-6 w-6" />, 
      todayNew: '+45 今日新增',
      color: 'green'
    },
    { 
      title: '发货单总数', 
      value: '2,891', 
      icon: <Truck className="h-6 w-6" />, 
      todayNew: '+28 今日新增',
      color: 'purple'
    },
    { 
      title: '发票总数', 
      value: '2,456', 
      icon: <Receipt className="h-6 w-6" />, 
      todayNew: '+32 今日新增',
      color: 'orange'
    }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          欢迎回来，{user?.name || '用户'}！
        </h1>
        <p className="text-blue-100">
          今天是 {new Date().toLocaleDateString('zh-CN')}，您当前的角色是：{user?.role || '未知角色'}
        </p>
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
        {stats.map((stat, index) => (
          <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.todayNew}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* 快捷操作区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-gray-200">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-gray-800">最近动态</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">新客户注册</p>
                    <p className="text-xs text-gray-500">上海科技有限公司 - 2分钟前</p>
                  </div>
                </div>
                <span className="text-xs text-blue-600">客户管理</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">新订单创建</p>
                    <p className="text-xs text-gray-500">订单号：SO20241215001 - 5分钟前</p>
                  </div>
                </div>
                <span className="text-xs text-green-600">销售订单</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">发货单生成</p>
                    <p className="text-xs text-gray-500">发货单号：DO20241215008 - 10分钟前</p>
                  </div>
                </div>
                <span className="text-xs text-purple-600">发货管理</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">发票开具</p>
                    <p className="text-xs text-gray-500">发票号：INV20241215012 - 15分钟前</p>
                  </div>
                </div>
                <span className="text-xs text-orange-600">财务管理</span>
              </div>
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
              onClick={() => window.location.href = '#/customer/new'}
            >
              <Plus className="mr-2 h-4 w-4" /> 新建客户
            </Button>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.location.href = '#/order/sales'}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> 新建销售订单
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={() => console.log('查看库存变化功能待开发')}
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