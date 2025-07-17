export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

// 手机号验证
export const validatePhone = (phone) => {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
};

// 邮箱验证
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// 生成唯一ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// 格式化日期
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('zh-CN', options);
};
