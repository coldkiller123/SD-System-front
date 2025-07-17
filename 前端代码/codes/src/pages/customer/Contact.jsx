import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ContactManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>联系人管理</span>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> 添加联系人
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">联系人管理功能开发中</h3>
          <p className="text-gray-600">我们正在努力开发此功能，敬请期待</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactManagement;
