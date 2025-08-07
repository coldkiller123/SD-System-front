import request from './request';
import { toast } from 'sonner'; // 假设你用 sonner 做提示，可根据实际调整

// 统一处理请求错误
const handleError = (error) => {
  const errorMessage = error.response?.data?.message || '请求失败，请稍后重试';
  toast.error(errorMessage);
  return Promise.reject(error);
};

/**
 * 发送邮箱验证码
 * @param {Object} params - 请求参数
 * @param {string} params.email - 邮箱地址
 * @param {string} params.username - 用户名
 * @param {string} params.type - 验证码类型，固定值：'forgot_password'
 * @returns {Promise} - 包含发送结果的Promise
 */
export const sendEmailCode = async (params) => {
  try {
    const response = await request({
      url: 'api/auth/send-email-code',
      method: 'POST',
      data: params
    });
    // 可在这里统一做成功提示（如果需要）
    // toast.success('验证码发送成功'); 
    return response;
  } catch (error) {
    return handleError(error);
  }
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
  try {
    const response = await request({
      url: 'api/auth/verify-email-code',
      method: 'POST',
      data: params
    });
    return response;
  } catch (error) {
    return handleError(error);
  }
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
  // 额外参数校验，提前拦截错误
  if (params.newPassword !== params.confirmPassword) {
    toast.error('两次输入的密码不一致');
    return Promise.reject(new Error('两次输入的密码不一致'));
  }
  if (params.newPassword.length < 6) {
    toast.error('新密码长度不能少于6位');
    return Promise.reject(new Error('新密码长度不能少于6位'));
  }
  
  try {
    const response = await request({
      url: '/user/reset-password',
      method: 'POST',
      data: params
    });
    return response;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * 检查用户是否存在
 * @param {string} username - 用户名
 * @returns {Promise} - 包含用户信息的Promise
 */
export const checkUserExists = async (username) => {
  try {
    const response = await request({
      url: '/user/check',
      method: 'GET',
      params: { username }
    });
    return response;
  } catch (error) {
    return handleError(error);
  }
};