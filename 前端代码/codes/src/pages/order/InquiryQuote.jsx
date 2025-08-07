import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, Plus, Filter, Download, Eye, CheckCircle, XCircle, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import CreateInquiry from './CreateInquiry.jsx';

// 获取询价单数据（通过接口）
const fetchInquiries = async ({ pageIndex, pageSize, filters }) => {
  const params = new URLSearchParams();
  if (pageIndex !== undefined) params.append('pageIndex', pageIndex);
  if (pageSize !== undefined) params.append('pageSize', pageSize);
  // 合并后的搜索参数
  if (filters.search) params.append('search', filters.search);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);

  const res = await fetch(`/api/inquiries?${params.toString()}`);
  if (!res.ok) throw new Error('网络错误');
  return await res.json();
};

const InquiryQuote = () => {
  const [pageIndex, setPageIndex] = useState(0);
  // 合并后的搜索参数
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  // 搜索输入框内容
  const [searchInput, setSearchInput] = useState('');
  const inputRef = useRef(null);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const pageSize = 10;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['inquiries', pageIndex, pageSize, filters],
    queryFn: () => fetchInquiries({ pageIndex, pageSize, filters })
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPageIndex(0);
  };

  // 搜索按钮点击或回车时触发搜索
  const handleSearch = () => {
    if (filters.search !== searchInput) {
      setFilters(prev => ({ ...prev, search: searchInput }));
      setPageIndex(1);
    }
  };

  // 清空搜索
  const handleClearSearch = () => {
    setSearchInput('');
    setFilters(prev => ({ ...prev, search: '' }));
    setPageIndex(1);
    inputRef.current && inputRef.current.focus();
  };

  // 输入框回车事件
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 输入框内容变化
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    // 如果清空内容，自动刷新为全部
    if (e.target.value === '') {
      setFilters(prev => ({ ...prev, search: '' }));
      setPageIndex(1);
    }
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

  // 计算显示范围
  const startItem = (pageIndex - 1) * pageSize + 1;
  const endItem = Math.min(pageIndex * pageSize, data?.total || 0);

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
             {/* 搜索按钮移到搜索框左侧（外面），和订单列表一致 */}
            <div className="flex items-center md:col-span-2">
              <Button
                size="icon"
                variant="ghost"
                className="mr-2 text-blue-600 hover:bg-blue-100"
                onClick={handleSearch}
                tabIndex={0}
                aria-label="搜索"
              >
                <Search className="h-4 w-4" />
              </Button>
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  placeholder="搜索询价单号或客户名称"
                  className="pr-8"
                  value={searchInput}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  autoComplete="off"
                />
                {searchInput && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={handleClearSearch}
                    tabIndex={-1}
                    aria-label="清空"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
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
                  <TableRow key={inquiry.inquiryId} className="hover:bg-blue-50">
                    <TableCell className="font-medium">{inquiry.inquiryId}</TableCell>
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
                          onClick={() => handleUpdateStatus(inquiry.inquiryId, '已报价')}
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
