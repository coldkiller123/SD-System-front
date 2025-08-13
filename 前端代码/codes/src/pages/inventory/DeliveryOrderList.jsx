import { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Eye, Search, Package, X } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// /**
//  * 获取已发货和已完成订单的API请求
//  * @param {Object} param0 - 参数对象
//  * @param {number} param0.page - 当前页码
//  * @param {number} param0.pageSize - 每页条数
//  * @param {string} param0.search - 搜索关键字
//  * @returns {Promise<Object>} - 返回订单分页数据
//  */
// const fetchInprocessOrders = async ({ page, pageSize, search }) => {
//   const params = new URLSearchParams();
//   // 只查询“已发货”和“已完成”状态的订单
//   params.append('status', '已发货,已完成');
//   if (page !== undefined) params.append('page', page - 1); // API页码从0开始
//   if (pageSize !== undefined) params.append('page_size', pageSize);
//   if (search) params.append('search', search);

//   // 注意：接口路径已由 /api/orders/delivered 改为 /api/orders/inprocess
//   const res = await fetch(`/api/orders/inprocess?${params.toString()}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//   });
//   if (!res.ok) {
//     throw new Error('获取发货订单失败');
//   }
//   const data = await res.json();
//   if (data.code !== 200) {
//     throw new Error(data.message || '获取发货订单失败');
//   }
//   // 适配后端返回字段
//   return {
//     total: data.data.total,
//     page: data.data.page,
//     pageSize: data.data.page_size,
//     orders: data.data.orders.map(order => ({
//       id: order.id,
//       deliveryOrderId: order.deliveryOrderId,
//       customerName: order.customerName,
//       productName: order.productName,
//       quantity: order.quantity,
//       amount: order.totalAmount,
//       orderDate: order.createdAt,
//       status: order.status,
//     })),
//   };
// };

// /**
//  * 修改订单状态API
//  * @param {Object} param0 - 参数对象
//  * @param {string|number} param0.orderId - 订单ID
//  * @param {string} param0.status - 新的订单状态
//  * @returns {Promise<Object>} - 返回修改结果
//  */
// const updateOrderStatus = async ({ orderId, status }) => {
//   const res = await fetch(`/api/orders/${orderId}/status`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//     body: JSON.stringify({ status }),
//   });
//   const data = await res.json();
//   if (res.ok && data.code === 200) {
//     return data;
//   } else {
//     throw new Error(data.message || '修改订单状态失败');
//   }
// };

// const DeliveryOrderList = () => {
//   // 搜索关键字
//   const [searchTerm, setSearchTerm] = useState('');
//   // 当前页码
//   const [page, setPage] = useState(1);
//   // 每页显示条数
//   const pageSize = 10;
//   // 详情卡片相关
//   const [selectedDeliveryOrder, setSelectedDeliveryOrder] = useState(null);

//   // 批量选择相关
//   const [selectedOrderIds, setSelectedOrderIds] = useState([]);

//   const {
//     data,
//     isLoading,
//     isError,
//     refetch,
//     error,
//   } = useQuery({
//     queryKey: ['inprocessOrders', page, pageSize, searchTerm], // 缓存key
//     queryFn: () => fetchInprocessOrders({ page, pageSize, search: searchTerm }),
//     keepPreviousData: true, // 翻页时保留上一次数据
//   });

//   /**
//    * 修改订单状态的mutation
//    * 成功后自动刷新订单列表
//    * 
//    * 下面的 onSuccess 触发 refetch()，会重新获取订单数据，
//    * 这样页面上按钮的状态（比如“设为已完成”变成“已完成”）会自动切换。
//    * 这就是“点击确认将订单状态修改之后按钮随之切换”的核心逻辑。
//    */
//   const mutation = useMutation({
//     mutationFn: updateOrderStatus,
//     onSuccess: () => {
//       refetch(); // 订单状态修改成功后，刷新订单列表，按钮状态随之切换
//       setSelectedOrderIds([]);
//     },
//   });

//   // 批量操作loading
//   const [batchLoading, setBatchLoading] = useState(false);

//   // 发货单详情卡片的批量设为已完成loading
//   const [detailBatchLoading, setDetailBatchLoading] = useState(false);

//   // 搜索时重置到第一页
//   useEffect(() => {
//     setPage(1);
//   }, [searchTerm]);

//   // 当前页订单数据
//   const orders = data?.orders || [];
//   const totalRecords = data?.total || 0;
//   const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

//   // 仅可选“已发货”订单
//   const selectableOrderIds = useMemo(
//     () => orders.filter(o => o.status === '已发货').map(o => o.id),
//     [orders]
//   );

//   // 当前页全选
//   const isAllSelected = useMemo(() => {
//     if (selectableOrderIds.length === 0) return false;
//     return selectableOrderIds.every(id => selectedOrderIds.includes(id));
//   }, [selectableOrderIds, selectedOrderIds]);

//   // 选中数量
//   const selectedCount = selectedOrderIds.length;

//   // 切换单个订单选择
//   const toggleOrderSelect = (orderId, disabled) => {
//     if (disabled) return;
//     setSelectedOrderIds(prev => {
//       if (prev.includes(orderId)) {
//         return prev.filter(id => id !== orderId);
//       } else {
//         return [...prev, orderId];
//       }
//     });
//   };

//   // 切换全选
//   const toggleSelectAll = () => {
//     if (isAllSelected) {
//       setSelectedOrderIds(prev => prev.filter(id => !selectableOrderIds.includes(id)));
//     } else {
//       setSelectedOrderIds(prev => Array.from(new Set([...prev, ...selectableOrderIds])));
//     }
//   };

//   // 取消选择
//   const handleCancelSelect = () => {
//     setSelectedOrderIds([]);
//   };

//   // 批量设为已完成
//   const handleBatchSetCompleted = async () => {
//     if (selectedOrderIds.length === 0) return;
//     if (!window.confirm('确定要将选中的订单状态批量修改为“已完成”吗？')) return;
//     setBatchLoading(true);
//     try {
//       // 并发批量调用
//       await Promise.all(
//         selectedOrderIds.map(orderId =>
//           updateOrderStatus({ orderId, status: '已完成' })
//         )
//       );
//       setSelectedOrderIds([]);
//       refetch();
//       window.alert('批量操作成功！');
//     } catch (e) {
//       window.alert(e.message || '批量操作失败');
//     } finally {
//       setBatchLoading(false);
//     }
//   };

//   // 查看发货单详情
//   const handleViewDetail = (deliveryOrderId) => {
//     const ordersList = (data?.orders || []).filter(order => order.deliveryOrderId === deliveryOrderId);
//     if (ordersList.length > 0) {
//       setSelectedDeliveryOrder({
//         deliveryOrderId,
//         orders: ordersList,
//         finishTime: new Date().toLocaleString('zh-CN'),
//       });
//     } else {
//       // 没有找到则清空
//       setSelectedDeliveryOrder(null);
//     }
//   };

//   /**
//    * 将订单状态设为“已完成”
//    * @param {string|number} orderId - 订单ID
//    * 
//    * 这里点击确认后会调用 mutation.mutate，触发上面 mutation 的 onSuccess，
//    * 从而刷新数据，按钮状态切换。
//    */
//   const handleChangeStatus = (orderId) => {
//     // 获取当前订单对象
//     const currentOrder = (data?.orders || []).find(order => order.id === orderId);
//     const orderNo = currentOrder ? currentOrder.id : orderId;
//     if (window.confirm(`确定要将订单号为「${orderNo}」的订单状态修改为“已完成”吗？`)) {
//       mutation.mutate({ orderId, status: '已完成' }); // 触发状态变更和按钮切换
//     }
//   };

//   // 发货单详情卡片的“全部设为已完成”按钮处理
//   const handleDetailBatchSetCompleted = async () => {
//     if (
//       !selectedDeliveryOrder ||
//       !selectedDeliveryOrder.orders ||
//       selectedDeliveryOrder.orders.length === 0
//     ) {
//       return;
//     }
//     // 找出该发货单下所有“已发货”状态的订单
//     const toCompleteOrders = selectedDeliveryOrder.orders.filter(
//       order => order.status === '已发货'
//     );
//     if (toCompleteOrders.length === 0) return;
//     if (
//       !window.confirm(
//         `确定要将该发货单下所有“已发货”状态的订单批量设为“已完成”吗？`
//       )
//     )
//       return;
//     setDetailBatchLoading(true);
//     try {
//       await Promise.all(
//         toCompleteOrders.map(order =>
//           updateOrderStatus({ orderId: order.id, status: '已完成' })
//         )
//       );
//       refetch();
//       window.alert('批量操作成功！');
//     } catch (e) {
//       window.alert(e.message || '批量操作失败');
//     } finally {
//       setDetailBatchLoading(false);
//     }
//   };

//   // 计算发货单详情卡片中“已发货”状态的订单数量
//   const detailSelectableCount =
//     selectedDeliveryOrder && selectedDeliveryOrder.orders
//       ? selectedDeliveryOrder.orders.filter(order => order.status === '已发货').length
//       : 0;

// 导入封装的接口（替换本地 fetch 实现）
import { getInprocessOrders, updateOrderStatusToCompleted } from '@/apis/main';

const DeliveryOrderList = () => {
  // 搜索关键字
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  // 当前页码
  const [page, setPage] = useState(1);
  // 每页显示条数
  const pageSize = 10;
  // 详情卡片相关
  const [selectedDeliveryOrder, setSelectedDeliveryOrder] = useState(null);

  // 批量选择相关
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // 查询已发货和已完成订单（使用封装的接口）
  const {
    data,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ['inprocessOrders', page, pageSize, searchTerm], // 缓存key
    queryFn: () => getInprocessOrders({ 
      page, // 传递前端页码（1开始），接口内部会转换为后端需要的格式
      pageSize, 
      search: searchTerm 
    }),
    keepPreviousData: true, // 翻页时保留上一次数据
  });

  /**
   * 修改订单状态的mutation（使用封装的接口）
   * 成功后自动刷新订单列表
   */
  const mutation = useMutation({
    mutationFn: updateOrderStatusToCompleted, // 直接使用封装的接口
    onSuccess: () => {
      refetch(); // 刷新订单列表，更新按钮状态
      setSelectedOrderIds([]);
    },
  });

  /**
   * 批量修改订单状态的mutation
   */
  const batchMutation = useMutation({
    mutationFn: async (orderIds) => {
      // 使用 Promise.allSettled 处理批量请求
      const results = await Promise.allSettled(
        orderIds.map(orderId => updateOrderStatusToCompleted(orderId))
      );
      
      // 统计成功和失败的数量
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      return { successful, failed, total: orderIds.length };
    },
    onSuccess: (data) => {
      refetch();
      setSelectedOrderIds([]);
//       if (data.failed > 0) {
//         window.alert(`批量操作完成：${data.successful}个成功，${data.failed}个失败`);
//       } else {
//         window.alert('批量操作成功！');
//       }
    },
    onError: () => {
//       window.alert('批量操作失败');
    }
  });

  // 搜索时重置到第一页
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // 输入框内容为空时自动刷新
  useEffect(() => {
    if (searchInput === '' && searchTerm !== '') {
      setSearchTerm('');
    }
    // eslint-disable-next-line
  }, [searchInput]);

  // 当前页订单数据
  const orders = data?.orders || [];
  const totalRecords = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  // 仅可选“已发货”订单
  const selectableOrderIds = useMemo(
    () => orders.filter(o => o.status === '已发货').map(o => o.id),
    [orders]
  );

  // 当前页全选状态
  const isAllSelected = useMemo(() => {
    if (selectableOrderIds.length === 0) return false;
    return selectableOrderIds.every(id => selectedOrderIds.includes(id));
  }, [selectableOrderIds, selectedOrderIds]);

  // 选中数量
  const selectedCount = selectedOrderIds.length;

  // 切换单个订单选择
  const toggleOrderSelect = (orderId, disabled) => {
    if (disabled) return;
    setSelectedOrderIds(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  // 切换全选
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrderIds(prev => prev.filter(id => !selectableOrderIds.includes(id)));
    } else {
      setSelectedOrderIds(prev => Array.from(new Set([...prev, ...selectableOrderIds])));
    }
  };

  // 取消选择
  const handleCancelSelect = () => {
    setSelectedOrderIds([]);
  };

  // 批量设为已完成
  const handleBatchSetCompleted = async () => {
    if (selectedOrderIds.length === 0) return;
    if (!window.confirm('确定要将选中的订单状态批量修改为“已完成”吗？')) return;
    // 使用批量mutation
    batchMutation.mutate(selectedOrderIds);
  };

  // 查看发货单详情
  const handleViewDetail = (deliveryOrderId) => {
    const ordersList = (data?.orders || []).filter(order => order.deliveryOrderId === deliveryOrderId);
    if (ordersList.length > 0) {
      setSelectedDeliveryOrder({
        deliveryOrderId,
        orders: ordersList,
        finishTime: new Date().toLocaleString('zh-CN'),
      });
    } else {
      setSelectedDeliveryOrder(null);
    }
  };

  /**
   * 将单个订单状态设为“已完成”
   * @param {string|number} orderId - 订单ID
   */
  const handleChangeStatus = (orderId) => {
    // 获取当前订单对象
    const currentOrder = (data?.orders || []).find(order => order.id === orderId);
    const orderNo = currentOrder ? currentOrder.id : orderId;
    if (window.confirm(`确定要将订单号为「${orderNo}」的订单状态修改为“已完成”吗？`)) {
      mutation.mutate(orderId);
    }
  };

  // 发货单详情卡片的“全部设为已完成”按钮处理
  const handleDetailBatchSetCompleted = async () => {
    if (
      !selectedDeliveryOrder ||
      !selectedDeliveryOrder.orders ||
      selectedDeliveryOrder.orders.length === 0
    ) {
      return;
    }
    // 找出该发货单下所有“已发货”状态的订单
    const toCompleteOrders = selectedDeliveryOrder.orders.filter(
      order => order.status === '已发货'
    );
    if (toCompleteOrders.length === 0) return;
    if (
      !window.confirm(
        `确定要将该发货单下所有“已发货”状态的订单批量设为“已完成”吗？`
      )
    )
      return;
    // 使用批量mutation
    batchMutation.mutate(toCompleteOrders.map(order => order.id));
  };

  // 计算发货单详情卡片中“已发货”状态的订单数量
  const detailSelectableCount =
    selectedDeliveryOrder && selectedDeliveryOrder.orders
      ? selectedDeliveryOrder.orders.filter(order => order.status === '已发货').length
      : 0;

  // 搜索框相关逻辑
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    // 只有内容变化时才触发
    if (searchInput.trim() !== searchTerm) {
      setSearchTerm(searchInput.trim());
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    // 自动聚焦
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-blue-100 max-w-5xl mx-auto">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center justify-between">
            <span className="text-blue-800">发货单管理</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                已选中 {selectedCount} 个订单
              </span>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-600"
                onClick={handleCancelSelect}
                disabled={selectedCount === 0}
              >
                <X className="mr-2 h-4 w-4" /> 取消选择
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                disabled={selectedCount === 0 || batchMutation.isLoading}
                onClick={handleBatchSetCompleted}
              >
                {batchMutation.isLoading ? '批量处理中...' : '批量设为已完成'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="mb-6">
            <div className="relative flex items-center space-x-2 w-full">
              {/* 搜索按钮图标，放在搜索框左边外面 */}
              <button
                type="button"
                aria-label="搜索"
                className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                style={{ minWidth: 40, minHeight: 40 }}
                onClick={handleSearch}
              >
                <Search className="h-5 w-5" />
              </button>
              <div className="relative flex-1">
                {/* 删除搜索框内的灰色搜索图标 */}
                <Input 
                  ref={searchInputRef}
                  placeholder="搜索订单号、发货单号或客户名称..." 
                  className="h-12 w-full"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleSearchKeyDown}
                  autoComplete="off"
                  style={{ minWidth: 0 }}
                />
                {/* 清除按钮 */}
                {searchInput && (
                  <button
                    type="button"
                    aria-label="清除"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    style={{ padding: 0, background: 'none', border: 'none', lineHeight: 0 }}
                    onClick={handleClearSearch}
                    tabIndex={-1}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
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
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      disabled={selectableOrderIds.length === 0}
                    />
                  </TableHead>
                  <TableHead className="text-blue-800">发货单编号</TableHead>
                  <TableHead className="text-blue-800">订单编号</TableHead>
                  <TableHead className="text-blue-800">客户名称</TableHead>
                  <TableHead className="text-blue-800">商品名称</TableHead>
                  <TableHead className="text-blue-800">下单日期</TableHead>
                  <TableHead className="text-blue-800">状态</TableHead>
                  <TableHead className="text-blue-800 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div className="text-center py-10">加载中...</div>
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  // 加载失败
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div className="text-center py-10 text-red-500">{error?.message || '加载数据失败'}</div>
                    </TableCell>
                  </TableRow>
                ) : orders.length > 0 ? (
                  orders.map((order) => {
                    const isCompleted = order.status === '已完成';
                    const isChecked = selectedOrderIds.includes(order.id);
                    return (
                      <TableRow key={order.id} className="hover:bg-blue-50">
                        <TableCell>
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded text-blue-600"
                            checked={isChecked}
                            disabled={isCompleted}
                            onChange={() => toggleOrderSelect(order.id, isCompleted)}
                          />
                        </TableCell>
                        <TableCell>{order.deliveryOrderId || '-'}</TableCell>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.productName}</TableCell>
                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                        <TableCell>
                          <span
                            className={
                              order.status === '已发货'
                                ? 'px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 whitespace-nowrap'
                                : 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 whitespace-nowrap'
                            }
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:bg-blue-100"
                            onClick={() => handleViewDetail(order.deliveryOrderId)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {/* 设为已完成按钮，仅“已发货”状态可见 */}
                          {order.status === '已发货' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-2 border-green-300 text-green-700"
                              disabled={mutation.isLoading}
                              onClick={() => handleChangeStatus(order.id)}
                            >
                              设为已完成
                            </Button>
                          )}
                          {/* 已完成按钮，仅“已完成”状态可见且禁用 */}
                          {order.status === '已完成' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-2 border-gray-200 text-gray-400 cursor-not-allowed"
                              disabled
                            >
                              已完成
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  // 无数据时显示空状态
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div className="text-center py-10">
                        <Eye className="h-12 w-12 mx-auto text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium">未找到发货订单</h3>
                        <p className="mt-1 text-gray-600">暂无已发货或已完成的订单</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* 分页按钮区域，仅多页时显示 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                共 {totalRecords} 条记录，第 {page} / {totalPages} 页
              </div>
              <div className="flex space-x-2">
                {/* 首页按钮 */}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-600"
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                >
                  首页
                </Button>
                {/* 上一页按钮 */}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-600"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  上一页
                </Button>
                {/* 下一页按钮 */}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-600"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  下一页
                </Button>
                {/* 末页按钮 */}
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

      {/* 发货单详情卡片 */}
      <Card className="border border-blue-100 max-w-5xl mx-auto">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center justify-between">
            <span className="text-blue-800">发货单详情</span>
            <div>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                disabled={
                  !selectedDeliveryOrder ||
                  !selectedDeliveryOrder.orders ||
                  detailSelectableCount === 0 ||
                  batchMutation.isLoading
                }
                onClick={handleDetailBatchSetCompleted}
              >
                {batchMutation.isLoading ? '批量处理中...' : '全部设为已完成'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDeliveryOrder && selectedDeliveryOrder.orders.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">发货单编号</label>
                  <div className="px-3 py-2 bg-blue-50 rounded-md border border-blue-100">
                    <span className="text-blue-800 font-medium">{selectedDeliveryOrder.deliveryOrderId}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">完成时间</label>
                  <div className="px-3 py-2 bg-blue-50 rounded-md border border-blue-100">
                    {selectedDeliveryOrder.finishTime}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">订单数量</label>
                  <div className="px-3 py-2 bg-blue-50 rounded-md border border-blue-100">
                    {selectedDeliveryOrder.orders.length}
                  </div>
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
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">商品名称</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">数量</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">订单金额</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">下单日期</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">状态</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-100">
                      {selectedDeliveryOrder.orders.map(order => (
                        <tr key={order.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{order.id}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{order.customerName}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{order.productName}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{order.quantity}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">¥{order.amount?.toLocaleString?.() ?? order.amount}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{formatDate(order.orderDate)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <span
                              className={
                                order.status === '已发货'
                                  ? 'px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800'
                                  : 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-800'
                              }
                            >
                              {order.status}
                            </span>
                          </td>
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
              <p className="mt-2 text-gray-600">请点击上方 <Eye className="inline h-4 w-4 text-blue-600" /> 按钮查看发货单详情</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryOrderList;
