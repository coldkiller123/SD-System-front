import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, Plus, Filter, Download, Eye, Pencil } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import SalesOrderForm from './SalesOrderForm.jsx';

// 获取销售订单数据（通过接口）
const fetchSalesOrders = async ({ pageIndex, pageSize, filters }) => {
  const params = new URLSearchParams();
  if (pageIndex !== undefined) params.append('pageIndex', pageIndex);
  if (pageSize !== undefined) params.append('pageSize', pageSize);
  if (filters.orderId) params.append('orderId', filters.orderId);
  if (filters.customerName) params.append('customerName', filters.customerName);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);

  const res = await fetch(`/api/orders?${params.toString()}`);
  if (!res.ok) throw new Error('网络错误');
  return await res.json();
  console.log(res)
};

const SalesOrderList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [filters, setFilters] = useState({
    orderId: '',
    customerName: '',
    status: ''
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const pageSize = 10;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['salesOrders', pageIndex, filters],
    queryFn: () => fetchSalesOrders({ pageIndex, pageSize, filters })
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPageIndex(0);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingOrder(null);
    refetch();
  };

  if (isLoading) return <div className="text-center py-10">加载中...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">加载数据失败</div>;

  return (
    <div className="space-y-6">
      <Card className="border border-blue-100">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center justify-between">
            <span className="text-blue-800">销售订单管理</span>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setEditingOrder(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> 新建订单
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="搜索订单ID" 
                className="pl-10"
                value={filters.orderId}
                onChange={(e) => handleFilterChange('orderId', e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="搜索客户名称" 
                className="pl-10"
                value={filters.customerName}
                onChange={(e) => handleFilterChange('customerName', e.target.value)}
              />
            </div>
            
            <Select 
              value={filters.status} 
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择订单状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="待付款">待付款</SelectItem>
                <SelectItem value="已付款">已付款</SelectItem>
                <SelectItem value="已发货">已发货</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
                <SelectItem value="已取消">已取消</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="border-blue-200 text-blue-600">
              <Filter className="mr-2 h-4 w-4" /> 更多筛选
            </Button>
          </div>
          
          <div className="border border-blue-100 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="w-[120px] text-blue-800">订单编号</TableHead>
                  <TableHead className="text-blue-800">客户名称</TableHead>
                  <TableHead className="text-blue-800">商品名称</TableHead>
                  <TableHead className="text-blue-800">数量</TableHead>
                  <TableHead className="text-blue-800">总金额</TableHead>
                  <TableHead className="text-blue-800">实付金额</TableHead>
                  <TableHead className="text-blue-800">状态</TableHead>
                  <TableHead className="text-blue-800">创建日期</TableHead>
                  <TableHead className="text-right text-blue-800">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
  {(data?.orders ?? []).map((order) => (
    <TableRow key={order.id} className="hover:bg-blue-50">
      <TableCell className="font-medium">{order.id}</TableCell>
      <TableCell>{order.customerName}</TableCell>
      <TableCell>{order.productName}</TableCell>
      <TableCell>{order.quantity}</TableCell>
      <TableCell>¥{order.totalAmount.toLocaleString()}</TableCell>
      <TableCell>¥{order.paidAmount.toLocaleString()}</TableCell>
      <TableCell>
        <span className={`px-2 py-0.5 rounded-full text-xs ${
          order.status === '已完成' ? 'bg-green-100 text-green-800' :
          order.status === '已发货' ? 'bg-blue-100 text-blue-800' :
          order.status === '已付款' ? 'bg-yellow-100 text-yellow-800' :
          order.status === '待付款' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {order.status}
        </span>
      </TableCell>
      <TableCell>{formatDate(order.createdAt)}</TableCell>
      <TableCell className="text-right">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-blue-600 hover:bg-blue-100"
          onClick={() => window.location.href = `#/order/detail/${order.id}`}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-blue-600 hover:bg-blue-100 ml-1"
          onClick={() => handleEdit(order)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              显示 {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, data.total)} 条，共 {data.total} 条记录
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (pageIndex > 0) setPageIndex(pageIndex - 1);
                    }}
                    disabled={pageIndex === 0}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, data.pageCount) }, (_, i) => {
                  const page = i + Math.max(0, Math.min(pageIndex - 2, data.pageCount - 5));
                  if (page >= data.pageCount) return null;
                  
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        href="#" 
                        isActive={page === pageIndex}
                        onClick={(e) => {
                          e.preventDefault();
                          setPageIndex(page);
                        }}
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (pageIndex < data.pageCount - 1) setPageIndex(pageIndex + 1);
                    }}
                    disabled={pageIndex === data.pageCount - 1}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
      
      {/* 订单表单模态框 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <SalesOrderForm 
              initialData={editingOrder} 
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingOrder(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOrderList;