import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Printer, Share2, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getRegionLabel, getIndustryLabel } from '@/constants/options';
import { getCreditRatingLabel } from '@/constants/options';

// 模拟API获取客户详情
// const fetchCustomerDetail = async (id) => {
//   // 模拟API延迟
//   await new Promise(resolve => setTimeout(resolve, 500));
  
//   // 模拟数据
//   return {
//     id,
//     name: `客户${id.substring(1)}`,
//     type: ['普通客户', 'VIP客户', '战略客户'][id.charCodeAt(1) % 3],
//     region: ['华东', '华北', '华南', '华中', '西南'][id.charCodeAt(1) % 5],
//     industry: ['制造业', '零售业', '金融业', '互联网', '教育'][id.charCodeAt(1) % 5],
//     company: `公司${id.substring(1)}`, // 新增
//     phone: `021-${Math.floor(10000000 + Math.random() * 90000000)}`, // 新增
//     creditRating: ['AAA', 'AA', 'A', 'BBB', 'BB'][id.charCodeAt(1) % 5],
//     address: `地址${id.substring(1)}`,
//     createdAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
//     modifiedAt: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(), //新增
//     modifiedBy: `用户${id.substring(1)}`, //新增 与登录用户名一致
//     contacts: Array.from({ length: 3 }, (_, i) => ({
//       id: `CT${1000 + i}`,
//       name: `联系人${i + 1}`,
//       position: ['销售经理', '采购主管', '财务总监'][i],
//       phone: `138${Math.floor(10000000 + Math.random() * 90000000)}`,
//       email: `contact${i + 1}@company.com`,
//       // isPrimary: i === 0
//     })),
//     remarks: `这是客户${id.substring(1)}的备注信息。`, //新增
//     businessHistory: Array.from({ length: 12 }, (_, i) => ({
//       id: `TR${1000 + i}`,
//       date: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
//       amount: Math.floor(10000 + Math.random() * 90000),
//       product: `产品${i + 1}`,
//       status: ['已完成', '进行中', '已取消'][i % 3]
//     }))
//   };
// };

// HXY前端模拟数据测试
const fetchCustomerDetail = async (id) => {
  console.log('请求客户详情，ID =', id); // 调试信息
  const res = await fetch(`/api/customer/detail/${id}`);
  if (!res.ok) throw new Error('请求失败'); // 处理请求错误
  const json = await res.json();
  return json.info;
};
// 测试！fetchCustomerDetail只负责请求和获取数据，由后端返回数据。

const CustomerDetail = () => {
  const { id } = useParams();
  const { data: customer, isLoading, isError } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => fetchCustomerDetail(id),
    enabled: !!id  // 新增！只有在 id 不为空时才执行
  });

  if (isLoading) return <div className="text-center py-10">加载中...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">加载数据失败</div>;

// // 导入API函数
// import { getCustomerDetail } from '@/apis/main';

// const CustomerDetail = () => {
//   const { id } = useParams(); // 从路由参数中获取客户ID

//   // 使用React Query请求数据
//   const { data: customer, isLoading, isError, error, refetch } = useQuery({
//     queryKey: ['customerDetail', id], // 缓存键（包含ID确保唯一性）
//     queryFn: () => getCustomerDetail(id), // 调用API函数
//     enabled: !!id, // 只有ID存在时才发起请求
//     staleTime: 1000 * 60 * 5, // 5分钟内不重复请求（可根据需求调整）
//   });

//   // 加载状态处理
//   if (isLoading) {
//     return (
//       <div className="text-center py-20">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//         <p className="mt-4 text-gray-600">加载客户详情中...</p>
//       </div>
//     );
//   }

//   // 错误状态处理
//   if (isError) {
//     return (
//       <div className="text-center py-20">
//         <p className="text-red-500 mb-4">
//           加载失败：{error instanceof Error ? error.message : '未知错误'}
//         </p>
//         <Button 
//           variant="outline" 
//           onClick={() => refetch()}
//           className="border-blue-300 text-blue-600"
//         >
//           重试
//         </Button>
//       </div>
//     );
//   }

//   // 数据为空处理（防止后端返回空数据）
//   if (!customer) {
//     return (
//       <div className="text-center py-20">
//         <p className="text-gray-500">未找到该客户的信息</p>
//         <Button 
//           asChild 
//           variant="outline" 
//           className="mt-4"
//         >
//           <Link to="/customer/list">返回客户列表</Link>
//         </Button>
//       </div>
//     );
//   } JSX后端测试！！！


  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          asChild 
          variant="ghost" 
          className="text-blue-600 hover:bg-blue-50"
        >
          <Link to="/customer/list">
            <ArrowLeft className="h-4 w-4 mr-2" /> 返回客户列表
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-800">{customer.name} - 客户详情</h1>
        {/* <div className="flex space-x-2">
          <Button variant="outline" className="border-blue-300 text-blue-600">
            <Printer className="mr-2 h-4 w-4" /> 打印 
          </Button> // 删掉
          <Button variant="outline" className="border-blue-300 text-blue-600">
            <Share2 className="mr-2 h-4 w-4" /> 分享
          </Button> // 删掉
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => window.location.href = `#/customer/new?edit=${customer.id}`}
          >
            <Edit className="mr-2 h-4 w-4" /> 编辑信息
          </Button> // 删掉
        </div> */}
      </div>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md bg-blue-50">
          <TabsTrigger value="basic" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">基础信息</TabsTrigger>
          <TabsTrigger value="contacts" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">联系人</TabsTrigger>
          {/* <TabsTrigger value="business" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">业务关系</TabsTrigger>  */}
        </TabsList>
        
        <TabsContent value="basic">
          <Card className="border border-blue-100">
            <CardHeader className="bg-blue-50">
              <CardTitle>基础信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">客户编号</label>
                    <p className="mt-1 font-medium">{customer.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">客户类型</label>
                    <p className="mt-1">{customer.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">所在地区</label>
                    <p className="mt-1">{getRegionLabel(customer.region)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">所在公司</label>
                    <p className="mt-1">{customer.company}</p>
                  </div>
                  {/* 新增 */}
                  <div>
                    <label className="text-sm font-medium text-gray-500">详细地址</label>
                    <p className="mt-1">{customer.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">已上传附件</label>
                    <p className="mt-1">{customer.attachments}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">所属行业</label>
                    <p className="mt-1">{getIndustryLabel(customer.industry)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">联系电话</label>
                    <p className="mt-1">{customer.phone}</p>
                  </div> 
                  {/* 新增 */}
                  <div>
                    {/* <label className="text-sm font-medium text-gray-500">信用等级</label>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        customer.creditRating === 'AAA' ? 'bg-green-100 text-green-800' :
                        customer.creditRating === 'AA' ? 'bg-blue-100 text-blue-800' :
                        customer.creditRating === 'A' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {customer.creditRating}
                      </span>
                    </p> */}
                    <label className="text-sm font-medium text-gray-500">信用等级</label>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-sm ...`}>
                        {getCreditRatingLabel(customer.creditRating)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">创建时间</label>
                    <p className="mt-1">{formatDate(customer.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">备注信息</label>
                    <p className="mt-1">{customer.remarks}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">修改时间及修改人</label>
                    <p className="mt-1">{formatDate(customer.modifiedAt)}，{customer.modifiedBy}</p>
                  </div>
                  {/* 新增 */}
                  {/* <div>
                    <label className="text-sm font-medium text-gray-500">最后更新时间</label>
                    <p className="mt-1">{formatDate(customer.createdAt)}</p>
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts">
          <Card className="border border-blue-100">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center justify-between">
                <span>联系人信息</span>
                {/* <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  添加联系人
                </Button> */}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* contact.全改成customer.contacts[0]. */}
              <div className="grid grid-cols-1 gap-4">
                {customer.contacts.length > 0 && (
                  <Card key={customer.contacts[0].id} className="border border-blue-100">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>{customer.contacts[0].name}</CardTitle>
                        {/* {contact.isPrimary && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            主要联系人
                          </span>
                        )} */}
                      </div>
                      <p className="text-sm text-gray-500">{customer.contacts[0].position}</p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <label className="text-sm font-medium text-gray-500">手机号码</label>
                        <p className="mt-1">{customer.contacts[0].phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">电子邮箱</label>
                        <p className="mt-1">{customer.contacts[0].email}</p>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="border-blue-300 text-blue-600">
                          <Link to="/customer/list">编辑
                          </Link>
                          {/* 新增 */}
                        </Button>
                        {/* <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" /> 删除
                        </Button> */}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* <TabsContent value="business">
          <Card className="border border-blue-100">
            <CardHeader className="bg-blue-50">
              <CardTitle>业务关系</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium mb-4">合作历史</h3>
                  <div className="border-l-2 border-blue-200 pl-4 space-y-8">
                    {customer.businessHistory.slice(0, 5).map(record => (
                      <div key={record.id} className="relative">
                        <div className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"></div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                          <div className="flex justify-between">
                            <span className="font-medium">{record.product}</span>
                            <span className={`text-sm ${
                              record.status === '已完成' ? 'text-green-600' :
                              record.status === '进行中' ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              {record.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(record.date)}</p>
                          <p className="mt-2 text-lg font-semibold">¥{record.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">交易统计</h3>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">总交易额</p>
                        <p className="text-xl font-bold mt-1">¥{customer.businessHistory.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">交易次数</p>
                        <p className="text-xl font-bold mt-1">{customer.businessHistory.length}次</p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">平均交易额</p>
                        <p className="text-xl font-bold mt-1">¥{Math.round(customer.businessHistory.reduce((sum, r) => sum + r.amount, 0) / customer.businessHistory.length).toLocaleString()}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">完成率</p>
                        <p className="text-xl font-bold mt-1">
                          {Math.round(customer.businessHistory.filter(r => r.status === '已完成').length / customer.businessHistory.length * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default CustomerDetail;
