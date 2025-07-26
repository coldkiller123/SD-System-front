import { useState, useEffect } from 'react';
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
import { X } from "lucide-react";
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { useCallback } from 'react';


// Mock API to fetch orders with "已收货" status

const fetchDeliveredOrders= async () => {
  try {
    const res = await fetch('/api/orders/delivered');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || []; // 确保总是返回数组
  } catch (error) {
    console.error('发票数据获取失败:', error);
    return []; // 返回空数组避免UI崩溃
  }
};
// Mock API to generate invoice
// utils/api.js 或 InvoiceManagement.jsx 中
const generateInvoice = async (orderId) => {
  try {
    const res = await fetch(`/api/invoice/generate/${orderId}`, {
      method: 'POST',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('生成发票失败:', error);
    return null;
  }
};


const InvoiceManagement = () => {
  const navigate = useNavigate();
   const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ['deliveredOrders'],
    queryFn: fetchDeliveredOrders
  });

  const handleGenerateInvoice = async (order) => {
  setIsGenerating(true);  // 开始生成时设置生成中状态
  try {
    // 调用 generateInvoice 函数获取模拟发票数据
    const invoice = await generateInvoice(order.id);

    // 如果发票数据成功返回，更新状态
    if (invoice) {
      setInvoiceData({
        ...invoice,  // 将从接口获取到的发票数据直接传递
        order,  // 保留原订单数据
        customer: {
          id: order.customerId,
          name: order.customerName,
          address: invoice.customer.address,
          taxId: invoice.customer.taxId,
        },
        // 不再手动构建商品项，这些项从 API 返回的 invoice.items 中直接获取
        items: invoice.items || [], // 使用返回的商品列表
      });

      // 更新订单的发票状态和 ID
      const updatedOrders = orders.map(o =>
        o.id === order.id ? { ...o, hasInvoice: true, invoiceId: invoice.invoiceId } : o
      );

      // 使用 refetch 来更新订单列表数据
      refetch({ orders: updatedOrders });

      // 设置选中的订单为当前订单
      setSelectedOrder(order);
    }
  } catch (error) {
    console.error('生成发票失败:', error);
  } finally {
    setIsGenerating(false);  // 完成生成时，取消生成中状态
  }
};


  // 打印函数
const handlePrintClick = useCallback(() => {
  window.print();
}, []);

// 导出 PDF 函数
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
        {/* Left Column: Order List */}
        <Card className="border border-blue-100 lg:col-span-3">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">待生成发票订单</CardTitle>
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
                  {orders.map((order) => (
                    <TableRow 
                      key={order.id} 
                      className="hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        if (order.hasInvoice) {
                          setSelectedOrder(order);
                          // For existing invoices, we'd fetch the invoice data
                          // For simplicity, we'll simulate it
                          handleGenerateInvoice(order);
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
          </CardContent>
        </Card>
        
        {/* Right Column: Invoice Detail */}
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
