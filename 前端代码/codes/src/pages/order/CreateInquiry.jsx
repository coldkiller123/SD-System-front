import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { X, CalendarIcon, Search, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CustomerSearch } from '@/components/CustomerSearch';
import { ProductSelector } from '@/components/ProductSelector';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // 弹窗组件


// 导入接口封装
import { createInquiry } from '@/apis/main';

// 表单验证规则
const formSchema = z.object({
  customerId: z.string().min(1, '请选择客户'),
  productName: z.string().min(1, '请选择商品'),
  quantity: z.number().min(1, '数量至少为1'),
  productId: z.string().min(1, '商品ID不能为空'),
  inquiryDate: z.date(),
  remarks: z.string().optional(),
});

const CreateInquiry = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false); 
  const [currentInquiryId, setCurrentInquiryId] = useState(''); 

  const handleDialogConfirm = () => {
    setSuccessDialogOpen(false); // 关闭弹窗
    onSuccess({ inquiryId: currentInquiryId }); // 调用父组件的返回逻辑
  };


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: '',
      customerName: '',
      productName: '',
      productId: '',
      quantity: 1,
      unit: '个',
      inquiryDate: new Date(),
      salesPerson: '管理员', // 实际应从登录信息获取
      remarks: '',
    }
  });

  // 处理客户选择（同步ID和名称）
  const handleCustomerSelect = (customer) => {
    if (customer) {
      form.setValue('customerId', customer.id);
      form.setValue('customerName', customer.name);
    } else {
      form.setValue('customerId', '');
      form.setValue('customerName', '');
    }
  };

  const onSubmit = async (data) => {
  setIsSubmitting(true);
  setErrorMsg('');
  try {
    const requestData = {
            customerId: data.customerId,
            productName: data.productName,
            productId: data.productId,
            quantity: data.quantity,
            unit: '个', // 固定单位
            salesPerson: '销售员1', // 与APIPOST一致
            inquiryDate: format(data.inquiryDate, 'yyyy-MM-dd'),
            remarks: data.remarks || '', // 可选字段
          };

    const response = await createInquiry(requestData);
    
    if (response.inquiryId) {
      setCurrentInquiryId(response.inquiryId); // 保存询价单号
      setSuccessDialogOpen(true); // 打开成功弹窗
    }
  } catch (err) {
      setErrorMsg(err.message || '创建询价单失败，请重试');
  } finally {
      setIsSubmitting(false);
  }
};


  return (
    <>
    <Card className="border-0 shadow-none">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle>创建询价单</CardTitle>
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
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center">
                      客户 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <CustomerSearch 
                      value={field.value} 
                      onValueChange={field.onChange} 
                      placeholder="搜索并选择客户..."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center">
                      商品名称 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                     <ProductSelector 
                      // 传入当前选中的商品ID作为value
                      value={form.watch('productId')} 
                      // 关键修正：接收完整商品对象作为参数
                      onValueChange={(selectedProduct) => {
                        if (selectedProduct) {
                          // 同步更新商品名称和商品ID两个字段
                          field.onChange(selectedProduct.name);
                          form.setValue('productId', selectedProduct.id);
                        } else {
                          // 清空选择时同步清空两个字段
                          field.onChange('');
                          form.setValue('productId', '');
                        }
                      }} 
                      placeholder="搜索并选择商品..."
                    />
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
                      订购数量 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="订购数量" 
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
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      商品ID
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="自动关联" 
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
                name="inquiryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center">
                      询价时间 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "yyyy-MM-dd", { locale: zhCN })
                            ) : (
                              <span>选择日期</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          locale={zhCN}
                        />
                      </PopoverContent>
                    </Popover>
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
                      <Textarea placeholder="询价备注信息" {...field} />
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
                提交询价单
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
    {/* 👇 新增：成功弹窗组件 */}
    <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-green-600">
            <Check className="h-5 w-5 mr-2" />
            询价单创建成功
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>您的询价单号为：</p>
          <p className="font-bold text-lg mt-2 text-center">{currentInquiryId}</p>
          <p className="text-sm text-gray-500 mt-4 text-center">
            请妥善保存单号以便后续查询
          </p>
        </div>
        <DialogFooter>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 w-full"
            onClick={handleDialogConfirm}
          >
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
};

export default CreateInquiry;