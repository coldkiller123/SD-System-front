
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 模拟API获取商品列表
const fetchProducts = async () => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟数据
  return Array.from({ length: 20 }, (_, i) => ({
    id: `P${5000 + i}`,
    name: `商品${i + 1}`,
    category: ['电子产品', '家居用品', '服装', '食品', '办公用品'][i % 5]
  }));
};

// 模拟API获取库存变化历史
const fetchInventoryHistory = async (productId, timeRange) => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 根据时间范围生成数据
  const dataPoints = timeRange === 'month' ? 30 : timeRange === 'week' ? 7 : 90;
  const today = new Date();
  
  return Array.from({ length: dataPoints }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (dataPoints - i - 1));
    
    return {
      date: date.toISOString().split('T')[0],
      inventory: Math.floor(100 + Math.random() * 400),
      change: Math.floor(-50 + Math.random() * 100),
      operationType: ['发货', '入库', '调整', '退货', '报损'][Math.floor(Math.random() * 5)],
      documentId: `DOC${Math.floor(1000 + Math.random() * 9000)}`
    };
  });
};

const ViewInventoryStatus = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('week');
  
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['inventoryProducts'],
    queryFn: fetchProducts
  });
  
  const { data: history, isLoading: historyLoading, refetch } = useQuery({
    queryKey: ['inventoryHistory', selectedProduct, timeRange],
    queryFn: () => fetchInventoryHistory(selectedProduct, timeRange),
    enabled: !!selectedProduct
  });

  const handleProductChange = (productId) => {
    setSelectedProduct(productId);
  };

  if (productsLoading) return <div className="text-center py-10">加载商品列表中...</div>;
  
  return (
    <div className="space-y-6">
      <Card className="border border-blue-100">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center justify-between">
            <span className="text-blue-800">库存状态追踪</span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-300 text-blue-600"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> 刷新数据
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-300 text-blue-600"
              >
                <Download className="h-4 w-4 mr-2" /> 导出数据
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="搜索商品名称或编号..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedProduct} onValueChange={handleProductChange}>
              <SelectTrigger>
                <SelectValue placeholder="选择商品">
                  {selectedProduct ? 
                    products?.find(p => p.id === selectedProduct)?.name : 
                    "选择商品"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {products?.filter(product => 
                  product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  product.id.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} ({product.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="时间范围" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">按日查看</SelectItem>
                <SelectItem value="week">按周查看</SelectItem>
                <SelectItem value="month">按月查看</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="border-blue-200 text-blue-600">
              <Filter className="mr-2 h-4 w-4" /> 更多筛选
            </Button>
          </div>
          
          {selectedProduct ? (
            <>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={history || []}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="inventory" 
                      name="库存数量" 
                      stroke="#3b82f6" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="border border-blue-100 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-blue-50">
                    <TableRow>
                      <TableHead className="text-blue-800">日期</TableHead>
                      <TableHead className="text-blue-800">库存数量</TableHead>
                      <TableHead className="text-blue-800">变动数量</TableHead>
                      <TableHead className="text-blue-800">操作类型</TableHead>
                      <TableHead className="text-blue-800">相关单据</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history?.map((record) => (
                      <TableRow key={record.date} className="hover:bg-blue-50">
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.inventory}</TableCell>
                        <TableCell className={record.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {record.change >= 0 ? '+' : ''}{record.change}
                        </TableCell>
                        <TableCell>{record.operationType}</TableCell>
                        <TableCell>{record.documentId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
              <h3 className="mt-4 text-lg font-medium">请选择商品</h3>
              <p className="mt-1 text-gray-600">从下拉菜单中选择商品查看库存变化历史</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewInventoryStatus;

