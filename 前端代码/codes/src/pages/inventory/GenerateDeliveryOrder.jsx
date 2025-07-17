import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Search, Check, X, PackagePlus, Package } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// 模拟API获取未发货订单
const fetchUnshippedOrders = async () => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟数据 - 状态为"未发货"的订单
  return Array.from({ length: 15 }, (_, i) => ({
    id: `SO${2000 + i}`,
    customerId: `C${1500 + (i % 10)}`,
    customerName: `客户${1500 + (i % 10)}`,
    productName: `商品${i + 1}`,
    quantity: Math.floor(1 + Math.random() * 100),
    orderDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    amount: Math.floor(1000 + Math.random() * 9000),
    status: '未发货'
  }));
};

// 模拟创建发货单API
const createDeliveryOrder = async (orderIds, remarks) => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 在实际应用中，这里会调用后端API创建发货单
  return {
    deliveryOrderId: `DO${Math.floor(1000 + Math.random() * 9000)}`,
    orderIds,
    remarks,
    deliveryTime: new Date().toISOString(),
    warehouseManager: '当前用户'
  };
};

const GenerateDeliveryOrder = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ['unshippedOrders'],
    queryFn: fetchUnshippedOrders
  });

  const toggleOrderSelection = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders?.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders?.map(order => order.id) || []);
    }
  };

  const handleCreateDeliveryOrder = async () => {
    if (selectedOrders.length === 0) return;
    
    setIsCreating(true);
    try {
      const result = await createDeliveryOrder(selectedOrders, remarks);
      console.log('发货单创建成功:', result);
      
      // 在实际应用中，这里会更新订单状态为"已生成发货单"
      // 并导航到发货单详情页或显示成功消息
      alert(`发货单 ${result.deliveryOrderId} 创建成功！`);
      
      // 重置选择
      setSelectedOrders([]);
      setRemarks('');
      
      // 刷新订单列表
      refetch();
    } catch (error) {
      console.error('创建发货单失败:', error);
      alert('创建发货单失败，请重试');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredOrders = orders?.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="text-center py-10">加载中...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">加载数据失败</div>;

  return (
    <div className="space-y-6">
      <Card className="border border-blue-100">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center justify-between">
            <span className="text-blue-800">生成发货单</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                已选择 {selectedOrders.length} 个订单
              </span>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleCreateDeliveryOrder}
                disabled={selectedOrders.length === 0 || isCreating}
              >
                <PackagePlus className="mr-2 h-4 w-4" /> 
                {isCreating ? '创建中...' : '创建发货单'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="搜索订单号、客户名称或商品名称..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Textarea 
                placeholder="发货备注 (最多200字)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                maxLength={200}
                className="pr-16"
              />
              <span className="absolute right-3 bottom-2 text-xs text-gray-500">
                {remarks.length}/200
              </span>
            </div>
          </div>
          
          <div className="border border-blue-100 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="w-12">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded text-blue-600"
                      checked={selectedOrders.length === orders?.length && orders.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-blue-800">订单编号</TableHead>
                  <TableHead className="text-blue-800">客户名称</TableHead>
                  <TableHead className="text-blue-800">商品名称</TableHead>
                  <TableHead className="text-blue-800">数量</TableHead>
                  <TableHead className="text-blue-800">订单金额</TableHead>
                  <TableHead className="text-blue-800">下单日期</TableHead>
                  <TableHead className="text-blue-800">状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders?.map((order) => (
                  <TableRow 
                    key={order.id} 
                    className="hover:bg-blue-50 cursor-pointer"
                    onClick={() => toggleOrderSelection(order.id)}
                  >
                    <TableCell>
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 rounded text-blue-600"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.productName}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>¥{order.amount.toLocaleString()}</TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        {order.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredOrders?.length === 0 && (
            <div className="text-center py-10">
              <Package className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">未找到未发货订单</h3>
              <p className="mt-1 text-gray-600">所有订单已发货或没有符合条件的订单</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="bg-blue-50 border-t border-blue-100 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-600">
              共 {filteredOrders?.length || 0} 条记录
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="border-blue-300 text-blue-600"
                onClick={() => setSelectedOrders([])}
                disabled={selectedOrders.length === 0}
              >
                <X className="mr-2 h-4 w-4" /> 取消选择
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleCreateDeliveryOrder}
                disabled={selectedOrders.length === 0 || isCreating}
              >
                <PackagePlus className="mr-2 h-4 w-4" /> 
                {isCreating ? '创建中...' : '创建发货单'}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      <Card className="border border-blue-100">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800">发货单信息预览</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedOrders.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">发货单状态</label>
                  <div className="px-3 py-2 bg-blue-50 rounded-md border border-blue-100">
                    <span className="text-blue-800 font-medium">待发货</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">发货时间</label>
                  <div className="px-3 py-2 bg-blue-50 rounded-md border border-blue-100">
                    {new Date().toLocaleString('zh-CN')}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">仓库管理员</label>
                  <div className="px-3 py-2 bg-blue-50 rounded-md border border-blue-100">
                    当前用户
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">备注</label>
                <div className="px-3 py-2 bg-blue-50 rounded-md border border-blue-100 min-h-[60px]">
                  {remarks || '无备注'}
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-500 mb-2">包含订单</label>
                <div className="border border-blue-100 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-blue-100">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">订单编号</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">客户名称</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">商品</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">数量</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-100">
                      {selectedOrders.map(orderId => {
                        const order = orders?.find(o => o.id === orderId);
                        return order ? (
                          <tr key={orderId}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{order.id}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{order.customerName}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{order.productName}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{order.quantity}</td>
                          </tr>
                        ) : null;
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Package className="h-10 w-10 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600">请选择订单以预览发货单信息</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateDeliveryOrder;
