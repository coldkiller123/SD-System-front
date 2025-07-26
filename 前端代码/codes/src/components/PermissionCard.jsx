import { Lock, Users, ShoppingCart, Package, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const MODULES = [
  {
    id: 'customer',
    title: '客户管理',
    description: '管理客户信息、联系记录和信用评估',
    icon: Users,
    color: 'blue'
  },
  {
    id: 'sales',
    title: '销售管理',
    description: '处理销售订单、报价和合同管理',
    icon: ShoppingCart,
    color: 'green'
  },
  {
    id: 'inventory',
    title: '库存管理',
    description: '管理库存、发货单和物流跟踪',
    icon: Package,
    color: 'purple'
  },
  {
    id: 'finance',
    title: '发票管理',
    description: '处理发票开具、收款和财务对账',
    icon: FileText,
    color: 'orange'
  }
];

export const PermissionCard = ({ module, hasPermission, onClick }) => {
  const Icon = module.icon;
  
  return (
    <Card 
      className={cn(
        "relative transition-all duration-200",
        hasPermission 
          ? "hover:shadow-lg cursor-pointer border-gray-200" 
          : "opacity-50 cursor-not-allowed"
      )}
      onClick={hasPermission ? onClick : undefined}
    >
      {!hasPermission && (
        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 rounded-lg flex items-center justify-center z-10">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <Lock className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{module.title}</CardTitle>
          <div className={`p-2 rounded-lg bg-${module.color}-100`}>
            <Icon className={`h-5 w-5 text-${module.color}-600`} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{module.description}</p>
        <Badge 
          variant={hasPermission ? "default" : "secondary"}
          className={cn(
            hasPermission ? `bg-${module.color}-100 text-${module.color}-800` : "bg-gray-100 text-gray-600"
          )}
        >
          {hasPermission ? '可访问' : '无权限'}
        </Badge>
      </CardContent>
    </Card>
  );
};