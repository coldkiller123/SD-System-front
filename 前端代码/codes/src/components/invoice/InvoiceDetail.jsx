import { formatDate } from '@/lib/utils';

const InvoiceDetail = ({ invoice }) => {
  // Calculate amounts
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * invoice.taxRate;
  const total = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white">
      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">销售发票</h1>
          <div className="mt-2 space-y-1 text-sm">
            <p>发票编号: <span className="font-medium">{invoice.invoiceId}</span></p>
            <p>开票日期: <span className="font-medium">{formatDate(invoice.issueDate)}</span></p>
            <p>到期日期: <span className="font-medium">{formatDate(invoice.dueDate)}</span></p>
          </div>
        </div>
        <div className="flex flex-col items-center">
  <img
    src="/logo.png" // public 下的路径
    alt="企业LOGO"
    className="border-2 border-dashed rounded-xl w-16 h-16 object-cover"
  />
  <p className="mt-2 text-sm text-gray-500">企业LOGO</p>
</div>

      </div>
      
      {/* Order and Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">订单信息</h2>
          <div className="space-y-1">
            <p><span className="text-gray-500">订单编号:</span> {invoice.order.id}</p>
            <p><span className="text-gray-500">订单日期:</span> {formatDate(invoice.order.orderDate)}</p>
            <p><span className="text-gray-500">收货日期:</span> {formatDate(invoice.order.deliveryDate)}</p>
            <p><span className="text-gray-500">订单金额:</span> ¥{invoice.order.amount.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">客户信息</h2>
          <div className="space-y-1">
            <p><span className="text-gray-500">客户名称:</span> {invoice.customer.name}</p>
            <p><span className="text-gray-500">客户编号:</span> {invoice.customer.id}</p>
            <p><span className="text-gray-500">税号:</span> {invoice.customer.taxId}</p>
            <p><span className="text-gray-500">地址:</span> {invoice.customer.address}</p>
          </div>
        </div>
      </div>
      
      {/* Items Table */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">商品明细</h2>
        <div className="border border-blue-100 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3 text-left">商品名称</th>
                <th className="p-3 text-left">描述</th>
                <th className="p-3 text-center">数量</th>
                <th className="p-3 text-right">单价</th>
                <th className="p-3 text-right">金额</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.description}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right">¥{item.unitPrice.toLocaleString()}</td>
                  <td className="p-3 text-right font-medium">
                    ¥{(item.quantity * item.unitPrice).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">备注</h2>
          <p>感谢您的惠顾！如有任何问题，请联系我们的客服。</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex justify-between py-2 border-b border-blue-100">
            <span>小计:</span>
            <span className="font-medium">¥{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-blue-100">
            <span>税率 ({invoice.taxRate * 100}%):</span>
            <span className="font-medium">¥{tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-semibold">总计:</span>
            <span className="text-blue-800 font-bold text-lg">¥{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>系统自动生成发票 · 开票时间: {new Date(invoice.issueDate).toLocaleString('zh-CN')}</p>
      </div>
    </div>
  );
};

export default InvoiceDetail;
