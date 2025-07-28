import { rest } from 'msw';
import ordersData from './orders.json';
import inquiriesData from './inquiries.json';

// ===== 客户管理数据源 =====
const allContacts = [
  { id: 'CT1', name: '张三', position: '经理', phone: '13811112222', email: 'zhangsan@example.com' },
  { id: 'CT2', name: '张伟', position: '主任', phone: '13822223333', email: 'zhangwei@example.com' },
  { id: 'CT3', name: '李四', position: '主管', phone: '13911112222', email: 'lisi@example.com' },
  { id: 'CT4', name: '王五', position: '工程师', phone: '13711112222', email: 'wangwu@example.com' }
];

let customerData = Array.from({ length: 45 }, (_, i) => {
  const id = `C${1000 + i}`;
  return {
    id,
    name: `客户${i + 1}`,
    region: ['华东', '华北', '华南', '华中', '西南'][i % 5],
    industry: ['制造业', '零售业', '金融业', '互联网', '教育'][i % 5],
    company: `公司${i + 1}`,
    phone: `138${10000000 + i}`,
    contact: allContacts[i % allContacts.length].name,
    creditRating: ['AAA', 'AA', 'A', 'BBB', 'BB'][i % 5],
    address: `地址${i + 1}`,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    modifiedBy: `用户${i + 1}`,
    contacts: [allContacts[i % allContacts.length]],
    remarks: `这是客户${i + 1}的备注信息`,
    attachments: []
  };
});

export const handlers = [
  // ============= 客户管理接口 =============
  // 1. 获取客户列表 + 分页 + 筛选
  rest.get('/api/customer/list', (req, res, ctx) => {
    const url = new URL(req.url);
    const pageIndex = parseInt(url.searchParams.get('pageIndex')) || 0;
    const pageSize = parseInt(url.searchParams.get('pageSize')) || 10;
    const name = url.searchParams.get('name') || '';
    const region = url.searchParams.get('region') || '';
    const industry = url.searchParams.get('industry') || '';

    let filtered = customerData.filter(c =>
      c.name.includes(name) &&
      (!region || c.region === region) &&
      (!industry || c.industry === industry)
    );

    const pageCount = Math.ceil(filtered.length / pageSize);
    const customers = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

    return res(ctx.status(200), ctx.json({ data: { total: filtered.length, pageCount, customers } }));
  }),
  // 2. 客户详情
  rest.get('/api/customer/detail/:id', (req, res, ctx) => {
    const { id } = req.params;
    const customer = customerData.find(c => c.id === id);
    if (!customer) {
      return res(ctx.status(404), ctx.json({ message: '未找到客户' }));
    }
    return res(ctx.status(200), ctx.json({ info: customer }));
  }),
  // 3. 新增客户
  rest.post('/api/customer/create', async (req, res, ctx) => {
    console.log('[mock] /api/customer/create 收到请求');
    // // const newCustomer = await req.json();
    // const buffer = await req.arrayBuffer();
    // const jsonStr = new TextDecoder().decode(buffer);
    // const newCustomer = JSON.parse(jsonStr);
    // newCustomer.id = `C${Math.floor(1000 + Math.random() * 1000)}`;
    // customerData.unshift(newCustomer);
    // return res(ctx.status(200), ctx.json({ info: '客户信息创建成功', customer: newCustomer }));
    try {
      const buffer = await req.arrayBuffer();
      const jsonStr = new TextDecoder().decode(buffer);
      console.log('[debug] jsonStr:', jsonStr); // 👈 打印原始请求体
      const newCustomer = JSON.parse(jsonStr);

      newCustomer.id = `C${Math.floor(1000 + Math.random() * 1000)}`;
      customerData.unshift(newCustomer);

      return res(
        ctx.status(200),
        ctx.json({ info: '客户信息创建成功', customer: newCustomer })
      );
    } catch (e) {
      console.error('[mock create error]', e); // 👈 捕获错误
      return res(ctx.status(500), ctx.json({ info: 'Mock 创建客户失败', error: e.message }));
    }
  }),
  // 4. 修改客户
  rest.put('/api/customer/update/:id', async (req, res, ctx) => {
    const { id } = req.params;
    // const updatedCustomer = await req.json();
    const buffer = await req.arrayBuffer();
    const jsonStr = new TextDecoder().decode(buffer);
    const updatedCustomer = JSON.parse(jsonStr);
    const index = customerData.findIndex(c => c.id === id);
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ info: '未找到客户' }));
    }
    customerData[index] = { ...customerData[index], ...updatedCustomer };
    return res(ctx.status(200), ctx.json({ info: '客户信息修改成功', customer: customerData[index] }));
  }),
  // 5. 联系人搜索
  rest.get('/api/contacts/search', (req, res, ctx) => {
    const keyword = new URL(req.url).searchParams.get('name') || '';
    const result = allContacts.filter(c => c.name.includes(keyword));
    return res(ctx.status(200), ctx.json({ contacts: result }));
  }),
  // 6. 附件上传，未实现，未测试
  // ============= 库存管理接口 =============
  // 1. 获取未发货订单
  rest.get('/api/orders/unshipped', (req, res, ctx) => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const pageSize = parseInt(url.searchParams.get('page_size') || '10');
    const search = url.searchParams.get('search') || '';

    // 固定总订单数为85
    const totalOrders = 85; 
    
    // 计算当前页实际应返回的数据量
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalOrders);
    const currentPageSize = endIndex - startIndex;

    // 生成当前页数据
    const orders = Array.from({ length: currentPageSize }, (_, i) => {
      const globalIndex = startIndex + i; // 全局索引
      const orderId = `SO${5000 + globalIndex}`;
      const customerId = `C${2000 + (globalIndex % 15)}`;
      
      return {
        id: orderId,
        customerId,
        customerName: `客户${customerId.substring(1)}`,
        productName: `商品${Math.floor(Math.random() * 50)}`,
        quantity: Math.floor(1 + Math.random() * 20),
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalAmount: Math.floor(500 + Math.random() * 5000),
        status: '已付款'
      };
    });

    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: "成功",
        data: {
          total: totalOrders, // 总订单数85
          page,
          page_size: pageSize,
          orders
        }
      })
    );
  }),

  // 2. 创建发货单
  rest.post('/api/delivery-orders', async (req, res, ctx) => {
    const body = await req.json();
    const { order_ids, deliveryDate, warehouseManager } = body;
    
    // 直接返回成功响应（无状态检查）
    return res(
      ctx.status(200),
      ctx.json({
        code: 200,
        message: "成功",
        deliveryOrderId: `DO-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      })
    );
  }),

  // ============= 原有接口 =============
    // SalesOrderForm接口模拟-新建销售订单
  rest.post('/api/orders', async (req, res, ctx) => {
    const data = await req.json();
    // 生成订单ID
    const id = 'SO' + Math.random().toString().slice(2, 8);
    // 返回新订单数据
    return res(
      ctx.status(201),
      ctx.json({
        id,
        ...data
      })
    );
  }),
  //CreateInquiry接口模拟-询价单列表
  rest.get('/api/inquiries', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(inquiriesData));
  }),
  // CreateInquiry接口模拟-新建询价单
  rest.post('/api/inquiries', async (req, res, ctx) => {
    const newInquiry = await req.json();
    // 这里可以把 newInquiry 推到 inquiriesData.inquiries 数组里（如需持久化可用内存变量）
    console.log('收到前端POST数据:', newInquiry); // 这行会在浏览器控制台输出
    return res(ctx.status(201), ctx.json({ message: '创建成功', ...newInquiry }));
  }),
  //SalesOrderList接口模拟-销售订单列表
  rest.get('/api/orders', (req, res, ctx) => {
    // 你可以在这里根据 req.url.searchParams 处理分页和筛选
    return res(ctx.status(200), ctx.json(ordersData));
  }),

  rest.get('/api/orders/delivered', (req, res, ctx) => {
  const allData = Array.from({ length: 45 }, (_, i) => {
    const hasInvoice = i > 5;
    return {
      id: `SO${3000 + i}`,
      customerId: `C${1500 + (i % 10)}`,
      customerName: `客户${1500 + (i % 10)}`,
      amount: Math.floor(1000 + Math.random() * 9000),
      orderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      deliveryDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: '已收货',
      hasInvoice,
      invoiceId: hasInvoice ? `INV${Math.floor(10000 + Math.random() * 90000)}` : null
    };
  });

  // 获取查询参数
  const pageIndex = parseInt(req.url.searchParams.get('pageIndex')) || 0;
  const pageSize = parseInt(req.url.searchParams.get('pageSize')) || 10;
  const orderId = req.url.searchParams.get('orderId')?.trim();
  const status = req.url.searchParams.get('status') || 'all'; // invoiced | pending | all

  // 多重过滤
  let filteredData = allData;

  if (orderId) {
    filteredData = filteredData.filter(order =>
      order.id.toLowerCase().includes(orderId.toLowerCase())
    );
  }

  if (status === 'invoiced') {
    filteredData = filteredData.filter(order => order.hasInvoice);
  } else if (status === 'pending') {
    filteredData = filteredData.filter(order => !order.hasInvoice);
  }

  // 分页处理
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const pageData = filteredData.slice(start, end);

  return res(
    ctx.status(200),
    ctx.json({
      data: pageData,
      total: filteredData.length,
      pageCount: Math.ceil(filteredData.length / pageSize),
    })
  );
}),


  // 生成发票
  rest.post('/api/invoice/generate/:orderId', (req, res, ctx) => {
    const { orderId } = req.params;

    const invoice = {
      invoiceId: `INV${Math.floor(10000 + Math.random() * 90000)}`,
      orderId,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      taxRate: 0.13,
      status: '待付款',
      customer: {
        id: `C${1500 + (parseInt(orderId.substring(2)) % 10)}`,
        name: `客户${1500 + (parseInt(orderId.substring(2)) % 10)}`,
        address: `地址${orderId}`,
        taxId: `TAX${Math.floor(10000 + Math.random() * 90000)}`
      },
      items: [
        {
          id: `P${4000 + parseInt(orderId.substring(2))}`,
          name: `商品${parseInt(orderId.substring(2)) + 1}`,
          quantity: Math.floor(1 + Math.random() * 10),
          unitPrice: Math.floor(100 + Math.random() * 500),
          description: '标准商品'
        },
        {
          id: `P${4001 + parseInt(orderId.substring(2))}`,
          name: `商品${parseInt(orderId.substring(2)) + 2}`,
          quantity: Math.floor(1 + Math.random() * 5),
          unitPrice: Math.floor(200 + Math.random() * 800),
          description: '高级商品'
        }
      ]
    };

    return res(ctx.status(200), ctx.json(invoice));
  })
];