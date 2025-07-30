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
