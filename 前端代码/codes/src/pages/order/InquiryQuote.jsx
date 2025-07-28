import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, Plus, Filter, Download, Eye, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import CreateInquiry from './CreateInquiry.jsx';

// 模拟API获取询价单数据
const fetchInquiries = async ({ pageIndex, pageSize, filters }) => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟数据
  const allInquiries = Array.from({ length: 45 }, (_, i) => ({
    id: `IQ${1000 + i}`,
    customerId: `C${1500 + (i % 20)}`,
    customerName: `客户${1500 + (i % 20)}`,
    productName: `商品${i + 1}`,
    productId: `P${2000 + i}`,
    quantity: Math.floor(1 + Math.random() * 100),
    unit: ['个', '件', '千克', '米', '箱'][i % 5],
    salesPerson: `销售员${i % 5 + 1}`,
    inquiryDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    status: i % 3 === 0 ? '已报价' : '未报价',
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
  }));

  // 应用筛选
  let filtered = allInquiries;
  if (filters.inquiryId) {
    filtered = filtered.filter(i => i.id.includes(filters.inquiryId));
  }
  if (filters.customerName) {
    filtered = filtered.filter(i => i.customerName.includes(filters.customerName));
  }
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(i => i.status === filters.status);
  }

  // 分页
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const pageCount = Math.ceil(filtered.length / pageSize);
  
  return {
    inquiries: filtered.slice(start, end),
    total: filtered.length,
    pageCount
  };
};

const InquiryQuote = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [filters, setFilters] = useState({
    inquiryId: '',
    customerName: '',
    status: ''
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const pageSize = 10;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['inquiries', pageIndex, filters],
    queryFn: () => fetchInquiries({ pageIndex, pageSize, filters })
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPageIndex(0);
  };

  const handleUpdateStatus = (inquiryId, newStatus) => {
    // 在实际应用中，这里会调用API更新状态
    console.log(`更新询价单 ${inquiryId} 状态为 ${newStatus}`);
    refetch();
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refetch();
  };

  if (isLoading) return <div className="text-center py-10">加载中...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">加载数据失败</div>;

  return (
    <div className="space-y-6">
      <Card className="border border-blue-100">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center justify-between">
            <span className="text-blue-800">询价报价处理</span>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> 创建询价单
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="搜索询价单号" 
                className="pl-10"
                value={filters.inquiryId}
                onChange={(e) => handleFilterChange('inquiryId', e.target.value)}
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
                <SelectValue placeholder="选择报价状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="未报价">未报价</SelectItem>
                <SelectItem value="已报价">已报价</SelectItem>
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
                  <TableHead className="w-[120px] text-blue-800">询价单号</TableHead>
                  <TableHead className="text-blue-800">客户名称</TableHead>
                  <TableHead className="text-blue-800">商品名称</TableHead>
                  <TableHead className="text-blue-800">数量</TableHead>
                  <TableHead className="text-blue-800">销售人员</TableHead>
                  <TableHead className="text-blue-800">询价日期</TableHead>
                  <TableHead className="text-blue-800">状态</TableHead>
                  <TableHead className="text-right text-blue-800">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id} className="hover:bg-blue-50">
                    <TableCell className="font-medium">{inquiry.id}</TableCell>
                    <TableCell>{inquiry.customerName}</TableCell>
                    <TableCell>{inquiry.productName}</TableCell>
                    <TableCell>{inquiry.quantity} {inquiry.unit}</TableCell>
                    <TableCell>{inquiry.salesPerson}</TableCell>
                    <TableCell>{formatDate(inquiry.inquiryDate)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        inquiry.status === '已报价' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {inquiry.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {inquiry.status === '未报价' ? (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleUpdateStatus(inquiry.id, '已报价')}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" /> 标记为已报价
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 text-gray-600"
                          disabled
                        >
                          <CheckCircle className="mr-1 h-4 w-4" /> 已报价
                        </Button>
                      )}
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
      
      {/* 创建询价单模态框 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateInquiry 
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryQuote;
