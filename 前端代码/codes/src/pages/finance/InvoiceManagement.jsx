// import { useState, useEffect,useMemo } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { Button } from '@/components/ui/button';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { CheckCircle, FileText, Printer, Download, ArrowLeft } from 'lucide-react';
// import { formatDate } from '@/lib/utils';
// import InvoiceDetail from '@/components/invoice/InvoiceDetail';
// import { useNavigate } from 'react-router-dom';
// import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
// import GenerateInvoice from "./GenerateInvoice";
// import InvoicePreview from '@/components/invoice/InvoicePreview';
// import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
// import { Input } from '@/components/ui/input';
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
// import { X } from "lucide-react";
// import { toPng } from 'html-to-image';
// import jsPDF from 'jspdf';
// import { useQueryClient } from '@tanstack/react-query';
// import { useCallback } from 'react';


// // Mock API to fetch orders with "已收货" status

// const fetchDeliveredOrders = async ({ pageIndex = 0, pageSize = 10, searchTerm = '' ,status = 'all'}) => {
//   const params = new URLSearchParams();
//   params.append('pageIndex', pageIndex);
//   params.append('pageSize', pageSize);

//   if (searchTerm.trim()) {
//     params.append('search', searchTerm.trim());
//   }
//     if (status !== 'all') {
//     params.append('status', status);
//   }

//   const res = await fetch(`/api/orders/delivered?${params.toString()}`);
//   if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//   const json = await res.json();

//   const total = json.total || 0;
//   const pageCount = Math.ceil(total / pageSize);

//   return {
//     orders: json.data || [],
//     total,
//     pageCount
//   };
// };

// // Mock API to generate invoice
// // utils/api.js 或 InvoiceManagement.jsx 中
// const generateInvoice = async (orderId) => {
//   try {
//     const res = await fetch(`/api/invoice/generate/${orderId}`, {
//       method: 'POST',
//     });

//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error('生成发票失败:', error);
//     return null;
//   }
// };

// const InvoiceManagement = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [invoiceData, setInvoiceData] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [pageIndex, setPageIndex] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');

//   const pageSize = 10;

//   useEffect(() => {
//     setPageIndex(0);
//   }, [searchTerm]);

//   const { data, isLoading, isError, refetch } = useQuery({
//     queryKey: ['deliveredOrders', pageIndex, pageSize, searchTerm, filterStatus],
//     queryFn: () => fetchDeliveredOrders({
//       pageIndex,
//       pageSize,
//       searchTerm,
//       status: filterStatus
//     }),
//     keepPreviousData: true,
//   });

//   const handleGenerateInvoice = async (order) => {
//     setIsGenerating(true);
//     try {
//       const invoice = await generateInvoice(order.id);

//       if (invoice) {
//         setInvoiceData({
//           ...invoice,
//           order,
//           customer: {
//             id: order.customerId,
//             name: order.customerName,
//             address: invoice.customer.address,
//             taxId: invoice.customer.taxId,
//           },
//           items: invoice.items || [],
//         });

//         const newInvoiceId = invoice.invoiceId;

//         // ✅ 更新 React Query 缓存
//         queryClient.setQueryData(
//           ['deliveredOrders', pageIndex, pageSize, searchTerm, filterStatus],
//           old => {
//             if (!old) return old;
//             return {
//               ...old,
//               orders: old.orders.map(o =>
//                 o.id === order.id ? {
//                   ...o,
//                   hasInvoice: true,
//                   invoiceId: newInvoiceId
//                 } : o
//               )
//             };
//           }
//         );

//         // ✅ 同步更新本地选中订单
//         if (selectedOrder?.id === order.id) {
//           setSelectedOrder(prev => ({
//             ...prev,
//             hasInvoice: true,
//             invoiceId: newInvoiceId
//           }));
//         }
        
//       }
//     } catch (error) {
//       console.error('生成发票失败:', error);
//     } finally {
//       setIsGenerating(false);
//     }
//   };



//   // 打印函数
// const handlePrintClick = useCallback(() => {
//   window.print();
// }, []);

// // 导出 PDF 函数
// const handleExportPDFClick = useCallback(async (invoiceId) => {
//   const invoiceElement = document.getElementById('invoice-preview');
//   if (!invoiceElement) return;

//   try {
//     const dataUrl = await toPng(invoiceElement, {
//       backgroundColor: '#ffffffff',
//       quality: 1.0
//     });

//     const pdf = new jsPDF('p', 'mm', 'a4');
//     const imgProps = pdf.getImageProperties(dataUrl);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();

//     pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`invoice_${invoiceId}.pdf`);
//   } catch (error) {
//     console.error('导出PDF失败:', error);
//     alert('导出PDF失败，请重试');
//   }
// }, []);

//   if (isLoading) return <div className="text-center py-10">加载中...</div>;
//   if (isError) return <div className="text-center py-10 text-red-500">加载数据失败</div>;

//   return (
//     <div className="space-y-6 w-full">
//           <style>{`
//       @media print {
//         body * {
//           visibility: hidden !important;
//         }
//         #invoice-preview,
//         #invoice-preview * {
//           visibility: visible !important;
//         }
//         #invoice-preview {
//           position: absolute !important;
//           top: 0;
//           left: 0;
//           width: 100% !important;
//           background: white !important;
//           z-index: 9999;
//           overflow: visible !important;
//           max-height: none !important;
//         }
//       }
//     `}</style>
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-blue-800">发票管理</h1>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
//         {/* Left Column: Order List */}
//         <Card className="border border-blue-100 lg:col-span-3">
//           <CardHeader className="bg-blue-50">
//             <CardTitle className="text-blue-800">待生成发票订单</CardTitle>

    
//             {/* 搜索框 */}
//             <div className="flex space-x-2 mb-4">
//               <input
//                 type="text"
//                 placeholder="搜索订单编号"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full border border-gray-300 rounded-md p-2"
//               />
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="border px-2 py-2 rounded"
//               >
//                 <option value="all">全部</option>
//                 <option value="invoiced">已开票</option>
//                 <option value="pending">待开票</option>
//               </select>
//             </div>


//           </CardHeader>
//           <CardContent>
            
//             <div className="border border-blue-100 rounded-lg overflow-hidden">
//               <Table className="w-full">
//                 <TableHeader className="bg-blue-50">
//                   <TableRow>
//                     <TableHead className="text-blue-800 min-w-28">订单编号</TableHead>
//                     <TableHead className="text-blue-800 min-w-28">客户名称</TableHead>
//                     <TableHead className="text-blue-800 min-w-28">订单金额</TableHead>
//                     <TableHead className="text-blue-800">收货日期</TableHead>
//                     <TableHead className="text-blue-800">状态</TableHead>
//                     <TableHead className="text-right text-blue-800">操作</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                  {(data?.orders || []).map((order) => (
//                     <TableRow 
//                       key={order.id} 
//                       className="hover:bg-blue-50 cursor-pointer"
//                       onClick={() => {
//                         if (order.hasInvoice) {
//                           setSelectedOrder(order);
//                           // For existing invoices, we'd fetch the invoice data
//                           // For simplicity, we'll simulate it
//                           handleGenerateInvoice(order);
//                         }
//                       }}
//                     >
//                       <TableCell className="font-medium">{order.id}</TableCell>
//                       <TableCell>{order.customerName}</TableCell>
//                       <TableCell>¥{order.amount.toLocaleString()}</TableCell>
//                       <TableCell>{formatDate(order.deliveryDate)}</TableCell>
//                       <TableCell>
//                         {order.hasInvoice ? (
//                           <Badge className="bg-green-100 text-green-800">
//                             <CheckCircle className="h-4 w-4 mr-1" /> 已开票
//                           </Badge>
//                         ) : (
//                           <Badge variant="secondary">待开票</Badge>
//                         )}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         {order.hasInvoice ? (
//                           <Button 
//                             variant="ghost" 
//                             size="sm"
//                             className="text-blue-600"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleGenerateInvoice(order);
//                             }}
//                           >
//                             <FileText className="h-4 w-4 mr-1" /> 查看发票
//                           </Button>
//                         ) : (
//                           <Button 
//                             size="sm" 
//                             className="bg-blue-600 hover:bg-blue-700"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleGenerateInvoice(order);
//                             }}
//                             disabled={isGenerating}
//                           >
//                             <FileText className="h-4 w-4 mr-1" /> 
//                             {isGenerating ? '生成中...' : '生成发票'}
//                           </Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>

//              <div className="mt-6 flex items-center justify-between">
//                         <div className="text-sm text-gray-600">
//                           显示 {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, data.total)} 条，共 {data.total} 条记录
//                         </div>
                        
//                         <Pagination>
//                           <PaginationContent>
//                             <PaginationItem>
//                               <PaginationPrevious 
//                                 href="#" 
//                                 onClick={(e) => {
//                                   e.preventDefault();
//                                   if (pageIndex > 0) setPageIndex(pageIndex - 1);
//                                 }}
//                                 disabled={pageIndex === 0}
//                               />
//                             </PaginationItem>
                            
//                             {Array.from({ length: Math.min(5, data.pageCount) }, (_, i) => {
//                               const page = i + Math.max(0, Math.min(pageIndex - 2, data.pageCount - 5));
//                               if (page >= data.pageCount) return null;
                              
//                               return (
//                                 <PaginationItem key={page}>
//                                   <PaginationLink 
//                                     href="#" 
//                                     isActive={page === pageIndex}
//                                     onClick={(e) => {
//                                       e.preventDefault();
//                                       setPageIndex(page);
//                                     }}
//                                   >
//                                     {page + 1}
//                                   </PaginationLink>
//                                 </PaginationItem>
//                               );
//                             })}
                            
//                             <PaginationItem>
//                               <PaginationNext 
//                                 href="#" 
//                                 onClick={(e) => {
//                                   e.preventDefault();
//                                   if (pageIndex < data.pageCount - 1) setPageIndex(pageIndex + 1);
//                                 }}
//                                 disabled={pageIndex === data.pageCount - 1}
//                               />
//                             </PaginationItem>
//                           </PaginationContent>
//                         </Pagination>
//                       </div>
//           </CardContent>
//         </Card>
        
//         {/* Right Column: Invoice Detail */}
//         <div id="invoice-preview" className={!selectedOrder ? "hidden lg:block lg:col-span-2" : "lg:col-span-2"}>
//           <Card className="border border-blue-100 h-full ">
//             <CardHeader className="bg-blue-50">
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-blue-800">
//                   {invoiceData ? `发票详情 - ${invoiceData.invoiceId}` : '发票预览'}
//                 </CardTitle>
//                 {selectedOrder && (
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="lg:hidden"
//                     onClick={() => setSelectedOrder(null)}
//                   >
//                     <ArrowLeft className="h-5 w-5" />
//                   </Button>
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent className="h-[calc(100%-120px)] overflow-y-auto">
//               {invoiceData ? (
//                 <InvoiceDetail invoice={invoiceData} />
//               ) : (
//                 <div className="flex flex-col items-center justify-center h-full py-12 text-center">
//                   <FileText className="h-16 w-16 text-gray-300 mb-4" />
//                   <h3 className="text-lg font-medium text-gray-500">未选择订单</h3>
//                   <p className="text-gray-400 mt-1">请从左侧列表选择订单生成发票</p>
//                 </div>
//               )}
//             </CardContent>
//             {invoiceData && (
//               <CardFooter className="bg-blue-50 border-t border-blue-100 py-3 justify-center">
//                 <div className="flex space-x-3">
//                       <Button 
//                         variant="outline" 
//                         className="border-blue-300 text-blue-600" 
//                         onClick={handlePrintClick}
//                       >
//                         <Printer className="mr-2 h-4 w-4" /> 打印
//                       </Button>

//                       <Button 
//                         className="bg-blue-600 hover:bg-blue-700"
//                         onClick={() => handleExportPDFClick(selectedOrder.invoiceId)}
//                       >
//                         <Download className="mr-2 h-4 w-4" /> 下载PDF
//                       </Button>
//                 </div>

//               </CardFooter>
//             )}
//             <AlertDialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
//               <AlertDialogContent
//                 className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto wide-dialog"
//                 style={{ maxWidth: '95%', width: '95%', margin: '0 auto' }}
//               >
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>生成发票</AlertDialogTitle>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="absolute top-2 right-2"
//                     onClick={() => setIsPrintDialogOpen(false)}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </AlertDialogHeader>
//                 <GenerateInvoice deliveryOrderId={selectedOrder?.id} />
//               </AlertDialogContent>
//             </AlertDialog>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceManagement;


import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Printer, Download, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import InvoiceDetail from '@/components/invoice/InvoiceDetail';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import GenerateInvoice from "./GenerateInvoice";
import InvoicePreview from '@/components/invoice/InvoicePreview';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Search } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { X } from "lucide-react";
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

// 导入封装的API
import { getDeliveredOrders, generateInvoice } from '@/apis/main';

const InvoiceManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const pageSize = 10;

  // 搜索条件变化时重置页码
  useEffect(() => {
    setPageIndex(0);
  }, [searchTerm, filterStatus]);

  // 使用封装的API获取已收货订单列表
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['deliveredOrders', pageIndex, pageSize, searchTerm, filterStatus],
    queryFn: () => getDeliveredOrders({
      pageIndex,
      pageSize,
      orderId: searchTerm,
      status: filterStatus
    }).then(response => {
      // 适配接口返回格式，从response中提取数据
      return {
        orders: response.data || [],
        total: response.total || 0,
        pageCount: response.pageCount || 0
      };
    }),
    keepPreviousData: true,
  });

  // 处理生成发票逻辑
  const handleGenerateInvoice = async (order) => {
    setIsGenerating(true);
    try {
      // 调用封装的生成发票API
      const response = await generateInvoice(order.id);
      const invoice = response; // 从response中提取data属性

      if (invoice) {
        setInvoiceData({
          ...invoice,
          order,
          customer: {
            id: order.customerId,
            name: order.customerName,
            address: invoice.customer.address,
            taxId: invoice.customer.taxId,
          },
          items: invoice.items || [],
        });

        const newInvoiceId = invoice.invoiceId;

        // 更新React Query缓存
        queryClient.setQueryData(
          ['deliveredOrders', pageIndex, pageSize, searchTerm, filterStatus],
          old => {
            if (!old) return old;
            return {
              ...old,
              orders: old.orders.map(o =>
                o.id === order.id ? {
                  ...o,
                  hasInvoice: true,
                  invoiceId: newInvoiceId
                } : o
              )
            };
          }
        );

        // 同步更新本地选中订单
        if (selectedOrder?.id === order.id) {
          setSelectedOrder(prev => ({
            ...prev,
            hasInvoice: true,
            invoiceId: newInvoiceId
          }));
        }
      }
    } catch (error) {
      console.error('生成发票失败:', error);
      alert('生成发票失败: ' + (error.message || '未知错误'));
    } finally {
      setIsGenerating(false);
    }
  };

  // 打印函数
  const handlePrintClick = useCallback(() => {
    window.print();
  }, []);

  // 导出PDF函数
  const handleExportPDFClick = useCallback(async (invoiceId) => {
    const invoiceElement = document.getElementById('invoice-preview');
    if (!invoiceElement) return;

    try {
      const dataUrl = await toPng(invoiceElement, {
        backgroundColor: '#ffffffff',
        quality: 1.0
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${invoiceId}.pdf`);
    } catch (error) {
      console.error('导出PDF失败:', error);
      alert('导出PDF失败，请重试');
    }
  }, []);

  if (isLoading) return <div className="text-center py-10">加载中...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">加载数据失败</div>;

  return (
    <div className="space-y-6 w-full">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #invoice-preview,
          #invoice-preview * {
            visibility: visible !important;
          }
          #invoice-preview {
            position: absolute !important;
            top: 0;
            left: 0;
            width: 100% !important;
            background: white !important;
            z-index: 9999;
            overflow: visible !important;
            max-height: none !important;
          }
        }
      `}</style>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-800">发票管理</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* 左侧：订单列表 */}
        <Card className="border border-blue-100 lg:col-span-3">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">待生成发票订单</CardTitle>
            {/* 搜索框 */}
            <div className="relative md:col-span-2 flex items-center">
    <span className="absolute left-3">
        <Search className="h-4 w-4 text-gray-400" />
    </span>
    <Input
        placeholder="搜索订单号、客户名称或商品名称..."
        className="pl-10 h-12" // 保持左侧内边距
        value={searchTerm}
        // 搜索框相关：每输入一个字就会触发 setSearchTerm，进而自动搜索
        onChange={(e) => setSearchTerm(e.target.value)}
    />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-6 h-11 rounded"
              >
                <option value="all">全部</option>
                <option value="invoiced">已开票</option>
                <option value="pending">待开票</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border border-blue-100 rounded-lg overflow-hidden">
              <Table className="w-full">
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead className="text-blue-800 min-w-28">订单编号</TableHead>
                    <TableHead className="text-blue-800 min-w-28">客户名称</TableHead>
                    <TableHead className="text-blue-800 min-w-28">订单金额</TableHead>
                    <TableHead className="text-blue-800">收货日期</TableHead>
                    <TableHead className="text-blue-800">状态</TableHead>
                    <TableHead className="text-right text-blue-800">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data?.orders || []).map((order) => (
                    <TableRow 
                      key={order.id} 
                      className="hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        if (order.hasInvoice) {
                          setSelectedOrder(order);
                          handleGenerateInvoice(order); // 查看已生成的发票
                        }
                      }}
                    >
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>¥{order.amount.toLocaleString()}</TableCell>
                      <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                      <TableCell>
                        {order.hasInvoice ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-1" /> 已开票
                          </Badge>
                        ) : (
                          <Badge variant="secondary">待开票</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.hasInvoice ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateInvoice(order);
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1" /> 查看发票
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerateInvoice(order);
                            }}
                            disabled={isGenerating}
                          >
                            <FileText className="h-4 w-4 mr-1" /> 
                            {isGenerating ? '生成中...' : '生成发票'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* 分页控件 */}
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
        
        {/* 右侧：发票详情 */}
        <div id="invoice-preview" className={!selectedOrder ? "hidden lg:block lg:col-span-2" : "lg:col-span-2"}>
          <Card className="border border-blue-100 h-full ">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-800">
                  {invoiceData ? `发票详情 - ${invoiceData.invoiceId}` : '发票预览'}
                </CardTitle>
                {selectedOrder && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setSelectedOrder(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-120px)] overflow-y-auto">
              {invoiceData ? (
                <InvoiceDetail invoice={invoiceData} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-500">未选择订单</h3>
                  <p className="text-gray-400 mt-1">请从左侧列表选择订单生成发票</p>
                </div>
              )}
            </CardContent>
            {invoiceData && (
              <CardFooter className="bg-blue-50 border-t border-blue-100 py-3 justify-center">
                <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        className="border-blue-300 text-blue-600" 
                        onClick={handlePrintClick}
                      >
                        <Printer className="mr-2 h-4 w-4" /> 打印
                      </Button>

                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleExportPDFClick(selectedOrder.invoiceId)}
                      >
                        <Download className="mr-2 h-4 w-4" /> 下载PDF
                      </Button>
                </div>
              </CardFooter>
            )}
            <AlertDialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
              <AlertDialogContent
                className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto wide-dialog"
                style={{ maxWidth: '95%', width: '95%', margin: '0 auto' }}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>生成发票</AlertDialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setIsPrintDialogOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogHeader>
                <GenerateInvoice deliveryOrderId={selectedOrder?.id} />
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;

