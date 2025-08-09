import { useState } from 'react';
import { Menu, Bell, User, Search, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RoleSelector } from './RoleSelector';
import UserSettings from './UserSettings';

export const TopBar = ({ toggleSidebar, user, onLogout, theme }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // 根据主题设置样式
  const bgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputBgClass = theme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const placeholderClass = theme === 'dark' ? 'placeholder-gray-400' : 'placeholder-gray-500';

  return (
    <header className={`${bgClass} ${borderClass} border-b`}>
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden mr-2"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="relative w-64">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <Input 
              type="search" 
              placeholder="搜索客户、订单..." 
              className={`pl-10 ${inputBgClass} ${placeholderClass} ${textClass}`}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          
          <RoleSelector />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="bg-blue-100 text-blue-800 rounded-full p-1">
                  <User className="h-5 w-5" />
                </div>
                <span className="hidden md:inline">
                  {user?.name || '用户'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                个人设置
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>个人设置</DialogTitle>
          </DialogHeader>
          <UserSettings user={user} onLogout={onLogout} />
        </DialogContent>
      </Dialog>
    </header>
  );
};