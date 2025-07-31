import { useState, useMemo, useEffect, useRef } from 'react'; 
import { useQuery } from '@tanstack/react-query'; 
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductDetailDialog from './ProductDetailDialog';

// // 模拟API获取商品数据
// const fetchProducts = async (searchTerm = '') => {
//   await new Promise(resolve => setTimeout(resolve, 500));
  
//   const allProducts = [
//     { id: 'P1001', name: '智能手机', price: 2999, stock: 150, description: '最新款智能手机，配备高性能处理器和高清摄像头' },
//     { id: 'P1002', name: '笔记本电脑', price: 5999, stock: 80,  description: '轻薄便携笔记本，适合商务办公和娱乐使用' },
//     { id: 'P1003', name: '平板电脑', price: 1999, stock: 120,  description: '高清大屏平板，支持触控笔操作' },
//     { id: 'P1004', name: '智能手表', price: 1299, stock: 200,  description: '健康监测智能手表，支持心率检测和运动追踪' },
//     { id: 'P1005', name: '无线耳机', price: 599, stock: 300,  description: '真无线蓝牙耳机，降噪功能，音质出色' },
//     { id: 'P1006', name: '蓝牙音箱', price: 399, stock: 180, description: '便携式蓝牙音箱，防水设计，续航持久' },
//     { id: 'P1007', name: '数码相机', price: 3999, stock: 60,  description: '专业数码相机，支持4K视频录制' },
//     { id: 'P1008', name: '游戏主机', price: 2499, stock: 90,  description: '次世代游戏主机，支持8K输出和光线追踪' },
//   ];

//   if (!searchTerm) return allProducts;
  
//   return allProducts.filter(product => 
//     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.id.toLowerCase().includes(searchTerm.toLowerCase())
//   );
// };

// export const ProductSelector = ({ value, onValueChange, placeholder = "搜索并选择商品..." }) => {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState('');
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const loadProducts = async (searchTerm) => {
//     setLoading(true);
//     try {
//       const data = await fetchProducts(searchTerm);
//       setProducts(data);
//     } catch (error) {
//       console.error('获取商品数据失败:', error);
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useMemo(() => {
//     loadProducts(search);
//   }, [search]);

//   const getDisplayText = () => {
//     if (!value) return '';
//     const product = products.find(p => p.id === value);
//     return product ? `${product.name} - ¥${product.price}` : '';
//   };

//   const handleSelect = (productId) => {
//     onValueChange(productId);
//     setOpen(false);
//   };

//   const showProductDetail = (product) => {
//     setSelectedProduct(product);
//     setDialogOpen(true);
//     setOpen(false);
//   };

import { getProducts } from '@/apis/main'; // 导入接口

export const ProductSelector = ({ value, onValueChange, placeholder = "搜索并选择商品..." }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const isMounted = useRef(true);

  // 组件卸载时标记
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 从API获取商品数据（带搜索功能）
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', search], // 搜索词变化时重新请求
    queryFn: () => getProducts(search),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  // 获取选中商品的显示文本
  const getDisplayText = () => {
    if (!value) return '';
    const product = products.find(p => p.id === value);
    return product ? `${product.name} - ¥${product.price}` : '';
  };

  const handleSelect = (product) => {
    onValueChange(product); 
    setOpen(false);
  };

  const showProductDetail = (product) => {
    if (isMounted.current) {
      setSelectedProduct(product);
      setDialogOpen(true);
      setOpen(false);
    }
  };

  const handleSelectFromDialog = () => {
    if (selectedProduct && isMounted.current) {
      onValueChange(selectedProduct);
      setDialogOpen(false);
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {getDisplayText() || placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="搜索商品名称或ID..." 
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              {isLoading ? (
                <div className="py-6 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
                  <p className="text-sm text-gray-500 mt-2">加载中...</p>
                </div>
              ) : (
                <>
                  <CommandEmpty>未找到匹配的商品</CommandEmpty>
                  <CommandGroup>
                    {products.map((product) => (
                      <CommandItem
                        key={product.id}
                        onSelect={() => handleSelect(product)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <span className="ml-2 text-gray-500">{product.id}</span>
                          <span className="font-medium">- {product.name}</span>
                          <span className="ml-2 text-gray-500">- ¥{product.price}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              showProductDetail(product);
                            }}
                          >
                            详情
                          </Button>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              value === product.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <ProductDetailDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        product={selectedProduct} 
        onSelectProduct={handleSelectFromDialog}
      />
    </>
  );
};
