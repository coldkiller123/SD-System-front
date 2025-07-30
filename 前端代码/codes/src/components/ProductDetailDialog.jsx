import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const ProductDetailDialog = ({ open, onOpenChange, product, onSelectProduct }) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* 只保留顶部的关闭按钮 */}
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl font-bold">商品详情</DialogTitle>
        </DialogHeader>

        <div className="p-4 md:p-6 space-y-6">
          {/* 基本信息 */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-lg font-bold">{product.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">商品ID</span>
                  <span className="ml-2 font-medium">{product.id}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">库存</span>
                  <span className="ml-2 font-medium">{product.stock} 件</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 描述信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-2">商品描述</h3>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-md">
              {product.description || '暂无商品描述信息'}
            </p>
          </div>

{/* 操作按钮 */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              关闭
            </Button>
            <Button
  className="bg-blue-600 hover:bg-blue-700"
  onClick={() => {
    if (onSelectProduct) {
      onSelectProduct();  // 执行回调
    }
    onOpenChange(false);  // 关闭弹窗
  }}
>
  <ShoppingCart className="mr-2 h-4 w-4" /> 选择此商品
</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
