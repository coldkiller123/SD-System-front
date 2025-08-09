import request from './request'; // 通常会创建一个axios实例并导出


//HXY

/**
 * 创建客户
 * @param {string} id - 客户ID
 * @returns {Promise} - 包含客户详情的Promise
 */


/**
 * 更新客户
 * @param {string} id - 客户ID
 * @returns {Promise} - 包含客户详情的Promise
 */



/**
 * 分页查看客户信息
 * @param {Object} params - 请求参数
 * @param {number} params.pageIndex - 当前页码（从1开始，必填）
 * @param {number} [params.pageSize=10] - 每页条数
 * @param {string} [params.name] - 客户名称模糊搜索
 * @param {string} [params.region] - 地区筛选
 * @param {string} [params.industry] - 行业筛选
 * @returns {Promise} - 返回请求的Promise对象
 */
export const getCustomerList = (params) => {
  return request({
    url: '/customer/list',
    method: 'GET',
    params
  });
};


/**
 * 获取客户详情
 * @param {string} id - 客户ID
 * @returns {Promise} - 包含客户详情的Promise
 */
export const getCustomerDetail = async (id) => {
  const response = await request.get('/customer/detail', {
    params: { id }
  });
  console.log('后端返回的原始响应：', response);
  console.log('客户详情数据：', response.info); 
  return response.info;
};


//SYJ

/**
 * 获取已收货订单列表（支持分页和筛选）
 * @param {Object} params - 请求参数
 * @param {number} params.pageIndex - 页码索引（从0开始，默认0）
 * @param {number} params.pageSize - 每页条数（默认10）
 * @param {string} params.orderId - 订单编号模糊搜索（可选）
 * @param {string} params.status - 订单状态（'all'/'invoiced'/'pending'，默认'all'）
 * @returns {Promise} - 包含订单列表的响应数据
 */
export const getDeliveredOrders = async (params = {}) => {
  // 设置默认参数
  const defaultParams = {
    pageIndex: 0,
    pageSize: 10,
    orderId: '',
    status: 'all',
    ...params
  };
  
  const response = await request.get('/api/orders/delivered', { params: defaultParams });
  return response; 
};

/**
 * 生成发票
 * @param {string} orderId - 订单编号（如 SO3005）
 * @returns {Promise} - 包含发票信息的响应数据
 */
export const generateInvoice = async (orderId) => {
  if (!orderId) {
    throw new Error('订单编号不能为空');
  }
  const response = await request.post(`/api/invoice/generate/${orderId}`);
  return response;
};


//ZLC

/**
 * 获取客户列表（用于客户搜索选择器）
 * @returns {Promise} - 包含客户ID和名称的数组
 */
export const getCustomers = async () => {
  const response = await request.get('/customer/customers');
  return response; // 直接返回客户数组（[{id, name}, ...]）
};




/**
 * 获取商品列表（支持搜索筛选）
 * @param {string} [keyword] - 搜索关键词（商品名称或ID）
 * @returns {Promise} - 商品数组，包含id、name、price、stock、description
 */
export const getProducts = async (keyword = '') => {
  // 构建查询参数
  const params = new URLSearchParams();
  if (keyword) params.append('keyword', keyword);
  
  const response = await request.get(`/api/products${params.toString() ? `?${params.toString()}` : ''}`);
  return response;
};



/**
 * 获取订单列表（支持分页和多条件筛选）
 * @param {Object} params - 请求参数
 * @param {number} [params.pageIndex=1] - 当前页码（从0开始）
 * @param {number} [params.pageSize=10] - 每页数量
 * @param {string} [params.orderId] - 按订单编号模糊搜索
 * @param {string} [params.customerName] - 按客户名称模糊搜索
 * @param {string} [params.status] - 订单状态筛选
 * @returns {Promise} - 包含订单列表、总记录数和总页数的响应数据
 */
export const getOrders = async (params = {}) => {
  // 设置默认参数
  const defaultParams = {
    pageIndex: 1,
    pageSize: 10,
    ...params
  };
  
  const response = await request.get('/api/orders', { params: defaultParams });
  return response;
};


/**
 * 创建销售订单
 * @param {Object} orderData - 订单数据
 * @param {string} orderData.customerId - 客户ID（必填）
 * @param {string} orderData.productName - 商品名称（必填）
 * @param {string} orderData.productId - 商品ID（必填）
 * @param {number} orderData.quantity - 数量（必填）
 * @param {number} orderData.unitPrice - 单价（必填）
 * @param {number} orderData.totalAmount - 总金额（必填）
 * @param {number} orderData.paidAmount - 实付金额（必填）
 * @param {string} orderData.status - 订单状态（必填）
 * @param {string} orderData.salesPerson - 销售人员（必填）
 * @param {string} [orderData.remarks] - 备注（可选）
 * @param {string} [orderData.createdAt] - 创建时间（可选）
 * @returns {Promise} - 包含创建的订单信息（含订单ID）的响应数据
 */
export const createOrder = async (orderData) => {
  const response = await request.post('/api/orders', orderData);
  return response;
};




// 更新销售订单
export const updateOrder = async (id, data) => {
  try {
    const response = await request.put(`/api/orders/${id}`, data);
    return response;
  } catch (error) {
    const errorMsg = error.response?.data?.message || '更新订单失败';
    throw new Error(errorMsg);
  }
};



/**
 * 获取销售订单详情（含操作历史）
 * @param {string} id - 订单编号（必填）
 * @returns {Promise} - 包含订单详情和操作历史的响应数据
 */
export const getOrderDetail = async (id) => {
  if (!id) {
    throw new Error('订单编号不能为空');
  }
  const response = await request.get(`/api/orders/${id}`);
  console.log('后端返回的原始响应：', response);
  console.log('客户详情数据：', response.info); 
  console.log('客户详情数据：', response.data); 
  return response;
};



/**
 * 获取询价单列表（适配新接口）
 * @param {Object} params - 请求参数
 * @param {number} [params.pageIndex=0] - 当前页码（从0开始，默认0）
 * @param {number} [params.pageSize=10] - 每页数量（默认10）
 * @param {string} [params.search] - 统一搜索关键词（用于匹配询价单号和客户名称）
 * @param {string} [params.status] - 状态筛选（未报价/已报价）
 * @returns {Promise} - 包含询价单列表和分页信息的响应
 */
export const getInquiries = async (params = {}) => {
  // 设置默认参数
  const defaultParams = {
    pageIndex: 0,
    pageSize: 10,
    ...params
  };

  // 构建查询参数（仅传递有效参数）
  const validParams = Object.entries(defaultParams).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});

  const response = await request.get('/api/inquiries', { params: validParams });
  return response;
};


/**
 * 创建询价单接口
 * @param {Object} data - 询价单数据
 * @returns {Promise} - 接口响应
 */
export const createInquiry = async (data) => {
  // 使用封装的request工具发送POST请求
  return await request.post('/api/inquiries', data);
};



//更新询价单状态
export const updateInquiryStatus = async (inquiryId, statusData) => {
  return await request.put(`/api/inquiries/${inquiryId}/status`, statusData);
};





//HYN

/**
 * 获取未发货订单列表（状态为“已付款”的订单）
 * @param {Object} params - 请求参数
 * @param {number} params.page - 当前页码（前端从1开始，后端从0开始）
 * @param {number} params.pageSize - 每页数量
 * @param {string} [params.search] - 搜索关键字（订单号、客户名称、商品名称）
 * @returns {Promise<Object>} 包含订单列表和分页信息的响应
 */
export const fetchUnshippedOrders = async ({ page, pageSize, search }) => {
  const response = await request.get('/api/orders/unshipped', {
    params: {
      page: page, // 转换为后端需要的从0开始的页码
      page_size: pageSize,
      search: search || undefined, // 无搜索时不传递该参数
    },
  });

  return {
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
    orders: response.data.orders.map(order => ({
      id: order.id,
      customerId: order.customerId,
      customerName: order.customerName,
      productName: order.productName,
      quantity: order.quantity,
      orderDate: order.orderDate, // 后端返回的下单日期
      amount: order.amount, // 订单总金额
      status: order.status,
    })),
  };
};


/**
 * 创建发货单
 * @param {Object} data - 发货单信息
 * @param {string[]} data.orderIds - 要发货的订单ID数组
 * @param {string} [data.remarks] - 发货备注（最多200字符）
 * @param {string} data.deliveryDate - 发货单创建时间（YYYY-MM-DD）
 * @param {string} data.warehouseManager - 仓库管理员姓名
 * @returns {Promise<Object>} 包含发货单ID的响应
 */
export const createDeliveryOrder = async ({ orderIds, remarks, deliveryDate, warehouseManager }) => {
  const response = await request.post('/api/delivery-orders', {
    order_ids: orderIds, // 后端要求的参数名是 order_ids
    remarks: remarks || '',
    deliveryDate,
    warehouseManager,
  });

  return {
    deliveryOrderId: response.deliveryOrderId,
    message: response.message     
  };
};



/**
 * 获取状态为已发货&已完成的订单列表
 * @param {Object} params - 请求参数
 * @param {number} [params.page=1] - 页码（从1开始，默认1）
 * @param {number} [params.pageSize=10] - 每页数量（默认10）
 * @param {string} [params.search] - 搜索关键词（订单号/发货单号/客户名称）
 * @returns {Promise} - 包含订单列表和分页信息的响应
 */
export const getInprocessOrders = async (params = {}) => {
  // 设置默认参数，合并用户传入的参数
  const {
    page = 1,
    pageSize = 10,
    search
  } = params;

  const response = await request.get('/api/orders/inprocess', {
    params: {
      status: '已发货,已完成', // 固定状态值，按后端要求用英文逗号分隔
      page,
      page_size: pageSize,
      search: search || undefined // 无搜索时不传递该参数
    }
  });
  console.log('后端返回的原始响应：', response);
  console.log('客户详情数据：', response.info); 
  console.log('客户详情数据：', response.data); 

  // 解析响应数据，转换为前端易用的格式
  return {
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
    orders: response.data.orders.map(order => ({
      id: order.id,
      deliveryOrderId: order.deliveryOrderId,
      customerName: order.customerName,
      productName: order.productName,
      quantity: order.quantity,
      amount: order.amount,
      orderDate: order.orderDate,
      status: order.status
    }))
  };
};



/**
 * 修改指定订单的状态（仅支持"已发货"→"已完成"）
 * @param {string} orderId - 订单号
 * @returns {Promise} - 状态更新结果
 */
export const updateOrderStatusToCompleted = async (orderId) => {
  if (!orderId) {
    throw new Error('订单号不能为空');
  }

  const response = await request.put(`/api/orders/${orderId}/status`, {
    status: '已完成' // 固定值，仅支持更新为"已完成"
  });

  return {
    code: response.data.code,
    message: response.data.message
  };
};
    