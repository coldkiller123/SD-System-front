// import { rest } from 'msw';
// import { REGION_OPTIONS, INDUSTRY_OPTIONS } from '../src/constants/options';
// import SearchableSelect from '@/components/SearchableSelect';
// import ordersData from './orders.json';
// import inquiriesData from './inquiries.json';
// import { CREDIT_RATING_OPTIONS } from '../src/constants/options';

// function formatMinutesAgo(minutes) {
//   return `${minutes}分钟前`;
// }

// // ===== 客户管理数据源 =====
// const allContacts = [
//   { id: 'CT1', name: '销售小孙', position: '销售代表', phone: '13811112222', email: 'xiaosun@example.com' },
//   { id: 'CT2', name: '销售小何', position: '销售代表', phone: '13822223333', email: 'xiaohe@example.com' },
//   { id: 'CT3', name: '销售组长凝凝子', position: '销售经理', phone: '13911112222', email: 'ningningzi@example.com' }
// ];

// let customerData = Array.from({ length: 45 }, (_, i) => {
//   const id = `C${1000 + i}`;
//   return {
//     id,
//     name: `客户${i + 1}`,
//     // region: ['华东', '华北', '华南', '华中', '西南'][i % 5],
//     // industry: ['制造业', '零售业', '金融业', '互联网', '教育'][i % 5],
//     region: REGION_OPTIONS[i % REGION_OPTIONS.length].code,
//     industry: INDUSTRY_OPTIONS[i % INDUSTRY_OPTIONS.length].code,
//     company: `公司${i + 1}`,
//     phone: `138${10000000 + i}`,
//     // contact: allContacts[i % allContacts.length].name,
//     creditRating: CREDIT_RATING_OPTIONS[i % CREDIT_RATING_OPTIONS.length].code,
//     address: `地址${i + 1}`,
//     createdAt: new Date().toISOString(),
//     modifiedAt: new Date().toISOString(),
//     modifiedBy: `用户${i + 1}`,
//     contacts: [allContacts[i % allContacts.length]],
//     remarks: `这是客户${i + 1}的备注信息`,
//     attachments: []
//   };
// });


// export const handlers = [
//   // ============= 客户管理接口 =============
//   // 1. 获取客户列表 + 分页 + 筛选
//   rest.get('/api/customer/list', (req, res, ctx) => {
//     const url = new URL(req.url);
//     const pageIndex = parseInt(url.searchParams.get('pageIndex')) || 0;
//     const pageSize = parseInt(url.searchParams.get('pageSize')) || 10;
//     const name = url.searchParams.get('name') || '';
//     const region = url.searchParams.get('region') || '';
//     const industry = url.searchParams.get('industry') || '';
//     const creditRating = url.searchParams.get('creditRating') || '';

//     let filtered = customerData.filter(c =>
//       c.name.includes(name) &&
//       (!region || region === 'all' || c.region === region) &&
//       (!industry || industry === 'all' || c.industry === industry) &&
//       (!creditRating || creditRating === 'all' || c.creditRating === creditRating)
//     );

//     const pageCount = Math.ceil(filtered.length / pageSize);
//     const customers = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

//     return res(ctx.status(200), ctx.json({ data: { total: filtered.length, pageCount, customers } }));
//   }),

//   // 2. 客户详情
//   rest.get('/api/customer/detail/:id', (req, res, ctx) => {
//     const { id } = req.params;
//     const customer = customerData.find(c => c.id === id);
//     if (!customer) {
//       return res(ctx.status(404), ctx.json({ message: '未找到客户' }));
//     }
//     return res(ctx.status(200), ctx.json({ info: customer }));
//   }),

//   // 3. 新增客户
//   rest.post('/api/customer/create', async (req, res, ctx) => {
//     console.log('[mock] /api/customer/create 收到请求');
//     const newCustomer = await req.json();
//     newCustomer.id = `C${Math.floor(1000 + Math.random() * 1000)}`;
//     customerData.unshift(newCustomer);
//     return res(ctx.status(200), ctx.json({ info: '客户信息创建成功', customer: newCustomer }));
//   }),

//   // 4. 修改客户
//   rest.put('/api/customer/update/:id', async (req, res, ctx) => {
//     const { id } = req.params;
//     const updatedCustomer = await req.json();
//     const index = customerData.findIndex(c => c.id === id);
//     if (index === -1) {
//       return res(ctx.status(404), ctx.json({ info: '未找到客户' }));
//     }
//     customerData[index] = { ...customerData[index], ...updatedCustomer };
//     return res(ctx.status(200), ctx.json({ info: '客户信息修改成功', customer: customerData[index] }));
//   }),

//   // 5. 联系人搜索
//   rest.get('/api/contacts/search', (req, res, ctx) => {
//     const keyword = new URL(req.url).searchParams.get('name') || '';
//     const result = allContacts.filter(c => c.name.includes(keyword));
//     return res(ctx.status(200), ctx.json({ contacts: result }));
//   }),
//   // 6. 附件上传，未实现，未测试
//   // ============= 库存管理接口 =============
//   // 1. 获取未发货订单
//   rest.get('/api/orders/unshipped', (req, res, ctx) => {
//     const url = new URL(req.url);
//     const page = parseInt(url.searchParams.get('page') || '0');
//     const pageSize = parseInt(url.searchParams.get('page_size') || '10');
//     const search = (url.searchParams.get('search') || '').trim();

//     // 生成全部未发货订单的模拟数据（固定85条）
//     const totalOrders = 85;
//     const allOrders = Array.from({ length: totalOrders }, (_, i) => {
//       const orderId = `SO${5000 + i}`;
//       const customerId = `C${2000 + (i % 15)}`;
//       const customerName = `客户${customerId.substring(1)}`;
//       const productName = `商品${(i % 50) + 1}`;
//       return {
//         id: orderId,
//         customerId,
//         customerName,
//         productName,
//         quantity: Math.floor(1 + Math.random() * 20),
//         createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//         totalAmount: Math.floor(500 + Math.random() * 5000),
//         status: '已付款'
//       };
//     });

//     // 搜索逻辑：支持订单号、客户名称、商品名称模糊匹配
//     let filteredOrders = allOrders;
//     if (search) {
//       filteredOrders = allOrders.filter(order => {
//         return (
//           order.id.includes(search) ||
//           order.customerName.includes(search) ||
//           order.productName.includes(search)
//         );
//       });
//     }

//     const total = filteredOrders.length;
//     const startIndex = page * pageSize;
//     const endIndex = Math.min(startIndex + pageSize, total);
//     const orders = filteredOrders.slice(startIndex, endIndex);

//     return res(
//       ctx.status(200),
//       ctx.json({
//         code: 200,
//         message: "成功",
//         data: {
//           total,
//           page,
//           page_size: pageSize,
//           orders
//         }
//       })
//     );
//   }),

//   // 2. 创建发货单
//   rest.post('/api/delivery-orders', async (req, res, ctx) => {
//     const body = await req.json();
//     const { order_ids, deliveryDate, warehouseManager } = body;
    
//     // 直接返回成功响应（无状态检查）
//     return res(
//       ctx.status(200),
//       ctx.json({
//         code: 200,
//         message: "成功",
//         deliveryOrderId: `DO-${Date.now()}-${Math.floor(Math.random() * 1000)}`
//       })
//     );
//   }),

//   // 3. 获取已发货及已完成的订单
//   rest.get('/api/orders/inprocess', (req, res, ctx) => {
//     const url = new URL(req.url);
//     const page = parseInt(url.searchParams.get('page') || '0');
//     const pageSize = parseInt(url.searchParams.get('page_size') || '10');
//     const search = url.searchParams.get('search') || '';
//     const statuses = url.searchParams.get('status') || '已发货,已完成';

//     // 固定总订单数
//     const totalOrders = 85;
    
//     // 计算当前页实际应返回的数据量
//     const startIndex = page * pageSize;
//     const endIndex = Math.min(startIndex + pageSize, totalOrders);
//     const currentPageSize = endIndex - startIndex;

//     // 生成当前页数据
//     let orders = Array.from({ length: currentPageSize }, (_, i) => {
//       const globalIndex = startIndex + i;
//       const orderId = `SO${5000 + globalIndex}`;
//       const deliveryOrderId = `DO${7000 + globalIndex}`;
//       const customerId = `C${2000 + (globalIndex % 15)}`;
      
//       // 随机生成状态：60%已发货，40%已完成
//       const status = Math.random() > 0.4 ? '已发货' : '已完成';
      
//       return {
//         id: orderId,
//         deliveryOrderId,
//         customerId,
//         customerName: `客户${customerId.substring(1)}`,
//         productName: `商品${Math.floor(Math.random() * 50)}`,
//         quantity: Math.floor(1 + Math.random() * 20),
//         createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
//         totalAmount: Math.floor(500 + Math.random() * 5000),
//         status
//       };
//     });

//     // 额外加入一个发货单号，包含两个订单号及其数据
//     // 这两个订单号为 SO99901, SO99902，发货单号为 DO88888
//     const extraDeliveryOrderId = 'DO88888';
//     const extraOrders = [
//       {
//         id: 'SO99901',
//         deliveryOrderId: extraDeliveryOrderId,
//         customerId: 'C3001',
//         customerName: '客户3001',
//         productName: '商品特供A',
//         quantity: 5,
//         createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
//         totalAmount: 1888,
//         status: '已发货'
//       },
//       {
//         id: 'SO99902',
//         deliveryOrderId: extraDeliveryOrderId,
//         customerId: 'C3002',
//         customerName: '客户3002',
//         productName: '商品特供B',
//         quantity: 8,
//         createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
//         totalAmount: 2666,
//         status: '已完成'
//       }
//     ];

//     // 将这两个订单插入到 orders 的最前面
//     orders = [...extraOrders, ...orders];

//     // 应用搜索过滤
//     const filteredOrders = orders.filter(order => {
//       const searchLower = search.toLowerCase();
//       return (
//         order.id.toLowerCase().includes(searchLower) ||
//         (order.deliveryOrderId && order.deliveryOrderId.toLowerCase().includes(searchLower)) ||
//         order.customerName.toLowerCase().includes(searchLower)
//       );
//     });

//     return res(
//       ctx.status(200),
//       ctx.json({
//         code: 200,
//         message: "成功",
//         data: {
//           total: totalOrders + 2, // 总数加上额外的2个订单
//           page,
//           page_size: pageSize,
//           orders: filteredOrders
//         }
//       })
//     );
//   }),

//   // 4. 修改订单状态
//   rest.put('/api/orders/:orderId/status', async (req, res, ctx) => {
//     const { orderId } = req.params;
//     const { status } = await req.json();
    
//     return res(
//       ctx.status(200),
//       ctx.delay(500), // 模拟网络延迟
//       ctx.json({
//         code: 200,
//         message: `订单 ${orderId} 状态已更新为 ${status}`
//       })
//     );
//   }),

//   // ============= 原有接口 =============
//     // SalesOrderForm接口模拟-新建销售订单
//   rest.post('/api/orders', async (req, res, ctx) => {
//     const data = await req.json();
//     // 生成订单ID
//     const id = 'SO' + Math.random().toString().slice(2, 8);
//     // 返回新订单数据
//     return res(
//       ctx.status(201),
//       ctx.json({
//         id,
//         ...data
//       })
//     );
//   }),
//   //CreateInquiry接口模拟-询价单列表
//   rest.get('/api/inquiries', (req, res, ctx) => {
//     return res(ctx.status(200), ctx.json(inquiriesData));
//   }),
//   // CreateInquiry接口模拟-新建询价单
//   rest.post('/api/inquiries', async (req, res, ctx) => {
//     const newInquiry = await req.json();
//     // 这里可以把 newInquiry 推到 inquiriesData.inquiries 数组里（如需持久化可用内存变量）
//     console.log('收到前端POST数据:', newInquiry); // 这行会在浏览器控制台输出
//     return res(ctx.status(201), ctx.json({ message: '创建成功', ...newInquiry }));
//   }),
//   //SalesOrderList接口模拟-销售订单列表
//   rest.get('/api/orders', (req, res, ctx) => {
//     // 你可以在这里根据 req.url.searchParams 处理分页和筛选
//     return res(ctx.status(200), ctx.json(ordersData));
//   }),

//   rest.get('/api/orders/delivered', (req, res, ctx) => {
//   const allData = Array.from({ length: 45 }, (_, i) => {
//     const hasInvoice = i > 7;
//     return {
//       id: `SO${3000 + i}`,
//       customerId: `C${1500 + (i % 10)}`,
//       customerName: `客户${1500 + (i % 10)}`,
//       amount: Math.floor(1000 + Math.random() * 9000),
//       orderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
//       deliveryDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
//       status: '已完成',
//       hasInvoice,
//       invoiceId: hasInvoice ? `INV${Math.floor(10000 + Math.random() * 90000)}` : null
//     };
//   });

//   // 获取查询参数
//   const pageIndex = parseInt(req.url.searchParams.get('pageIndex')) || 0;
//   const pageSize = parseInt(req.url.searchParams.get('pageSize')) || 10;
//   const orderId = req.url.searchParams.get('orderId')?.trim();
//  // const status = req.url.searchParams.get('status') || 'all'; // invoiced | pending | all
// const hasInvoiceParam = req.url.searchParams.get('hasInvoice'); 
//   // 多重过滤
//   let filteredData = allData;

//   if (orderId) {
//     filteredData = filteredData.filter(order =>
//       order.id.toLowerCase().includes(orderId.toLowerCase())
//     );
//   }

//    if (hasInvoiceParam === 'true') {
//     filteredData = filteredData.filter(order => order.hasInvoice);
//   } else if (hasInvoiceParam === 'false') {
//     filteredData = filteredData.filter(order => !order.hasInvoice);
//   }

//   // 分页处理
//   const start = pageIndex * pageSize;
//   const end = start + pageSize;
//   const pageData = filteredData.slice(start, end);

//   return res(
//     ctx.status(200),
//     ctx.json({
//       data: pageData,
//       total: filteredData.length,
//       pageCount: Math.ceil(filteredData.length / pageSize),
//     })
//   );
// }),


//   // 生成发票
//   rest.post('/api/invoice/generate/:orderId', (req, res, ctx) => {
//     const { orderId } = req.params;

//     const invoice = {
//       invoiceId: `INV${Math.floor(10000 + Math.random() * 90000)}`,
//       orderId,
//       issueDate: new Date().toISOString(),
//       dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
//       taxRate: 0.13,
//       status: '待付款',
//       customer: {
//         id: `C${1500 + (parseInt(orderId.substring(2)) % 10)}`,
//         name: `客户${1500 + (parseInt(orderId.substring(2)) % 10)}`,
//         address: `地址${orderId}`,
//         taxId: `TAX${Math.floor(10000 + Math.random() * 90000)}`
//       },
//       items: [
//         {
//           id: `P${4000 + parseInt(orderId.substring(2))}`,
//           name: `商品${parseInt(orderId.substring(2)) + 1}`,
//           quantity: Math.floor(1 + Math.random() * 10),
//           unitPrice: Math.floor(100 + Math.random() * 500),
//           description: '标准商品'
//         },
//         {
//           id: `P${4001 + parseInt(orderId.substring(2))}`,
//           name: `商品${parseInt(orderId.substring(2)) + 2}`,
//           quantity: Math.floor(1 + Math.random() * 5),
//           unitPrice: Math.floor(200 + Math.random() * 800),
//           description: '高级商品'
//         }
//       ]
//     };

//     return res(ctx.status(200), ctx.json(invoice));
//   }),
//     rest.get('/api/activities/latest', (req, res, ctx) => {
//    return res(
//   ctx.status(200),
//   ctx.json({
//     code: 200,
//     message: "success",
//     data: {
//       activities: [
//         {
//           titleAct: "新客户注册",
//           titleSta: "客户总数",
//           value: 5,
//           icon: "Users",
//           todayNew: 0,
//           description: "客户名称：上海 - 20小时前",
//           module: "客户管理",
//           color: "blue"
//         },
//         {
//           titleAct: "新订单创建",
//           titleSta: "订单总数",
//           value: 9,
//           icon: "FileText",
//           todayNew: 0,
//           description: "订单号：SO202500009 - 20小时前",
//           module: "订单管理",
//           color: "green"
//         },
//         {
//           titleAct: "新发货单创建",
//           titleSta: "发货单总数",
//           value: 1,
//           icon: "Package",
//           todayNew: 0,
//           description: "发货单号：DEL20250730-001 - 20小时前",
//           module: "发货管理",
//           color: "purple"
//         },
//         {
//           titleAct: "新发票开具",
//           titleSta: "发票总数",
//           value: 5,
//           icon: "Receipt",
//           todayNew: 5,
//           description: "发票号：INV20250731-005 - 刚刚",
//           module: "财务管理",
//           color: "red"
//         }
//       ]
//     }
//   })
// );
//   }),
// ];

