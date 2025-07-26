import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// 权限映射表
const PERMISSION_MAP = {
  '系统管理员': {
    customer: true,
    sales: true,
    inventory: true,
    finance: true
  },
  '销售代表': {
    customer: true,
    sales: true,
    inventory: false,
    finance: false
  },
  '销售经理': {
    customer: true,
    sales: true,
    inventory: false,
    finance: false
  },
  '仓库管理员': {
    customer: false,
    sales: false,
    inventory: true,
    finance: false
  },
  '财务人员': {
    customer: false,
    sales: false,
    inventory: false,
    finance: true
  }
};

// 模块映射
const MODULE_MAP = {
  customer: ['客户管理', '客户列表', '新增客户', '客户详情'],
  sales: ['订单管理', '销售订单管理', '询价报价处理', '订单详情', '编辑订单'],
  inventory: ['库存管理', '发货单管理', '生成发货单'],
  finance: ['财务管理', '发票管理']
};

export const usePermission = () => {
  const [currentRole, setCurrentRole] = useState('系统管理员');
  const [permissions, setPermissions] = useState(PERMISSION_MAP['系统管理员']);
  const [originalRole, setOriginalRole] = useState(null);
  const [canSwitchRole, setCanSwitchRole] = useState(false);

  // 从本地存储恢复角色和权限
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const userRole = user.role;
      setOriginalRole(userRole);
      setCurrentRole(userRole);
      setPermissions(PERMISSION_MAP[userRole] || {});
      
      // 只有系统管理员可以切换角色
      setCanSwitchRole(userRole === '系统管理员');
    }

    // 恢复之前保存的角色（仅对系统管理员有效）
    const savedRole = localStorage.getItem('currentRole');
    if (savedRole && PERMISSION_MAP[savedRole]) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.role === '系统管理员') {
          setCurrentRole(savedRole);
          setPermissions(PERMISSION_MAP[savedRole]);
        }
      }
    }
  }, []);

  // 切换角色（仅系统管理员可用）
  const switchRole = (newRole) => {
    if (!canSwitchRole) {
      toast.error('您没有权限切换角色');
      return;
    }

    if (PERMISSION_MAP[newRole]) {
      setCurrentRole(newRole);
      setPermissions(PERMISSION_MAP[newRole]);
      localStorage.setItem('currentRole', newRole);
      
      // 模拟后端验证
      setTimeout(() => {
        toast.success(`角色切换成功：${newRole}`);
      }, 100);
    }
  };

  // 检查模块权限
  const hasModulePermission = (moduleName) => {
    const moduleKey = Object.keys(MODULE_MAP).find(key => 
      MODULE_MAP[key].includes(moduleName)
    );
    return moduleKey ? permissions[moduleKey] : false;
  };

  // 检查路由权限
  const hasRoutePermission = (path) => {
    // 首页所有角色都能访问
  if (path === "/" || path === "/home") return true;
    const routeMap = {
      '/customer': 'customer',
      '/order': 'sales',
      '/inventory': 'inventory',
      '/finance': 'finance'
    };
    
    const moduleKey = Object.keys(routeMap).find(key => path.startsWith(key));
    return moduleKey ? permissions[routeMap[moduleKey]] : true;
  };

  return {
    currentRole,
    originalRole,
    permissions,
    canSwitchRole,
    switchRole,
    hasModulePermission,
    hasRoutePermission,
    availableRoles: Object.keys(PERMISSION_MAP)
  };
};