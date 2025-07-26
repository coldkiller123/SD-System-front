import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Printer, Download, ArrowLeft, FileText } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import InvoicePreview from '@/components/invoice/InvoicePreview';

// 模拟API获取发货单详情
const fetchDeliveryOrder = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500)); //模拟 API 请求的耗时
  
  return {
    id: `DO${id}`,
    orderIds: [`SO${4000 + parseInt(id)}`, `SO${4001 + parseInt(id)}`],
    customer: {
      id: `C${1500 + (parseInt(id) % 10)}`,
      name: `客户${1500 + (parseInt(id) % 10)}`,
      contact: `联系人${parseInt(id) % 10 + 1}`,
      phone: `138${Math.floor(10000000 + Math.random() * 90000000)}`,
      address: `地址${parseInt(id) % 10 + 1}`,
      company: `公司${parseInt(id) % 10 + 1}`
    },
    products: [
      {
        id: `P${5000 + parseInt(id)}`,
        name: `商品${parseInt(id) + 1}`,
        quantity: Math.floor(10 + Math.random() * 50),
        unitPrice: Math.floor(100 + Math.random() * 900),
      },
      {
        id: `P${5001 + parseInt(id)}`,
        name: `商品${parseInt(id) + 2}`,
        quantity: Math.floor(5 + Math.random() * 30),
        unitPrice: Math.floor(200 + Math.random() * 800),
      }
    ],
    deliveryDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    invoiceDate: new Date().toISOString(),
    warehouseManager: `仓库管理员${parseInt(id) % 3 + 1}`,
    remarks: '标准发货',
    invoiceId: `INV${Math.floor(10000 + Math.random() * 90000)}`,
    totalAmount: 0,
    paidAmount: 0,
    dueAmount: 0
  };
};

const GenerateInvoice = ({ deliveryOrderId, customer }) => {
  //const location = useLocation();
  //const navigate = useNavigate();
  //const deliveryOrderId = location.pathname.split('/').pop();

  const { data: deliveryOrder, isLoading, isError } = useQuery({
    queryKey: ['deliveryOrder', deliveryOrderId],
    queryFn: () => fetchDeliveryOrder(deliveryOrderId)
  });

  useEffect(() => {
    if (deliveryOrder) {
      // 计算金额
      deliveryOrder.totalAmount = deliveryOrder.products.reduce(
        (sum, product) => sum + (product.quantity * product.unitPrice), 0
      );
      deliveryOrder.paidAmount = deliveryOrder.totalAmount * 0.7;
      deliveryOrder.dueAmount = deliveryOrder.totalAmount - deliveryOrder.paidAmount;
    }
  }, [deliveryOrder]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
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
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${deliveryOrder.invoiceId}.pdf`);
    } catch (error) {
      console.error('导出PDF失败:', error);
      alert('导出PDF失败，请重试');
    }
  };

  if (isLoading) return <div className="text-center py-10">加载中...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">加载数据失败</div>;

  return (
    <div className="space-y-6">
      
      
      <Card className="border border-blue-100 wide-card">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-800" />
            <span className="text-blue-800">发票生成</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div id="invoice-preview" className="p-8 bg-white">
            <InvoicePreview deliveryOrder={deliveryOrder} customer={customer}/>
          </div>
        </CardContent>
        <CardFooter className="bg-blue-50 border-t border-blue-100 py-3 justify-center">
          <div className="flex space-x-3">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleExportPDF}
            >
              <Download className="mr-2 h-4 w-4" /> 导出PDF
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-300 text-blue-600"
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" /> 打印
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-preview,
          #invoice-preview * {
            visibility: visible;
          }
          #invoice-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default GenerateInvoice;
