import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, RefreshCw, Warehouse } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 模拟API获取库存数据
const fetchInventory = async () => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟数据
  return Array.from({ length: 25 }, (_, i) => ({
    id: `P${3000 + i}`,
    name: `商品${i + 1}`,
    category: ['电子产品', '家居用品', '服装', '食品', '办公用品'][i % 5],
    currentStock: Math.floor(10 + Math.random() * 500),
    minStock: 50,
    maxStock: 500,
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    location: `A${Math.floor(i/5)+1}-${(i%5)+1}`
  }));
};

// 生成库存图表数据
const generateChartData = (inventory) => {
  const categories = [...new Set(inventory.map(item => item.category))];
  
  return categories.map(category => {
    const itemsInCategory = inventory.filter(item => item.category === category);
    const totalStock = itemsInCategory.reduce((sum, item) => sum + item.currentStock, 0);
    const lowStockItems = itemsInCategory.filter(item => item.currentStock < item.minStock).length;
    
    return {
      category,
      totalStock,
      lowStockItems
    };
  });
};

const ViewInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const { data: inventory, isLoading, isError, refetch } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory
  });

  if (isLoading) return <div className="text-center py-10">加载中...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">加载数据失败</div>;

  const filteredInventory = inventory?.filter(item => 
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter === '' || item.category === categoryFilter)
  );

  const chartData = generateChartData(inventory || []);

  const categories = [...new Set(inventory?.map(item => item.category) || [])];

  return (
    <div className="space-y-6">
      <Card className="border border-blue-100">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center justify-between">
            <span className="text-blue-800">库存概览</span>
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
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="搜索商品名称或编号..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="所有类别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">所有类别</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="border-blue-200 text-blue-600">
              <Filter className="mr-2 h-4 w-4" /> 更多筛选
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="border border-blue-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">总商品种类</CardTitle>
                <div className="bg-blue-100 p-2 rounded-md text-blue-600">
                  <Warehouse className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-800">{inventory?.length || 0}</div>
                <p className="text-xs text-gray-500 mt-1">仓库中所有商品种类</p>
              </CardContent>
            </Card>
            
            <Card className="border border-blue-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">库存总量</CardTitle>
                <div className="bg-green-100 p-2 rounded-md text-green-600">
                  <Warehouse className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-800">
                  {inventory?.reduce((sum, item) => sum + item.currentStock, 0) || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">所有商品库存总量</p>
              </CardContent>
            </Card>
            
            <Card className="border border-blue-100">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">低库存商品</CardTitle>
                <div className="bg-yellow-100 p-2 rounded-md text-yellow-600">
                  <Warehouse className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-800">
                  {inventory?.filter(item => item.currentStock < item.minStock).length || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">库存低于最小值的商品</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalStock" name="库存总量" fill="#3b82f6" />
                <Bar dataKey="lowStockItems" name="低库存商品" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="border border-blue-100 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="text-blue-800">商品编号</TableHead>
                  <TableHead className="text-blue-800">商品名称</TableHead>
                  <TableHead className="text-blue-800">类别</TableHead>
                  <TableHead className="text-blue-800">当前库存</TableHead>
                  <TableHead className="text-blue-800">最小库存</TableHead>
                  <TableHead className="text-blue-800">最大库存</TableHead>
                  <TableHead className="text-blue-800">库位</TableHead>
                  <TableHead className="text-blue-800">最后更新</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory?.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className={item.currentStock < item.minStock ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-blue-50'}
                  >
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className={item.currentStock < item.minStock ? 'text-red-600 font-bold' : ''}>
                      {item.currentStock}
                    </TableCell>
                    <TableCell>{item.minStock}</TableCell>
                    <TableCell>{item.maxStock}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{new Date(item.lastUpdated).toLocaleDateString('zh-CN')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredInventory?.length === 0 && (
            <div className="text-center py-10">
              <Warehouse className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">未找到库存记录</h3>
              <p className="mt-1 text-gray-600">请尝试其他搜索条件</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewInventory;
