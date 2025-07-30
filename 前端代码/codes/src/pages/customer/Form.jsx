import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, X, Upload, FileText } from 'lucide-react';
import { validatePhone } from '@/lib/utils';
import { generateId } from '@/lib/utils';
import { useState } from 'react'; // 新增
import { REGION_OPTIONS, INDUSTRY_OPTIONS } from '@/constants/options';
import SearchableSelect from '@/components/SearchableSelect';
import { CREDIT_RATING_OPTIONS } from '@/constants/options';
import { useToast } from '@/components/ui/use-toast';

// 表单验证规则
const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, '客户名称至少2个字符').max(50, '客户名称最多50个字符'),
  type: z.string().min(1, '请选择客户类型'),
  region: z.string().min(1, '请选择所在地区'),
  industry: z.string().min(1, '请选择所属行业'),
  company: z.string().min(2, '公司名称至少2个字符').max(50, '公司名称最多50个字符'), //新增
  phone: z.string().refine(validatePhone, '请输入有效的手机号码'), //新增
  creditRating: z.string().min(1, '请选择信用等级'),
  address: z.string().min(5, '详细地址至少5个字符'),
  contacts: z.array(z.object({
    name: z.string().min(2, '联系人姓名至少2个字符'),
    position: z.string().min(2, '职位至少2个字符'),
    phone: z.string().refine(validatePhone, '请输入有效的手机号码'),
    email: z.string().email('请输入有效的邮箱地址').optional(),
    // isPrimary: z.boolean()
  })).min(1, '至少需要一个联系人'),
  remarks: z.string().max(200, '备注信息最多200个字符').optional(), //新增
  attachments: z.array(z.instanceof(File)).optional()
});

const CustomerForm = ({ initialData, onSuccess, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      type: '',
      region: '',
      industry: '',
      company: '',
      phone: '',
      creditRating: '',
      address: '',
      contacts: [
        { name: '', position: '', phone: '', email: '' }
      ],
      remarks: '',
      attachments: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contacts'
  });

  // const onSubmit = (data) => {
  //   // 如果是新增，生成客户ID
  //   if (!initialData) {
  //     data.id = 'C' + generateId().substring(0, 5);
  //   }
    
  //   console.log('客户信息提交成功:', data);
  //   onSuccess();
  // };
  const onSubmit = async (data) => {
    try {
      let response;
      let isCreate = !initialData;
      if (isCreate) {
        // 新建客户
        response = await fetch('/api/customer/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        // 修改客户
        response = await fetch(`/api/customer/update/${data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }

      const result = await response.json();
      // === 新增弹窗提示 ===
      if (result.customer && result.customer.id) {
        window.alert(
          `${isCreate ? '创建' : '修改'}客户 ${result.customer.id} 信息成功！`
        );
      } else {
        window.alert(`${isCreate ? '创建' : '修改'}客户信息成功！`);
      }
      onSuccess();
    } catch (error) {
      console.error('提交失败:', error);
    }
  };
  // 新增
  
  const [contactOptions, setContactOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { toast } = useToast();

  const handleContactSearch = async (keyword) => {
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/contacts/search?name=${encodeURIComponent(keyword)}`);
      const json = await res.json();
      setContactOptions(json.contacts || []);
    } catch (err) {
      console.error('联系人搜索失败:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleContactSelect = (index, contact) => {
    form.setValue(`contacts.${index}.name`, contact.name);
    form.setValue(`contacts.${index}.position`, contact.position);
    form.setValue(`contacts.${index}.phone`, contact.phone);
    form.setValue(`contacts.${index}.email`, contact.email);
    setContactOptions([]);
  };
  // 联系人下拉框，新增

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    form.setValue('attachments', [...form.getValues('attachments'), ...files]);
  };

  const removeFile = (index) => {
    const files = [...form.getValues('attachments')];
    files.splice(index, 1);
    form.setValue('attachments', files);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle>{initialData ? '编辑客户信息' : '新增客户信息'}</CardTitle>
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
                        客户编号
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
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      客户名称 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="请输入客户名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      客户类型 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择客户类型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="普通客户">普通客户</SelectItem>
                        <SelectItem value="VIP客户">VIP客户</SelectItem>
                        <SelectItem value="战略客户">战略客户</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      所在地区 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择所在地区" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      {/* <SelectItem value="华东">华东</SelectItem>
                        <SelectItem value="华北">华北</SelectItem>
                        <SelectItem value="华南">华南</SelectItem>
                        <SelectItem value="华中">华中</SelectItem>
                        <SelectItem value="西南">西南</SelectItem> */}
                        {REGION_OPTIONS.map((option) => (
                          <SelectItem key={option.code} value={option.code}>
                            {option.code} {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      所属行业 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择所属行业" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                       {/* <SelectItem value="制造业">制造业</SelectItem>
                        <SelectItem value="零售业">零售业</SelectItem>
                        <SelectItem value="金融业">金融业</SelectItem>
                        <SelectItem value="互联网">互联网</SelectItem>
                        <SelectItem value="教育">教育</SelectItem> */}
                        {INDUSTRY_OPTIONS.map((option) => (
                          <SelectItem key={option.code} value={option.code}>
                            {option.code} {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      客户所属公司 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="请输入公司名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />              
              {/* 新增 */}

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      联系电话 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="请输入联系电话" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 新增 */}

              <FormField
                control={form.control}
                name="creditRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>信用等级*</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="请选择信用等级" />
                        </SelectTrigger>
                        <SelectContent>
                          {CREDIT_RATING_OPTIONS.map(option => (
                            <SelectItem key={option.code} value={option.code}>
                              {option.code} {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center">
                      详细地址 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="请输入详细地址" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center">
                      备注
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="请输入备注信息" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 新增 */}
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">联系人信息</h3>
              
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg bg-blue-50">
                  {/* <FormField
                    control={form.control}
                    name={`contacts.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          姓名 <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="联系人姓名" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
                    control={form.control}
                    name={`contacts.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel className="flex items-center">
                          姓名 <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <div>
                            <Input
                              placeholder="请输入联系人姓名"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e); // 更新表单值
                                handleContactSearch(e.target.value); // 发起搜索
                              }}
                              autoComplete="off"
                            />
                            {searchLoading ? (
                              <div className="absolute z-10 bg-white border rounded shadow mt-1 w-full px-3 py-2 text-gray-400">
                                加载中...
                              </div>
                            ) : (
                              contactOptions.length > 0 && (
                                <div className="absolute z-10 bg-white border rounded shadow mt-1 w-full max-h-48 overflow-y-auto">
                                  {contactOptions.map((contact) => (
                                    <div
                                      key={contact.id}
                                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                                      onClick={() => handleContactSelect(index, contact)}
                                    >
                                      {contact.name}（{contact.position}）
                                    </div>
                                  ))}
                                </div>
                              )
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* 新增 */}
                  
                  <FormField
                    control={form.control}
                    name={`contacts.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          职位 <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="职位" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`contacts.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          手机号 <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="手机号码" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`contacts.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">邮箱</FormLabel>
                        <FormControl>
                          <Input placeholder="邮箱地址" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-4 flex items-center justify-between">
                    {/* <FormField
                      control={form.control}
                      name={`contacts.${index}.isPrimary`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="h-4 w-4 text-blue-600 rounded"
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">主要联系人</FormLabel>
                        </FormItem>
                      )}
                    /> */}
                    
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <X className="h-4 w-4 mr-1" /> 删除
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button 
                type="button" 
                variant="outline" 
                className="mt-2 border-blue-300 text-blue-600"
                onClick={() => append({ name: '', position: '', phone: '', email: '', isPrimary: false })}
              >
                <Plus className="h-4 w-4 mr-2" /> 添加联系人
              </Button>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">附件上传</h3>
              
              <div className="flex items-center">
                <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  选择文件
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    onChange={handleFileUpload}
                  />
                </label>
                <span className="ml-4 text-sm text-gray-500">支持合同、营业执照等文件</span>
              </div>
              
              <div className="mt-4">
                {form.watch('attachments')?.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md mb-2">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
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
                提交客户信息
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;