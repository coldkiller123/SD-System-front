
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, Plus, Filter, Download, Eye, Pencil, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { REGION_OPTIONS, INDUSTRY_OPTIONS, getRegionLabel, getIndustryLabel } from '@/constants/options';
import SearchableSelect from '@/components/SearchableSelect';
import CustomerForm from './Form.jsx';
import { CREDIT_RATING_OPTIONS, getCreditRatingLabel } from '@/constants/options';

// 模拟API获取客户数据
// const fetchCustomers = async ({ pageIndex, pageSize, filters }) => {
//   // 模拟API延迟
//   await new Promise(resolve => setTimeout(resolve, 500));
  
//   // 模拟数据
//   const allCustomers = Array.from({ length: 85 }, (_, i) => ({
//     id: `C${1000 + i}`,
//     name: `客户${i + 1}`,
//     region: ['华东', '华北', '华南', '华中', '西南'][i % 5],
//     industry: ['制造业', '零售业', '金融业', '互联网', '教育'][i % 5],
//     contact: `联系人${i + 1}`,
//     phone: `138${Math.floor(10000000 + Math.random() * 90000000)}`,
//     // address: `地址${i + 1}`,
//     // 新增
//     company: `公司${i + 1}`,
//     creditRating: ['AAA', 'AA', 'A', 'BBB', 'BB'][i % 5],
//     // createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString()
//   }));

//   // 应用筛选
//   let filtered = allCustomers;
//   if (filters.name) {
//     filtered = filtered.filter(c => c.name.includes(filters.name));
//   }
//   if (filters.region && filters.region !== 'all') {
//     filtered = filtered.filter(c => c.region === filters.region);
//   }
//   if (filters.industry && filters.industry !== 'all') {
//     filtered = filtered.filter(c => c.industry === filters.industry);
//   }

//   // 分页
//   const start = pageIndex * pageSize;
//   const end = start + pageSize;
//   const pageCount = Math.ceil(filtered.length / pageSize);
  
//   return {
//     customers: filtered.slice(start, end),
//     total: filtered.length,
//     pageCount
//   };
// };

// HXY前端模拟数据测试
const fetchCustomers = async ({ pageIndex, pageSize, filters }) => {
  const queryParams = new URLSearchParams({
    pageIndex: String(pageIndex),
    pageSize: String(pageSize),
    name: filters.name || '',
    region: filters.region || '',
    industry: filters.industry || '',
    creditRating: filters.creditRating || ''
  });

  const res = await fetch(`/api/customer/list?${queryParams}`);
  const json = await res.json();
  return json.data;
};
// 测试！fetchCustomers只负责请求和获取数据，筛选和分页参数会通过URL传递给后端，由后端返回已经筛选和分页好的数据。


const CustomerList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [filters, setFilters] = useState({
    name: '',
    region: '',
    industry: '',
    creditRating: ''
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const pageSize = 10;

  // 搜索框相关逻辑
  const [searchInput, setSearchInput] = useState('');
  const inputRef = useRef(null);

  // 搜索按钮点击或回车时触发搜索
  const handleSearch = () => {
    if (filters.name !== searchInput) {
      setFilters(prev => ({ ...prev, name: searchInput }));
      setPageIndex(0);
    }
  };

  // 清空搜索
  const handleClearSearch = () => {
    setSearchInput('');
    if (filters.name !== '') {
      setFilters(prev => ({ ...prev, name: '' }));
      setPageIndex(0);
    }
    // 自动聚焦
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // 输入框变化
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    // 如果清空，自动刷新
    if (e.target.value === '') {
      if (filters.name !== '') {
        setFilters(prev => ({ ...prev, name: '' }));
        setPageIndex(0);
      }
    }
  };

  // 回车搜索
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // 其他筛选项变化
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPageIndex(0);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingCustomer(null);
    refetch();
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['customers', pageIndex, filters],
    queryFn: () => fetchCustomers({ pageIndex, pageSize, filters })
  });

  if (isLoading) return <div className="text-center py-10">加载中...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">加载数据失败</div>;

// import { getCustomerList } from '@/apis/main';

// const fetchCustomers = async ({ pageIndex, pageSize, filters }) => {
//   const response = await getCustomerList({
//     pageIndex: pageIndex + 1,
//     pageSize,
//     name: filters.name || '',
//     region: filters.region || '',
//     industry: filters.industry || ''
//   });

//   return response.data;
// };

// const CustomerList = () => {
//   const [pageIndex, setPageIndex] = useState(0);
//   const [filters, setFilters] = useState({
//     name: '',
//     region: '',
//     industry: ''
//   });
//   // 新增：用于临时存储输入框内容
//   const [inputValue, setInputValue] = useState(''); 

//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState(null);
//   const pageSize = 10; // 每页条数，可根据需求修改

//   // 使用React Query调用API
//   const { data, isLoading, isError, refetch } = useQuery({
//     //  queryKey包含所有影响数据的参数，确保参数变化时重新请求
//     queryKey: ['customers', pageIndex, pageSize, filters],
//     queryFn: () => fetchCustomers({ pageIndex, pageSize, filters }),
//     staleTime: 1000 * 60 * 1 // 1分钟缓存，减少重复请求
//   });

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setPageIndex(0); // 筛选条件变化时重置到第一页
//   };

//   const handleEdit = (customer) => {
//     setEditingCustomer(customer);
//     setIsFormOpen(true);
//   };

//   const handleFormSuccess = () => {
//     setIsFormOpen(false);
//     setEditingCustomer(null);
//     refetch(); // 新增/编辑成功后刷新列表
//   };

//   // 加载状态处理
//   if (isLoading) return <div className="text-center py-10">加载中...</div>;
//   // 错误状态处理
//   if (isError) return (
//     <div className="text-center py-10 text-red-500">
//       加载数据失败
//       <Button 
//         variant="ghost" 
//         size="sm" 
//         className="ml-2" 
//         onClick={() => refetch()}
//       >
//         重试
//       </Button>
//     </div>
//   );
//   // 防止数据未加载时的报错（安全处理）
//   if (!data) return null; JSX后端！！

  return (
    <div className="space-y-6">
      <Card className="border border-blue-100">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center justify-between">
            <span className="text-blue-800">客户管理</span>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setEditingCustomer(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> 新增客户
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center">
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
                  placeholder="搜索客户名称"
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
              value={filters.region} 
              onValueChange={(value) => handleFilterChange('region', value)}
              // onOpenChange={(open) => {
              //   if (open) {
              //     setFilters(prev => ({ ...prev, name: inputValue }));
              //     setPageIndex(0);
              //     refetch();
              //   }
              // }} JSX后端测试！！！
            >
              <SelectTrigger>
                <SelectValue placeholder="选择地区" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部地区</SelectItem>
                {/* <SelectItem value="华东">华东</SelectItem>
                <SelectItem value="华北">华北</SelectItem>
                <SelectItem value="华南">华南</SelectItem>
                <SelectItem value="华中">华中</SelectItem>
                <SelectItem value="西南">西南</SelectItem> */}
                {REGION_OPTIONS.map((option) => (
                  <SelectItem key={option.code} value={option.code}>
                    {option.code} {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.industry} 
              onValueChange={(value) => handleFilterChange('industry', value)}
              // onOpenChange={(open) => {
              //   if (open) {
              //     setFilters(prev => ({ ...prev, name: inputValue }));
              //     setPageIndex(0);
              //     refetch();
              //   }
              // }} JSX后端测试！！！
            >
              <SelectTrigger>
                <SelectValue placeholder="选择行业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部行业</SelectItem>
                {/* <SelectItem value="制造业">制造业</SelectItem>
                <SelectItem value="零售业">零售业</SelectItem>
                <SelectItem value="金融业">金融业</SelectItem>
                <SelectItem value="互联网">互联网</SelectItem>
                <SelectItem value="教育">教育</SelectItem> */}
                {INDUSTRY_OPTIONS.map((option) => (
                  <SelectItem key={option.code} value={option.code}>
                    {option.code} {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* <Button variant="outline" className="border-blue-200 text-blue-600">
              <Filter className="mr-2 h-4 w-4" /> 更多筛选
            </Button> */}
            <Select
              value={filters.creditRating}
              onValueChange={value => handleFilterChange('creditRating', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择信用等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部信用等级</SelectItem>
                {CREDIT_RATING_OPTIONS.map(option => (
                  <SelectItem key={option.code} value={option.code}>
                    {option.code} {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="border border-blue-100 rounded-lg overflow-hidden">
            <Table className="text-sm">
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead className="w-[100px] text-blue-800">客户编号</TableHead>
                  <TableHead className="text-blue-800 whitespace-nowrap">客户名称</TableHead>
                  <TableHead className="text-blue-800 whitespace-nowrap">所在地区</TableHead>
                  <TableHead className="text-blue-800 whitespace-nowrap">所属行业</TableHead>
                  <TableHead className="text-blue-800 w-[100px]">所属公司</TableHead>
                  <TableHead className="text-blue-800">联系电话</TableHead>
                  <TableHead className="text-blue-800 whitespace-nowrap w-[100px]">联系人</TableHead>
                  <TableHead className="text-blue-800 whitespace-nowrap">信用等级</TableHead>
                  {/* <TableHead className="text-blue-800">创建时间</TableHead> */}
                  <TableHead className="text-blue-800 pl-6">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.customers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-blue-50">
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{getRegionLabel(customer.region)}</TableCell>
                    <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{getIndustryLabel(customer.industry)}</TableCell>
                    <TableCell>{customer.company}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.contacts?.[0]?.name || '—'}</TableCell>
                    {/* 返回联系人下拉框数组中的姓名 */}
                    <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                      <span className={`px-2 py-1 rounded-full text-s ...`}>
                        {getCreditRatingLabel(customer.creditRating)}
                      </span>
                    </TableCell>
                    {/* <TableCell>{formatDate(customer.createdAt)}</TableCell> */}
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-blue-600 hover:bg-blue-100"
                        onClick={() => window.location.href = `#/customer/detail/${customer.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-blue-600 hover:bg-blue-100 ml-1"
                        onClick={() => handleEdit(customer)}
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
            <div className="text-sm text-gray-600 whitespace-nowrap">
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
      
      {/* 客户表单模态框 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CustomerForm 
              initialData={editingCustomer} 
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingCustomer(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;

