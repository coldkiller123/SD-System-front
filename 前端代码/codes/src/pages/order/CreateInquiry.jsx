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

// 表单验证规则
const formSchema = z.object({
  customerId: z.string().min(1, '请选择客户'),
  productName: z.string().min(1, '请选择商品'),
  quantity: z.number().min(1, '数量至少为1'),
  unit: z.string().min(1, '请选择单位'),
  productId: z.string().min(1, '商品ID不能为空'),
  inquiryDate: z.date(),
  remarks: z.string().optional(),
});

// 模拟客户数据
const customers = [
  { id: 'C1001', name: '客户A' },
  { id: 'C1002', name: '客户B' },
  { id: 'C1003', name: '客户C' },
  { id: 'C1004', name: '客户D' },
  { id: 'C1005', name: '客户E' },
];

// 模拟商品数据
const products = [
  { id: 'P1001', name: '商品A', units: ['个', '箱'] },
  { id: 'P1002', name: '商品B', units: ['件', '套'] },
  { id: 'P1003', name: '商品C', units: ['千克', '吨'] },
  { id: 'P1004', name: '商品D', units: ['米', '卷'] },
  { id: 'P1005', name: '商品E', units: ['瓶', '箱'] },
];

const CreateInquiry = ({ onSuccess, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: '',
      productName: '',
      quantity: 1,
      unit: '',
      productId: '',
      inquiryDate: new Date(),
      remarks: '',
    }
  });

const onSubmit = async (data) => {
  // 生成唯一询价单号
  const inquiryId = 'IQ' + generateId().substring(0, 5);

  // 获取当前用户作为销售人员
  const salesPerson = '管理员';

  const inquiryData = {
    inquiryId,
    ...data,
    salesPerson,
    status: '未报价',
    createdAt: new Date().toISOString()
  };

  // 发送POST请求到mock接口
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiryData)
  });

  if (res.ok) {
    // 可选：处理返回数据
    // const result = await res.json();
    onSuccess();
  } else {
    // 可选：错误处理
    alert('提交失败');
  }
};


  // 处理商品选择
  const handleProductSelect = (productName) => {
    const product = products.find(p => p.name === productName);
    if (product) {
      form.setValue('productName', product.name);
      form.setValue('productId', product.id);
      form.setValue('unit', product.units[0]); // 默认选择第一个单位
    }
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? customers.find(
                                  (customer) => customer.id === field.value
                                )?.name
                              : "选择客户"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <div className="p-2">
                          <Input placeholder="搜索客户..." className="mb-2" />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {customers.map((customer) => (
                            <Button
                              key={customer.id}
                              variant="ghost"
                              className={cn(
                                "w-full justify-start font-normal",
                                field.value === customer.id && "bg-blue-50"
                              )}
                              onClick={() => {
                                form.setValue("customerId", customer.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === customer.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {customer.name} ({customer.id})
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value || "选择商品"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <div className="p-2">
                          <Input 
                            placeholder="搜索商品..." 
                            className="mb-2"
                            onChange={(e) => form.setValue('productName', e.target.value)}
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {products
                            .filter(product => 
                              product.name.includes(field.value) || 
                              product.id.includes(field.value)
                            )
                            .map((product) => (
                              <Button
                                key={product.id}
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start font-normal",
                                  field.value === product.name && "bg-blue-50"
                                )}
                                onClick={() => handleProductSelect(product.name)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === product.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {product.name} ({product.id})
                              </Button>
                            ))}
                        </div>
                      </PopoverContent>
                    </Popover>
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
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      单位 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择单位" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.find(p => p.name === form.watch('productName'))?.units.map(unit => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
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
