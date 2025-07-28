
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, Plus, Filter, Download, Eye, Pencil } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import CustomerForm from './Form.jsx';

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

const fetchCustomers = async ({ pageIndex, pageSize, filters }) => {
  const queryParams = new URLSearchParams({
    pageIndex: String(pageIndex),
    pageSize: String(pageSize),
    name: filters.name || '',
    region: filters.region || '',
    industry: filters.industry || ''
  });

  const res = await fetch(`/customer/list?${queryParams}`);
  const json = await res.json();
  return json.data;
};
// 测试！fetchCustomers只负责请求和获取数据，筛选和分页参数会通过URL传递给后端，由后端返回已经筛选和分页好的数据。


const CustomerList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [filters, setFilters] = useState({
    name: '',
    region: '',
    industry: ''
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const pageSize = 10;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['customers', pageIndex, filters],
    queryFn: () => fetchCustomers({ pageIndex, pageSize, filters })
  });

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

  if (isLoading) return <div className="text-center py-10">加载中...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">加载数据失败</div>;

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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="搜索客户名称" 
                className="pl-10"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </div>
            
            <Select 
              value={filters.region} 
              onValueChange={(value) => handleFilterChange('region', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择地区" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部地区</SelectItem>
                <SelectItem value="华东">华东</SelectItem>
                <SelectItem value="华北">华北</SelectItem>
                <SelectItem value="华南">华南</SelectItem>
                <SelectItem value="华中">华中</SelectItem>
                <SelectItem value="西南">西南</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.industry} 
              onValueChange={(value) => handleFilterChange('industry', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择行业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部行业</SelectItem>
                <SelectItem value="制造业">制造业</SelectItem>
                <SelectItem value="零售业">零售业</SelectItem>
                <SelectItem value="金融业">金融业</SelectItem>
                <SelectItem value="互联网">互联网</SelectItem>
                <SelectItem value="教育">教育</SelectItem>
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
                  <TableHead className="w-[100px] text-blue-800">客户编号</TableHead>
                  <TableHead className="text-blue-800">客户名称</TableHead>
                  <TableHead className="text-blue-800">所在地区</TableHead>
                  <TableHead className="text-blue-800">所属行业</TableHead>
                  <TableHead className="text-blue-800 w-[100px]">所属公司</TableHead>
                  <TableHead className="text-blue-800">联系电话</TableHead>
                  <TableHead className="text-blue-800">联系人</TableHead>
                  <TableHead className="text-blue-800">信用等级</TableHead>
                  {/* <TableHead className="text-blue-800">创建时间</TableHead> */}
                  <TableHead className="text-blue-800 pl-6">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.customers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-blue-50">
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.region}</TableCell>
                    <TableCell>{customer.industry}</TableCell>
                    <TableCell>{customer.company}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.contact || customer.contacts?.[0]?.name || '—'}</TableCell>
                    {/* 返回联系人下拉框数组中的姓名 */}
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        customer.creditRating === 'AAA' ? 'bg-green-100 text-green-800' :
                        customer.creditRating === 'AA' ? 'bg-blue-100 text-blue-800' :
                        customer.creditRating === 'A' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {customer.creditRating}
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

