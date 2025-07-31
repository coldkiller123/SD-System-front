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
 * 获取订单列表（支持分页和多条件筛选）
 * @param {Object} params - 请求参数
 * @param {number} [params.pageIndex=0] - 当前页码（从0开始）
 * @param {number} [params.pageSize=10] - 每页数量
 * @param {string} [params.orderId] - 按订单编号模糊搜索
 * @param {string} [params.customerName] - 按客户名称模糊搜索
 * @param {string} [params.status] - 订单状态筛选
 * @returns {Promise} - 包含订单列表、总记录数和总页数的响应数据
 */
export const getOrders = async (params = {}) => {
  // 设置默认参数
  const defaultParams = {
    pageIndex: 0,
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


/**
 * 编辑销售订单
 * @param {string} id - 订单编号（必填）
 * @returns {Promise} - 包含订单详情和操作历史的响应数据
 */


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
 * 询价单列表
 * @param {string} id - 订单编号（必填）
 * @returns {Promise} - 包含订单详情和操作历史的响应数据
 */


/**
 * 更新询价单状态
 * @param {string} id - 订单编号（必填）
 * @returns {Promise} - 包含订单详情和操作历史的响应数据
 */

/**
 * 创建询价单
 * @param {string} id - 订单编号（必填）
 * @returns {Promise} - 包含订单详情和操作历史的响应数据
 */

//HYN

