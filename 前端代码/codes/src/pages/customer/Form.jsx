import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, X, Upload, FileText, Eye } from 'lucide-react';
import { validatePhone } from '@/lib/utils';
import { generateId } from '@/lib/utils';
import { useState, useEffect } from 'react'; // 新增
import { REGION_OPTIONS, INDUSTRY_OPTIONS } from '@/constants/options';
import { ALL_CONTACTS } from '@/constants/contacts';
import SearchableSelect from '@/components/SearchableSelect';
import { CREDIT_RATING_OPTIONS } from '@/constants/options';
import { useToast } from '@/components/ui/use-toast';

// 获取当前登录用户信息
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || {};
  } catch {
    return {};
  }
};

// 导入创建客户接口
import { createCustomer,uploadCustomerAttachments,updateCustomer,previewAttachment, deleteAttachment } from '@/apis/main';
import { format } from 'date-fns'; // 新增：用于格式化日期

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
  // 获取当前登录用户信息
  const currentUser = getCurrentUser();
  const isSalesRep = currentUser.role === '销售代表' || currentUser.position === '销售代表';
  const isAdminOrManager = currentUser.role === '系统管理员' || currentUser.role === '销售经理' || currentUser.position === '系统管理员' || currentUser.position === '销售经理';
  
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);  

  const [contactOptions, setContactOptions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [existingAttachments, setExistingAttachments] = useState([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState([]);

  useEffect(() => {
    if (initialData?.attachments) {
      setExistingAttachments(initialData.attachments);
    }
  }, [initialData]);


  // 联系人字段是否禁用（销售代表时禁用）
  const contactFieldsDisabled = isSalesRep;

  const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        // 合并初始数据和默认值，确保attachments始终为数组
        ...(initialData || (
          isSalesRep
            ? {
                name: '',
                type: '',
                region: '',
                industry: '',
                company: '',
                phone: '',
                creditRating: '',
                address: '',
                contacts: [
                  {
                    name: currentUser.name || '',
                    position: currentUser.role || currentUser.position || '',
                    phone: currentUser.phone || '',
                    email: currentUser.email || ''
                  }
                ],
                remarks: '',
              }
            : {
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
              }
        )),
        // 强制初始化为空数组，覆盖可能的undefined或无效值
        attachments: []
      }
    });

  useEffect(() => {
      form.setValue('attachments', []);
    }, [form, initialData]);


  const handlePreview = async (filepath) => {
    try {
      const blob = await previewAttachment(filepath);
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, '_blank');
      window.addEventListener('unload', () => URL.revokeObjectURL(fileUrl));
    } catch (error) {
      console.error('预览附件失败：', error);
      alert('预览失败：' + (error.response?.data?.message || error.message));
    }
  };

  // 新增：标记附件为待删除
  const handleMarkDelete = (filepath) => {
    // 切换状态：已标记则取消，未标记则添加
    if (attachmentsToDelete.includes(filepath)) {
      setAttachmentsToDelete(attachmentsToDelete.filter(path => path !== filepath));
    } else {
      setAttachmentsToDelete([...attachmentsToDelete, filepath]);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contacts'
  });

  // 提交逻辑（核心变更：增加删除附件步骤）
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const submitData = { ...data };
      delete submitData.attachments;

      // 1. 提交客户基本信息，获取customerId
      let response;
      if (initialData) {
        submitData.modifiedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        submitData.modifiedBy = currentUser.name || currentUser.username || '未知用户';
        if (!submitData.remarks) delete submitData.remarks;
        response = await updateCustomer(submitData);
      } else {
        response = await createCustomer(submitData);
      }
      const customerId = response.customerId || initialData.id; // 编辑时用初始ID

      // 2. 上传新附件
      const newAttachments = form.getValues('attachments') || [];
      if (newAttachments.length > 0) {
        await uploadCustomerAttachments(customerId, newAttachments);
      }

      // 3. 删除标记为待删除的附件
      if (attachmentsToDelete.length > 0) {
        // 批量删除（逐个调用接口，可根据后端能力优化为批量接口）
        for (const filepath of attachmentsToDelete) {
          await deleteAttachment(filepath);
        }
      }

      // 4. 操作成功
      const successMsg = initialData 
        ? `客户修改成功，客户编号：${initialData.id}` 
        : `客户创建成功，客户编号：${customerId}`;
      alert(successMsg);
      if (typeof onSuccess === 'function') {
        onSuccess(response);
      } else {
        window.location.reload();
      }

    } catch (error) {
      console.error(`${initialData ? '修改' : '创建'}客户失败:`, error);
      alert(`${initialData ? '客户修改' : '客户创建'}失败：${error.message || '未知错误'}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleContactSearch = async (keyword) => {
    setSearchLoading(true);
    try {
      const filtered = ALL_CONTACTS.filter(c => c.name.includes(keyword));
      setContactOptions(filtered);
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
                        <SelectItem value="RETAIL 零售客户">零售客户</SelectItem>
                        <SelectItem value="WHOLE 批发客户">批发客户</SelectItem>
                        <SelectItem value="B2B 企业客户">企业客户</SelectItem>
                        <SelectItem value="GOV 政府机构">政府机构</SelectItem>
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
                          <SelectItem key={option.code} value={option.name}>
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
                          <SelectItem key={option.code} value={option.name}>
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
                              disabled={contactFieldsDisabled}
                              className={contactFieldsDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                              onChange={(e) => {
                                if (!contactFieldsDisabled) {
                                  field.onChange(e); // 更新表单值
                                  handleContactSearch(e.target.value); // 发起搜索
                                }
                              }}
                              autoComplete="off"
                            />
                            {!contactFieldsDisabled && searchLoading ? (
                              <div className="absolute z-10 bg-white border rounded shadow mt-1 w-full px-3 py-2 text-gray-400">
                                加载中...
                              </div>
                            ) : (
                              !contactFieldsDisabled && contactOptions.length > 0 && (
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
                          <Input 
                            placeholder="职位" 
                            {...field} 
                            disabled={contactFieldsDisabled}
                            className={contactFieldsDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                          />
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
                          <Input 
                            placeholder="手机号码" 
                            {...field} 
                            disabled={contactFieldsDisabled}
                            className={contactFieldsDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                          />
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
                          <Input 
                            placeholder="邮箱地址" 
                            {...field} 
                            disabled={contactFieldsDisabled}
                            className={contactFieldsDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                          />
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
                    {/*                     
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <X className="h-4 w-4 mr-1" /> 删除
                    </Button> */}
                  </div>
                </div>
              ))}
{/*               
              <Button 
                type="button" 
                variant="outline" 
                className="mt-2 border-blue-300 text-blue-600"
                onClick={() => append({ name: '', position: '', phone: '', email: '', isPrimary: false })}
                disabled={contactFieldsDisabled}
              >
                <Plus className="h-4 w-4 mr-2" /> 添加联系人
              </Button> */}
            </div>
            
            {/* 附件上传部分（核心变更） */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium mb-4">附件管理</h3>
              
              {/* 1. 上传新附件 */}
              <div className="flex items-center mb-6">
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
              
              {/* 2. 新上传的附件预览 */}
              <div className="mt-4 mb-8">
                <h4 className="text-sm font-medium text-gray-700 mb-2">待上传的新附件：</h4>
                {form.watch('attachments')?.length > 0 ? (
                  form.watch('attachments').map((file, index) => (
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
                  ))
                ) : (
                  <p className="text-sm text-gray-500">暂无新附件</p>
                )}
              </div>
              
              {/* 3. 已有附件（编辑模式显示） */}
              {initialData && existingAttachments.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    已有附件（{attachmentsToDelete.length > 0 ? `待删除: ${attachmentsToDelete.length}个` : ''}）：
                  </h4>
                  <div className="space-y-2">
                    {existingAttachments.map((attachment, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-3 border rounded-md ${
                          attachmentsToDelete.includes(attachment.filepath) 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="text-sm mr-4">{attachment.filename}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handlePreview(attachment.filepath)}
                            className="h-7 text-blue-600 p-0"
                            type="button"
                          >
                            <Eye className="h-4 w-4 mr-1" /> 查看
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleMarkDelete(attachment.filepath)}
                          className={attachmentsToDelete.includes(attachment.filepath) ? 'text-red-500' : ''}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
           {/* 提交按钮修改（添加加载状态） */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                className="border-blue-300 text-blue-600"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '提交客户信息'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;