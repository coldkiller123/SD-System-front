import { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Search, X, PackagePlus, Package } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// // 获取未发货订单API
// const fetchUnshippedOrders = async ({ page, pageSize, search }) => {
//   const params = new URLSearchParams();
//   if (page !== undefined) params.append('page', page - 1); // API页码从0开始
//   if (pageSize !== undefined) params.append('page_size', pageSize);
//   if (search) params.append('search', search);

//   const res = await fetch(`/api/orders/unshipped?${params.toString()}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//   });
//   if (!res.ok) {
//     throw new Error('获取未发货订单失败');
//   }
//   const data = await res.json();
//   if (data.code !== 200) {
//     throw new Error(data.message || '获取未发货订单失败');
//   }
//   // 适配字段
//   return {
//     total: data.data.total,
//     page: data.data.page,
//     pageSize: data.data.page_size,
//     orders: data.data.orders.map(order => ({
//       id: order.id,
//       customerId: order.customerId,
//       customerName: order.customerName,
//       productName: order.productName,
//       quantity: order.quantity,
//       orderDate: order.createdAt,
//       amount: order.totalAmount,
//       status: order.status,
//     })),
//   };
// };

// // 创建发货单API
// const createDeliveryOrder = async ({ orderIds, remarks, deliveryDate, warehouseManager }) => {
//   const res = await fetch('/api/delivery-orders', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//     body: JSON.stringify({
//       order_ids: orderIds,
//       remarks,
//       deliveryDate,
//       warehouseManager,
//     }),
//   });
//   const data = await res.json();
//   if (res.ok && data.code === 200) {
//     return data;
//   } else if (data && data.error) {
//     const err = new Error(data.error);
//     err.status = data.status;
//     throw err;
//   } else {
//     throw new Error(data.message || '创建发货单失败');
//   }
// };

// const getCurrentUserName = () => {
//   // TODO: 替换为实际登录用户
//   return 'warehouse';
// };

// const GenerateDeliveryOrder = () => {
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [isCreating, setIsCreating] = useState(false);
//   const [page, setPage] = useState(1); // 当前页码
//   const pageSize = 10; // 每页显示条数
//   const navigate = useNavigate();

//   // 新增：用于缓存所有已选订单的详细信息（跨页）
//   const selectedOrderMapRef = useRef({}); // { [orderId]: orderDetail }

//   // 查询未发货订单
//   const {
//     data,
//     isLoading,
//     isError,
//     refetch,
//     error,
//   } = useQuery({
//     queryKey: ['unshippedOrders', page, pageSize, searchTerm],
//     queryFn: () => fetchUnshippedOrders({ page, pageSize, search: searchTerm }),
//     keepPreviousData: true,
//   });

//   // 订单列表
//   const orders = data?.orders || [];
//   const totalRecords = data?.total || 0;
//   const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
//   const pagedOrders = orders;

//   // 搜索时重置到第一页
//   useEffect(() => {
//     setPage(1);
//   }, [searchTerm]);

//   // 新增：每次orders变化时，把当前页中已选中的订单信息补充进缓存
//   useEffect(() => {
//     if (!orders || orders.length === 0) return;
//     setTimeout(() => {
//       // 延迟以确保selectedOrders已更新
//       selectedOrders.forEach(orderId => {
//         if (!selectedOrderMapRef.current[orderId]) {
//           const found = orders.find(o => o.id === orderId);
//           if (found) {
//             selectedOrderMapRef.current[orderId] = found;
//           }
//         }
//       });
//     }, 0);
//     // eslint-disable-next-line
//   }, [orders, selectedOrders]);

//   const toggleOrderSelection = (orderId) => {
//     setSelectedOrders((prev) => {
//       if (prev.includes(orderId)) {
//         // 取消选中时也从缓存中移除
//         const newSelected = prev.filter((id) => id !== orderId);
//         // 不移除缓存，保留历史信息，便于后续优化（如撤销等）
//         return newSelected;
//       } else {
//         // 新增选中时，补充缓存
//         const found = orders.find((o) => o.id === orderId);
//         if (found) {
//           selectedOrderMapRef.current[orderId] = found;
//         }
//         return [...prev, orderId];
//       }
//     });
//   };

//   const toggleSelectAll = () => {
//     const pageOrderIds = pagedOrders.map((order) => order.id);
//     const allSelected = pageOrderIds.every((id) => selectedOrders.includes(id));
//     if (allSelected) {
//       setSelectedOrders((prev) => prev.filter((id) => !pageOrderIds.includes(id)));
//       // 不移除缓存，保留历史信息
//     } else {
//       // 新增选中时，补充缓存
//       pagedOrders.forEach(order => {
//         selectedOrderMapRef.current[order.id] = order;
//       });
//       setSelectedOrders((prev) => Array.from(new Set([...prev, ...pageOrderIds])));
//     }
//   };

//   const handleCreateDeliveryOrder = async () => {
//     if (selectedOrders.length === 0) return;
    
//     setIsCreating(true);
//     try {
//       const deliveryDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
//       const warehouseManager = getCurrentUserName();
//       const result = await createDeliveryOrder({
//         orderIds: selectedOrders,
//         remarks,
//         deliveryDate,
//         warehouseManager,
//       });
//       alert(`发货单 ${result.deliveryOrderId} 创建成功！`);
//       setSelectedOrders([]);
//       setRemarks('');
//       // 清空缓存
//       selectedOrderMapRef.current = {};
//       refetch();
//     } catch (error) {
//       if (error.status === 400) {
//         alert(error.message || '暂不可发货，库存不足等待补货');
//       } else if (error.status === 401) {
//         alert('未授权操作，请重新登录');
//         // navigate('/login'); // 可选
//       } else {
//         alert(error.message || '创建发货单失败，请重试');
//       }
//     } finally {
//       setIsCreating(false);
//     }
//   };

  

//   // 预览区选中订单详情（跨页缓存）
//   const selectedOrderDetails = useMemo(() => {
//     if (!selectedOrders.length) return [];
//     // 优先从缓存中取，缓存没有的再从当前页orders中找
//     return selectedOrders
//       .map(orderId => {
//         return (
//           selectedOrderMapRef.current[orderId] ||
//           orders.find(o => o.id === orderId) ||
//           null
//         );
//       })
//       .filter(Boolean);
//   }, [selectedOrders, orders]);


//   if (isLoading) return <div className="text-center py-10">加载中...</div>;
//   if (isError) return <div className="text-center py-10 text-red-500">{error?.message || '加载数据失败'}</div>;

// 导入封装好的接口（替换原来的 fetch 实现）
import { fetchUnshippedOrders as rawFetchUnshippedOrders, createDeliveryOrder } from '@/apis/main';

const getCurrentUserName = () => {
  // 实际项目中替换为登录用户信息（如从 localStorage 中获取）
  return 'warehouse';
};

// 包装fetchUnshippedOrders，自动将前端页码(page, 从1开始)转为后端页码(从0开始)
const fetchUnshippedOrders = ({ page, pageSize, search }) => {
  // page: 前端从1开始，后端从0开始
  return rawFetchUnshippedOrders({
    page: page - 1,
    pageSize,
    search,
  });
};

const GenerateDeliveryOrder = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  // 新增：用于输入框的受控值
  const [searchInput, setSearchInput] = useState('');
  // 新增：实际用于查询的searchTerm
  const [searchTerm, setSearchTerm] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [page, setPage] = useState(1); // 当前页码（前端从1开始）
  const pageSize = 10; // 每页显示条数
  const navigate = useNavigate();

  // 缓存已选订单信息（跨页保持选中状态）
  const selectedOrderMapRef = useRef({}); // { [orderId]: orderDetail }

  // 查询未发货订单（使用 useQuery 调用封装的接口）
  const {
    data,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ['unshippedOrders', page, pageSize, searchTerm],
    queryFn: () => fetchUnshippedOrders({ 
      page, 
      pageSize, 
      search: searchTerm 
    }),
    keepPreviousData: true, // 切换页码时保留上一页数据，提升体验
  });

  // 订单列表处理
  const orders = data?.orders || [];
  const totalRecords = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  // 搜索时重置到第一页
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // 监听searchInput变化，如果变为空字符串则自动刷新为全部数据
  useEffect(() => {
    if (searchInput === '') {
      // 只有当searchTerm不是空时才需要刷新
      if (searchTerm !== '') {
        setSearchTerm('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // 缓存当前页选中的订单信息
  useEffect(() => {
    if (!orders.length) return;
    selectedOrders.forEach(orderId => {
      if (!selectedOrderMapRef.current[orderId]) {
        const found = orders.find(o => o.id === orderId);
        if (found) {
          selectedOrderMapRef.current[orderId] = found;
        }
      }
    });
  }, [orders, selectedOrders]);

  // 单选/取消订单
  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        // 取消选中
        return prev.filter(id => id !== orderId);
      } else {
        // 新增选中
        return [...prev, orderId];
      }
    });
  };

  // 全选/取消全选当前页
  const toggleSelectAll = () => {
    const pageOrderIds = orders.map(order => order.id);
    const allSelected = pageOrderIds.every(id => selectedOrders.includes(id));
    
    if (allSelected) {
      // 取消当前页全选
      setSelectedOrders(prev => prev.filter(id => !pageOrderIds.includes(id)));
    } else {
      // 选中当前页所有订单
      setSelectedOrders(prev => [...new Set([...prev, ...pageOrderIds])]);
    }
  };

  // 创建发货单（调用封装的接口）
  const handleCreateDeliveryOrder = async () => {
    if (selectedOrders.length === 0) {
      alert('请至少选择一个订单');
      return;
    }

    setIsCreating(true);
    try {
      const deliveryDate = new Date().toISOString().slice(0, 10); // 格式：YYYY-MM-DD
      const warehouseManager = getCurrentUserName();
      
      // 调用创建发货单接口
      const result = await createDeliveryOrder({
        orderIds: selectedOrders,
        remarks,
        deliveryDate,
        warehouseManager,
      });

      alert(`发货单创建成功！单号：${result.deliveryOrderId}`);
      // 重置选择状态
      setSelectedOrders([]);
      setRemarks('');
      selectedOrderMapRef.current = {};
      // 重新获取订单列表（状态已更新为“已发货”）
      refetch();
    } catch (err) {
      // 处理错误（库存不足、未授权等）
      if (err.response?.status === 400) {
        alert('创建失败：库存不足，无法发货');
      } else if (err.response?.status === 401) {
        alert('未授权操作，请重新登录');
        navigate('/login');
      } else {
        alert(`创建失败：${err.message || '服务器错误'}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // 预览选中的订单详情
  const selectedOrderDetails = useMemo(() => {
    return selectedOrders
      .map(orderId => selectedOrderMapRef.current[orderId] || orders.find(o => o.id === orderId))
      .filter(Boolean);
  }, [selectedOrders, orders]);

  // 加载状态和错误状态处理
  if (isLoading) return <div className="text-center py-10">加载中...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">{error?.message || '加载失败'}</div>;


  return (
    <div className="space-y-6">
      {/* 发货单生成卡片，去除底部后适当减小padding */}
      <Card className="border border-blue-100 max-w-5xl mx-auto">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center justify-between">
            <span className="text-blue-800">生成发货单</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                已选择 {selectedOrders.length} 个订单
              </span>
              {/* 取消选择按钮，放到顶部 */}
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-600"
                onClick={() => {
                  setSelectedOrders([]);
                  selectedOrderMapRef.current = {};
                }}
                disabled={selectedOrders.length === 0}
              >
                <X className="mr-2 h-4 w-4" /> 取消选择
              </Button>
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
        
        <CardContent className="pt-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            
            <div className="relative md:col-span-2 flex items-center space-x-2">
              {/* 搜索按钮图标，放在搜索框左边外面 */}
              <button
                type="button"
                aria-label="搜索"
                className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                style={{ minWidth: 40, minHeight: 40 }}
                onClick={() => setSearchTerm(searchInput)}
              >
                <Search className="h-5 w-5" />
              </button>
              <div className="relative flex-1">
                <Input 
                  placeholder="搜索订单号、客户名称或商品名称..." 
                  className="h-12"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      setSearchTerm(searchInput);
                    }
                  }}
                />
                {/* 清除按钮 */}
                {searchInput && (
                  <button
                    type="button"
                    aria-label="清除"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    style={{ padding: 0, background: 'none', border: 'none', lineHeight: 0 }}
                    onClick={() => setSearchInput('')}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="relative">
              <Textarea 
                placeholder="发货备注 (最多200字)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                maxLength={200}
                className="pr-16 h-12 resize-none" // 统一高度，禁止缩放
                style={{ minHeight: '3rem', maxHeight: '3rem' }} // 3rem约等于h-12
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
                      checked={
                        orders.length > 0 &&
                        orders.every(order => selectedOrders.includes(order.id))
                      }
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
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow 
                      key={order.id} 
                      className="hover:bg-blue-50 cursor-pointer"
                      onClick={() => toggleOrderSelection(order.id)}
                    >
                      <TableCell>
                        {/* 单个订单复选框 */}
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 rounded text-blue-600"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          onClick={(e) => e.stopPropagation()} // 阻止冒泡，避免触发行点击
                        />
                      </TableCell>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>¥{order.amount?.toLocaleString?.() ?? order.amount}</TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          {order.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div className="text-center py-10">
                        <Package className="h-12 w-12 mx-auto text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium">未找到已付款订单</h3>
                        <p className="mt-1 text-gray-600">所有订单已发货或没有符合条件的订单</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* 分页按钮 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                共 {totalRecords} 条记录，第 {page} / {totalPages} 页
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-600"
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                >
                  首页
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-600"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  上一页
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-600"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  下一页
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-600"
                  disabled={page === totalPages}
                  onClick={() => setPage(totalPages)}
                >
                  末页
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
      </Card>
      
      <Card className="border border-blue-100 max-w-5xl mx-auto">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800">发货单信息预览</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedOrders.length > 0 ? (
            <div className="space-y-4">
              {/* 发货单基本信息区域，整体下移 */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {getCurrentUserName()}
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
                      {selectedOrderDetails.map(order => (
                        <tr key={order.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{order.id}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{order.customerName}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{order.productName}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{order.quantity}</td>
                        </tr>
                      ))}
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
