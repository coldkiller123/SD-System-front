// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

const allContacts = [
  { id: 'CT1', name: '张三', position: '经理', phone: '13811112222', email: 'zhangsan@example.com' },
  { id: 'CT2', name: '张伟', position: '主任', phone: '13822223333', email: 'zhangwei@example.com' },
  { id: 'CT3', name: '李四', position: '主管', phone: '13911112222', email: 'lisi@example.com' },
  { id: 'CT4', name: '王五', position: '工程师', phone: '13711112222', email: 'wangwu@example.com' },
  // ...新增，可继续补充
];

let customerData = Array.from({ length: 45 }, (_, i) => {
  const id = `C${1000 + i}`;
  return {
    id,
    name: `客户${i + 1}`,
    region: ['华东', '华北', '华南', '华中', '西南'][i % 5],  
    industry: ['制造业', '零售业', '金融业', '互联业', '教育业'][i % 5],
    company: `公司${i + 1}`,
    phone: `138${10000000 + i}`,
    contact: allContacts[i % allContacts.length].name, // 取联系人姓名
    creditRating: ['AAA', 'AA', 'A', 'BBB', 'BB'][i % 5],
    address: `地址${i + 1}`,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    modifiedBy: `用户${i + 1}`,
    contacts: [allContacts[i % allContacts.length]], // 直接引用联系人对象
    remarks: `这是客户${i + 1}的备注信息`,
    attachments: []
  };
});

export const handlers = [
  // 1. 客户列表 + 分页 + 筛选
  http.get('/customer/list', ({ request }) => {
    console.log('[MSW] /customer/list 请求已拦截'); // 调试信息
    const url = new URL(request.url);
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

    return HttpResponse.json({
      data: {
        total: filtered.length,
        pageCount,
        customers
      }
    });
  }),

  // 2. 客户详情
  http.get('/customer/detail/:id', ({ params }) => {
    console.log(`[MSW] /customer/detail/${params.id} 请求已拦截`); // 调试信息
    const customer = customerData.find(c => c.id === params.id);
    if (!customer) {
      return HttpResponse.json({ message: '未找到客户' }, { status: 404 });
    }
    return HttpResponse.json({ info: customer });
  }),

  // 3. 新增客户
  http.post('/customer/create', async ({ request }) => {
    const newCustomer = await request.json();
    newCustomer.id = `C${Math.floor(1000 + Math.random() * 1000)}`;
    customerData.unshift(newCustomer);
    console.log(`[MSW] /customer/create 请求已拦截：新建客户 ${newCustomer.id}`);
    return HttpResponse.json({ info: '客户信息创建成功', customer: newCustomer });
  }),

  // 4. 修改客户
  http.put('/customer/update/:id', async ({ request, params }) => {
    console.log(`[MSW] /customer/update/${params.id} 请求已拦截`); // 调试信息
    const updatedCustomer = await request.json();
    const id = params.id;
    const index = customerData.findIndex(c => c.id === id);
    if (index === -1) {
        return HttpResponse.json({ info: '未找到客户' }, { status: 404 });
    }
    // 用请求体中的数据更新原始数据
    customerData[index] = {
        ...customerData[index],
        ...updatedCustomer,
    };
    return HttpResponse.json({ info: '客户信息修改成功', customer: customerData[index] });
  }),

  // 5. 联系人搜索
  http.get('/contacts/search', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('name') || '';
    const result = allContacts.filter(c => c.name.includes(keyword));
    return HttpResponse.json({ contacts: result });
  }),

  // 6. 附件上传，还未实现，未测试
  http.post('/customer/upload', async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id');
    const files = formData.getAll('file');

    const uploaded = files.map(file => ({
      filename: file.name,
      filepath: `/uploads/${id}/${file.name}`
    }));

    return HttpResponse.json({
      data: {
        attachments: uploaded
      }
    });
  })
];
