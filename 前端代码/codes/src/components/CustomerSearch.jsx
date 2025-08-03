import { useState, useMemo, useRef } from 'react'; 
import { useQuery } from '@tanstack/react-query'; 
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// // 模拟客户数据
// const mockCustomers = [
//   { id: 'C1001', name: '张立陈' },
//   { id: 'C1002', name: '韩易宁' },
//   { id: 'C1003', name: '炼乳会' },
//   { id: 'C1004', name: '孙艺将' },
//   { id: 'C1005', name: '缰绳喜' },
//   { id: 'C1006', name: '何心仪' },
// ];

// export const CustomerSearch = ({ value, onValueChange, placeholder = "搜索客户..." }) => {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState('');

//   // 根据搜索词过滤客户
//   const filteredCustomers = useMemo(() => {
//     if (!search) return mockCustomers;
//     return mockCustomers.filter(customer => 
//       customer.id.toLowerCase().includes(search.toLowerCase()) ||
//       customer.name.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [search]);

//   // 获取选中客户的显示文本
//   const getDisplayText = () => {
//     if (!value) return '';
//     const customer = mockCustomers.find(c => c.id === value);
//     return customer ? `${customer.id} ${customer.name}` : '';
//   };

// 导入封装的接口
import { getCustomers } from '@/apis/main';

export const CustomerSearch = ({ value, onValueChange, placeholder = "搜索客户..." }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // 从接口获取客户列表
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'], // 缓存键，确保数据只请求一次
    queryFn: getCustomers
  });

  // 根据搜索词过滤客户（支持ID和名称模糊搜索）
  const filteredCustomers = useMemo(() => {
    if (!search) return customers;
    const lowerSearch = search.toLowerCase();
    return customers.filter(customer => 
      customer.id.toLowerCase().includes(lowerSearch) ||
      customer.name.toLowerCase().includes(lowerSearch)
    );
  }, [search, customers]);

  // 获取选中客户的显示文本（ID + 名称）
  const getDisplayText = () => {
    if (!value) return '';
    const customer = customers.find(c => c.id === value);
    return customer ? `${customer.id} ${customer.name}` : '未知客户';
  };

  return (
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
            placeholder="搜索客户ID或名称..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>未找到匹配的客户</CommandEmpty>
            <CommandGroup>
              {filteredCustomers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{customer.id}</span>
                    <span className="truncate ml-2">{customer.name}</span>
                  </div>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === customer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};