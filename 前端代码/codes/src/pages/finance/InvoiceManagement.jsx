import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, Printer, Download, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import InvoiceDetail from '@/components/invoice/InvoiceDetail';

// Mock API to fetch orders with "已收货" status
const fetchDeliveredOrders = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: `SO${3000 + i}`,
    customerId: `C${1500 + (i % 10)}`,
    customerName: `客户${1500 + (i % 10)}`,
    amount: Math.floor(1000 + Math.random() * 9000),
    orderDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    deliveryDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    status: '已收货',
    hasInvoice: i > 5, // Some orders already have invoices
    invoiceId: i > 5 ? `INV${Math.floor(10000 + Math.random() * 90000)}` : null
  }));
};

// Mock API to generate invoice
const generateInvoice = async (orderId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    invoiceId: `INV${Math.floor(10000 + Math.random() * 90000)}`,
    orderId,
    issueDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    taxRate: 0.13,
    status: '待付款'
  };
};

const InvoiceManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ['deliveredOrders'],
    queryFn: fetchDeliveredOrders
  });

  const handleGenerateInvoice = async (order) => {
    setIsGenerating(true);
    try {
      const invoice = await generateInvoice(order.id);
      setInvoiceData({
        ...invoice,
        order,
        customer: {
          id: order.customerId,
          name: order.customerName,
          address: `地址${order.id.substring(3)}`,
          taxId: `TAX${Math.floor(10000 + Math.random() * 90000)}`
        },
        items: [
          {
            id: `P${4000 + parseInt(order.id.substring(3))}`,
            name: `商品${parseInt(order.id.substring(3)) + 1}`,
            quantity: Math.floor(1 + Math.random() * 10),
            unitPrice: Math.floor(100 + Math.random() * 500),
            description: '标准商品'
          },
          {
            id: `P${4001 + parseInt(order.id.substring(3))}`,
            name: `商品${parseInt(order.id.substring(3)) + 2}`,
            quantity: Math.floor(1 + Math.random() * 5),
            unitPrice: Math.floor(200 + Math.random() * 800),
            description: '高级商品'
          }
        ]
      });
      
      // Update order status in local data
      const updatedOrders = orders.map(o => 
        o.id === order.id ? { ...o, hasInvoice: true, invoiceId: invoice.invoiceId } : o
      );
      refetch({ orders: updatedOrders });
      
      setSelectedOrder(order);
    } catch (error) {
      console.error('生成发票失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) return <div className="text-center py-10">加载中...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">加载数据失败</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-800">发票管理</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Order List */}
        <Card className="border border-blue-100">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">待生成发票订单</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-blue-100 rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead className="text-blue-800">订单编号</TableHead>
                    <TableHead className="text-blue-800">客户名称</TableHead>
                    <TableHead className="text-blue-800">订单金额</TableHead>
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
        <div className={!selectedOrder ? "hidden lg:block" : ""}>
          <Card className="border border-blue-100 h-full">
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
                  <Button variant="outline" className="border-blue-300 text-blue-600">
                    <Printer className="mr-2 h-4 w-4" /> 打印
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Download className="mr-2 h-4 w-4" /> 下载PDF
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;
