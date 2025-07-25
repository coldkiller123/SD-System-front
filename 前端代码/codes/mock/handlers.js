import { rest } from 'msw';
import ordersData from './orders.json';
import inquiriesData from './inquiries.json';

export const handlers = [
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
];