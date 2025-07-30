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

// 表单验证规则
const formSchema = z.object({
  customerId: z.string().min(1, '请选择客户'),
  productName: z.string().min(1, '请选择商品'),
  quantity: z.number().min(1, '数量至少为1'),
  productId: z.string().min(1, '商品ID不能为空'),
  inquiryDate: z.date(),
  remarks: z.string().optional(),
});

// 模拟商品数据
const products = [
  { id: 'P1001', name: '智能手机' },
  { id: 'P1002', name: '笔记本电脑' },
  { id: 'P1003', name: '平板电脑'},
  { id: 'P1004', name: '智能手表'},
  { id: 'P1005', name: '无线耳机' },
  { id: 'P1006', name: '蓝牙音箱'},
  { id: 'P1007', name: '数码相机'},
  { id: 'P1008', name: '游戏主机'},
];

const CreateInquiry = ({ onSuccess, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: '',
      productName: '',
      quantity: 1,
      productId: '',
      inquiryDate: new Date(),
      remarks: '',
    }
  });

  const onSubmit = (data) => {
    // 生成唯一询价单号
    const inquiryId = 'IQ' + generateId().substring(0, 5);
    
    // 获取当前用户作为销售人员
    const salesPerson = '管理员'; // 实际应用中应从登录信息获取
    
    const inquiryData = {
      inquiryId, // 统一使用 inquiryId
      ...data,
      salesPerson,
      status: '未报价',
      createdAt: new Date().toISOString()
    };
    
    console.log('询价单提交成功:', inquiryData);
    onSuccess();
  };

  // 处理商品选择
  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      form.setValue('productName', product.name);
      form.setValue('productId', product.id);
    }
  };

  // 处理从商品详情弹窗选择商品
  const handleSelectProductFromDialog = (product) => {
    form.setValue('productName', product.name);
    form.setValue('productId', product.id);
  };

  return (
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
                      value={form.watch('productId')} 
                      onValueChange={(value) => {
                        field.onChange(products.find(p => p.id === value)?.name || '');
                        handleProductSelect(value);
                      }} 
                      placeholder="搜索并选择商品..."
                      onSelectProduct={handleSelectProductFromDialog}
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
  );
};

export default CreateInquiry;