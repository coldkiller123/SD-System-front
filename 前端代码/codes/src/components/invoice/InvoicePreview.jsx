import { formatDate } from '@/lib/utils';

const InvoicePreview = ({ deliveryOrder }) => {
  if (!deliveryOrder) return null;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white border border-gray-200 shadow-none">
      {/* 发票头部信息 */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">销售发票</h1>
          <p className="text-gray-500 mt-1">发票编号: {deliveryOrder.invoiceId}</p>
        </div>
        <div className="text-right">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <p className="mt-2 text-sm text-gray-500">企业LOGO</p>
        </div>
      </div>
      
      {/* 发票基本信息 */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">销售方信息</h2>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="font-medium">SD销售分发系统</p>
            <p>地址: 北京市朝阳区科技园区88号</p>
            <p>电话: 010-88888888</p>
            <p>税号: 123456789012345</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">购买方信息</h2>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="font-medium">{deliveryOrder.customer.name} ({deliveryOrder.customer.company})</p>
            <p>客户ID: {deliveryOrder.customer.id}</p>
            <p>联系人: {deliveryOrder.customer.contact}</p>
            <p>电话: {deliveryOrder.customer.phone}</p>
            <p>地址: {deliveryOrder.customer.address}</p>
          </div>
        </div>
      </div>
      
      {/* 时间信息 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">发货日期</p>
          <p className="font-medium">{formatDate(deliveryOrder.deliveryDate)}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">开票日期</p>
          <p className="font-medium">{formatDate(deliveryOrder.invoiceDate)}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">操作人员</p>
          <p className="font-medium">{deliveryOrder.warehouseManager}</p>
        </div>
      </div>
      
      {/* 商品表格 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">商品明细</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50">
              <th className="border border-blue-100 p-3 text-left">商品名称</th>
              <th className="border border-blue-100 p-3 text-left">商品ID</th>
              <th className="border border-blue-100 p-3 text-center">数量</th>
              <th className="border border-blue-100 p-3 text-right">单价</th>
              <th className="border border-blue-100 p-3 text-right">金额</th>
            </tr>
          </thead>
          <tbody>
            {deliveryOrder.products.map((product, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                <td className="border border-blue-100 p-3">{product.name}</td>
                <td className="border border-blue-100 p-3">{product.id}</td>
                <td className="border border-blue-100 p-3 text-center">{product.quantity}</td>
                <td className="border border-blue-100 p-3 text-right">¥{product.unitPrice.toLocaleString()}</td>
                <td className="border border-blue-100 p-3 text-right font-medium">
                  ¥{(product.quantity * product.unitPrice).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 金额汇总 */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">备注</h2>
          <div className="bg-blue-50 p-4 rounded-md min-h-[100px]">
            {deliveryOrder.remarks || '无备注信息'}
          </div>
        </div>
        
        <div>
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex justify-between py-2 border-b border-blue-100">
              <span>合计金额:</span>
              <span className="font-medium">¥{deliveryOrder.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-100">
              <span>已付金额:</span>
              <span className="text-green-600 font-medium">¥{deliveryOrder.paidAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-semibold">应付金额:</span>
              <span className="text-red-600 font-bold text-lg">¥{deliveryOrder.dueAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 页脚信息 */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>感谢您的惠顾！</p>
        <p className="mt-2">系统自动生成发票 · 开票时间: {new Date(deliveryOrder.invoiceDate).toLocaleString('zh-CN')}</p>
      </div>
    </div>
  );
};

export default InvoicePreview;
