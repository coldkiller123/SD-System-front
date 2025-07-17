import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Handshake, Contact, Plus, ShoppingCart } from 'lucide-react';

const Index = () => {
  const stats = [
    { title: '客户总数', value: '128', icon: <Users className="h-6 w-6" />, change: '+12%' },
    { title: '本月新增', value: '24', icon: <FileText className="h-6 w-6" />, change: '+8%' },
    { title: '销售订单', value: '86', icon: <ShoppingCart className="h-6 w-6" />, change: '+15%' },
    { title: '成交金额', value: '¥1,280,500', icon: <Handshake className="h-6 w-6" />, change: '+18%' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-blue-100">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
              <div className="bg-blue-100 p-2 rounded-md text-blue-600">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">{stat.change} 较上月</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">最近客户</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-blue-100 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-blue-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">客户名称</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">地区</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">行业</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">状态</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="hover:bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">客户{i + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">华东</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">制造业</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          活跃
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">快捷操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.href = '#/customer/new'}
            >
              <Plus className="mr-2 h-4 w-4" /> 新增客户
            </Button>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => window.location.href = '#/order/sales'}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> 新建销售订单
            </Button>
            <Button variant="outline" className="w-full border-blue-300 text-blue-600">
              导入客户数据
            </Button>
            <Button variant="outline" className="w-full border-blue-300 text-blue-600">
              客户数据分析
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
