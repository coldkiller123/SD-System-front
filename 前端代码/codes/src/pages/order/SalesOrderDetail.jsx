// import { useParams, Link } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Edit, ArrowLeft } from 'lucide-react';
// import { formatDate } from '@/lib/utils';

// // 模拟API获取订单详情
// const fetchOrderDetail = async (id) => {
//   // 模拟API延迟
//   await new Promise(resolve => setTimeout(resolve, 500));
//   // 模拟数据
//   return {
//     id,
//     customerId: `C${1500 + (id.charCodeAt(2) % 20)}`,
//     customerName: `客户${1500 + (id.charCodeAt(2) % 20)}`,
//     productName: `商品${id.charCodeAt(2) % 5 + 1}`,
//     productId: `P${2000 + (id.charCodeAt(2) % 100)}`,
//     quantity: Math.floor(1 + Math.random() * 100),
//     unitPrice: Math.floor(100 + Math.random() * 900),
//     totalAmount: 0, // 稍后计算
//     paidAmount: 0, // 稍后计算
//     status: ['待付款', '已付款',  '已取消'][id.charCodeAt(2) % 5],
//     salesPerson: `销售员${id.charCodeAt(2) % 5 + 1}`,
//     createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
//     remarks: id.charCodeAt(2) % 3 === 0 ? '加急订单' : id.charCodeAt(2) % 3 === 1 ? '普通订单' : '大客户订单',
//     history: [
//       {
//         id: 'H1',
//         action: '创建订单',
//         user: '销售员1',
//         timestamp: new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)).toISOString(),
//         details: '订单初始创建'
//       },
//       {
//         id: 'H2',
//         action: '修改数量',
//         user: '销售员1',
//         timestamp: new Date(Date.now() - Math.floor(Math.random() * 2 * 24 * 60 * 60 * 1000)).toISOString(),
//         details: '数量从10修改为15'
//       },
//       {
//         id: 'H3',
//         action: '更新状态',
//         user: '管理员',
//         timestamp: new Date(Date.now() - Math.floor(Math.random() * 1 * 24 * 60 * 60 * 1000)).toISOString(),
//         details: '状态从待付款更新为已付款'
//       }
//     ]
//   };
// };

// const SalesOrderDetail = () => {
//   const { id } = useParams();
//   const { data: order, isLoading, isError } = useQuery({
//     queryKey: ['order', id],
//     queryFn: () => fetchOrderDetail(id)
//   });

//   if (isLoading) return <div className="text-center py-10">加载中...</div>;
//   if (isError) return <div className="text-center py-10 text-red-500">加载数据失败</div>;

//   // 计算金额
//   order.totalAmount = order.quantity * order.unitPrice;
//   order.paidAmount = order.status === '待付款' ? 0 : 
//                      order.status === '已付款' ? order.totalAmount * 0.5 :
//                      order.totalAmount;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center">
//         <Button 
//           asChild 
//           variant="ghost" 
//           className="text-blue-600 hover:bg-blue-50"
//         >
//           <Link to="/order/sales">
//             <ArrowLeft className="h-4 w-4 mr-2" /> 返回订单列表
//           </Link>
//         </Button>
//       </div>
      
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-blue-800">销售订单详情 - {order.id}</h1>
//         {/* 删除“编辑订单”按钮 */}
//         {/* <div className="flex space-x-2">
//           <Button 
//             className="bg-blue-600 hover:bg-blue-700"
//             onClick={() => window.location.href = `#/order/sales/edit/${order.id}`}
//           >
//             <Edit className="mr-2 h-4 w-4" /> 编辑订单
//           </Button>
//         </div> */}
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <Card className="border border-blue-100">
//             <CardHeader className="bg-blue-50">
//               <CardTitle>订单基本信息</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">订单编号</label>
//                     <p className="mt-1 font-medium">{order.id}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">客户名称</label>
//                     <p className="mt-1">{order.customerName} ({order.customerId})</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">商品名称</label>
//                     <p className="mt-1">{order.productName} ({order.productId})</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">数量</label>
//                     <p className="mt-1">{order.quantity}</p>
//                   </div>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">单价</label>
//                     <p className="mt-1">¥{order.unitPrice.toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">总金额</label>
//                     <p className="mt-1 font-bold text-lg">¥{order.totalAmount.toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">实付金额</label>
//                     <p className="mt-1">¥{order.paidAmount.toLocaleString()}</p>
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">状态</label>
//                     <p className="mt-1">
//                       <span className={`px-2 py-1 rounded-full text-sm ${
//                         order.status === '已完成' ? 'bg-green-100 text-green-800' :
//                         order.status === '已发货' ? 'bg-blue-100 text-blue-800' :
//                         order.status === '已付款' ? 'bg-yellow-100 text-yellow-800' :
//                         order.status === '待付款' ? 'bg-gray-100 text-gray-800' :
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {order.status}
//                       </span>
//                     </p>
//                   </div>
//                   {/* 新增创建时间显示 */}
//                   <div>
//                     <label className="text-sm font-medium text-gray-500">创建时间</label>
//                     <p className="mt-1">{formatDate(order.createdAt)}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="mt-6">
//                 <label className="text-sm font-medium text-gray-500">备注</label>
//                 <p className="mt-1 p-3 bg-gray-50 rounded-md">{order.remarks || '无备注'}</p>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="border border-blue-100 mt-6">
//             <CardHeader className="bg-blue-50">
//               <CardTitle>操作历史</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="border-l-2 border-blue-200 pl-4 space-y-8">
//                 {order.history.map(record => (
//                   <div key={record.id} className="relative">
//                     <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"></div>
//                     <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
//                       <div className="flex justify-between">
//                         <span className="font-medium">{record.action}</span>
//                         <span className="text-sm text-gray-500">{formatDate(record.timestamp)}</span>
//                       </div>
//                       <p className="text-sm text-gray-500 mt-1">操作人: {record.user}</p>
//                       <p className="mt-2">{record.details}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
        
//         <div>
//           <Card className="border border-blue-100">
//             <CardHeader className="bg-blue-50">
//               <CardTitle>其他信息</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-500">销售人员</label>
//                 <p className="mt-1">{order.salesPerson}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">创建时间</label>
//                 <p className="mt-1">{formatDate(order.createdAt)}</p>
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-500">最后更新时间</label>
//                 <p className="mt-1">{formatDate(order.history[0].timestamp)}</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalesOrderDetail;

import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// 导入封装的接口
import { getOrderDetail } from '@/apis/main';

const SalesOrderDetail = () => {
  const { id } = useParams();
  
  // 使用封装的接口获取订单详情
  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderDetail(id), 
    enabled: !!id 
  });

  if (isLoading) return <div className="text-center py-10">加载中...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">
数据失败</div>;
  if (!order) return null; 

  // 处理历史历史记录处理，确保是数组
  const orderHistory = order.history || [];
  
  // 获取最后更新时间
  const getLastUpdateTime = () => {
    if (orderHistory.length > 0) {
      return formatDate(orderHistory[0].modifiedAt);
    }
    // 如果没有历史记录，使用创建时间作为最后更新时间
    return formatDate(order.createdAt);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          asChild 
          variant="ghost" 
          className="text-blue-600 hover:bg-blue-50"
        >
          <Link to="/order/sales">
            <ArrowLeft className="h-4 w-4 mr-2" /> 返回订单列表
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-800">销售订单详情 - {order.id}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border border-blue-100">
            <CardHeader className="bg-blue-50">
              <CardTitle>订单基本信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">订单编号</label>
                    <p className="mt-1 font-medium">{order.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">客户名称</label>
                    <p className="mt-1">{order.customerName} ({order.customerId})</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">商品名称</label>
                    <p className="mt-1">{order.productName} ({order.productId})</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">数量</label>
                    <p className="mt-1">{order.quantity}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">单价</label>
                    <p className="mt-1">¥{order.unitPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">总金额</label>
                    <p className="mt-1 font-bold text-lg">¥{order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">实付金额</label>
                    <p className="mt-1">¥{order.paidAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">状态</label>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        order.status === '已完成' ? 'bg-green-100 text-green-800' :
                        order.status === '已付款' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === '待付款' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">创建时间</label>
                    <p className="mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-500">备注</label>
                <p className="mt-1 p-3 bg-gray-50 rounded-md">{order.remarks || '无备注'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-blue-100 mt-6">
            <CardHeader className="bg-blue-50">
              <CardTitle>操作历史</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-l-2 border-blue-200 pl-4 space-y-8">
                {orderHistory.length > 0 ? (
                  orderHistory.map(record => (
                    <div key={record.id} className="relative">
                      <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"></div>
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {/* 根据备注推断操作类型 */}
                            {record.remarks?.includes('状态') ? '更新状态' : 
                             record.remarks?.includes('数量') ? '修改数量' : 
                             '订单操作'}
                          </span>
                          <span className="text-sm text-gray-500">{formatDate(record.modifiedAt)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">操作人: {record.modifiedBy}</p>
                        <p className="mt-2">{record.remarks || '无操作说明'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 py-4">暂无操作历史记录</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border border-blue-100">
            <CardHeader className="bg-blue-50">
              <CardTitle>其他信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">销售人员</label>
                <p className="mt-1">{order.salesPerson}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">创建时间</label>
                <p className="mt-1">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">最后更新时间</label>
                <p className="mt-1">{getLastUpdateTime()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderDetail;
