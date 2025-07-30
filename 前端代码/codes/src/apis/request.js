import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:8080', // 可以配置基础URL，如'/api'
  timeout: 5000 // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里添加请求头，如token
    // config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 假设后端返回格式统一为{ code, data, message }
    return response.data;
  },
  error => {
    // 处理错误
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

export default request;
    