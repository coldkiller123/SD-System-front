import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { X, Calendar, Calculator } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 表单验证规则
const formSchema = z.object({
  id: z.string().optional(),
  customerId: z.string().min(1, '请选择客户'),
  productName: z.string().min(1, '请选择商品'),
  productId: z.string().min(1, '商品ID不能为空'),
  quantity: z.number().min(1, '数量至少为1'),
  unitPrice: z.number().min(0.01, '单价必须大于0'),
  totalAmount: z.number().min(0, '总金额不能为负'),
  paidAmount: z.number().min(0, '实付金额不能为负'),
  status: z.string().min(1, '请选择状态'),
  salesPerson: z.string().min(1, '销售人员不能为空'),
  remarks: z.string().optional(),
  createdAt: z.string().optional(), // 新增创建时间字段
});

const SalesOrderForm = ({ initialData, onSuccess, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      customerId: '',
      productName: '',
      productId: '',
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
      paidAmount: 0,
      status: '待付款',
      salesPerson: '销售员1',
      remarks: '',
      createdAt: format(new Date(), 'yyyy-MM-dd', { locale: zhCN }) // 默认当前日期
    }
  });

  const onSubmit = (data) => {
    // 如果是新增，生成订单ID
    if (!initialData) {
      data.id = 'SO' + generateId().substring(0, 5);
      data.createdAt = format(new Date(), 'yyyy-MM-dd', { locale: zhCN });
    } else {
      // 编辑时记录修改日志
      data.modifiedAt = new Date().toISOString();
      data.modifiedBy = '当前用户';
    }
    
    console.log('订单信息提交成功:', data);
    onSuccess();
  };

  // 计算总金额
  const calculateTotal = () => {
    const quantity = form.getValues('quantity') || 0;
    const unitPrice = form.getValues('unitPrice') || 0;
    const total = quantity * unitPrice;
    form.setValue('totalAmount', total);
    
    // 如果状态是已付款或已完成，实付金额默认为总金额
    const status = form.getValues('status');
    if (status === '已付款' || status === '已完成') {
      form.setValue('paidAmount', total);
    }
  };

  // 商品选择变化时更新商品ID
  const handleProductChange = (value) => {
    const products = {
      '商品1': { id: 'P1001', price: 299 },
      '商品2': { id: 'P1002', price: 499 },
      '商品3': { id: 'P1003', price: 799 },
      '商品4': { id: 'P1004', price: 1299 },
      '商品5': { id: 'P1005', price: 1999 },
    };
    
    if (products[value]) {
      form.setValue('productId', products[value].id);
      form.setValue('unitPrice', products[value].price);
      calculateTotal();
    }
  };

  // 客户选择变化时更新客户ID
  const handleCustomerChange = (value) => {
    const customers = {
      '客户1': 'C1001',
      '客户2': 'C1002',
      '客户3': 'C1003',
      '客户4': 'C1004',
      '客户5': 'C1005',
    };
    
    if (customers[value]) {
      form.setValue('customerId', customers[value]);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle>{initialData ? '编辑销售订单' : '新建销售订单'}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onCancel}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialData && (
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        订单编号
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="系统自动生成" 
                          {...field} 
                          disabled 
                          className="bg-gray-100"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              
              {/* 新增创建时间字段 */}
              <FormField
                control={form.control}
                name="createdAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      创建时间
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        readOnly
                        className="bg-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      客户 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select onValueChange={(value) => {
                      handleCustomerChange(value);
                      field.onChange(value);
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择客户" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="客户1">客户1</SelectItem>
                        <SelectItem value="客户2">客户2</SelectItem>
                        <SelectItem value="客户3">客户3</SelectItem>
                        <SelectItem value="客户4">客户4</SelectItem>
                        <SelectItem value="客户5">客户5</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      商品名称 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select onValueChange={(value) => {
                      handleProductChange(value);
                      field.onChange(value);
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择商品" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="商品1">商品1</SelectItem>
                        <SelectItem value="商品2">商品2</SelectItem>
                        <SelectItem value="商品3">商品3</SelectItem>
                        <SelectItem value="商品4">商品4</SelectItem>
                        <SelectItem value="商品5">商品5</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      商品ID <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="商品ID" 
                        {...field} 
                        disabled 
                        className="bg-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      数量 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="订购数量" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          calculateTotal();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      单价 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="商品单价" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          calculateTotal();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      总金额
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="自动计算" 
                        {...field} 
                        disabled 
                        className="bg-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paidAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      实付金额 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="实付金额" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      状态 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择状态" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="待付款">待付款</SelectItem>
                        <SelectItem value="已付款">已付款</SelectItem>
                        <SelectItem value="已发货">已发货</SelectItem>
                        <SelectItem value="已完成">已完成</SelectItem>
                        <SelectItem value="已取消">已取消</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="salesPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      销售人员 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择销售人员" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="销售员1">销售员1</SelectItem>
                        <SelectItem value="销售员2">销售员2</SelectItem>
                        <SelectItem value="销售员3">销售员3</SelectItem>
                        <SelectItem value="销售员4">销售员4</SelectItem>
                        <SelectItem value="销售员5">销售员5</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>备注</FormLabel>
                    <FormControl>
                      <Textarea placeholder="订单备注信息" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                className="border-blue-300 text-blue-600"
                onClick={onCancel}
              >
                取消
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {initialData ? '更新订单' : '创建订单'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SalesOrderForm;