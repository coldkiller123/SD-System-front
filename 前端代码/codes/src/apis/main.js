import request from './request'; // 通常会创建一个axios实例并导出

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


