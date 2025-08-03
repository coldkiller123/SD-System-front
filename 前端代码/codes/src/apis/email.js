import request from './request';

/**
 * 发送邮箱验证码
 * @param {Object} params - 请求参数
 * @param {string} params.email - 邮箱地址
 * @param {string} params.username - 用户名
 * @param {string} params.type - 验证码类型，固定值：'forgot_password'
 * @returns {Promise} - 包含发送结果的Promise
 */
export const sendEmailCode = async (params) => {
  const response = await request({
    url: '/email/send-code',
    method: 'POST',
    data: params
  });
  return response;
};

/**
 * 验证邮箱验证码
 * @param {Object} params - 请求参数
 * @param {string} params.email - 邮箱地址
 * @param {string} params.username - 用户名
 * @param {string} params.code - 6位数字验证码
 * @param {string} params.requestId - 发送验证码时返回的请求ID
 * @returns {Promise} - 包含验证结果的Promise
 */
export const verifyEmailCode = async (params) => {
  const response = await request({
    url: '/email/verify-code',
    method: 'POST',
    data: params
  });
  return response;
};

/**
 * 重置密码（验证码验证后）
 * @param {Object} params - 请求参数
 * @param {string} params.token - 验证码验证成功后返回的令牌
 * @param {string} params.newPassword - 新密码（至少6位）
 * @param {string} params.confirmPassword - 确认新密码
 * @returns {Promise} - 包含重置结果的Promise
 */
export const resetPassword = async (params) => {
  const response = await request({
    url: '/user/reset-password',
    method: 'POST',
    data: params
  });
  return response;
};

/**
 * 检查用户是否存在
 * @param {string} username - 用户名
 * @returns {Promise} - 包含用户信息的Promise
 */
export const checkUserExists = async (username) => {
  const response = await request({
    url: '/user/check',
    method: 'GET',
    params: { username }
  });
  return response;
}; 