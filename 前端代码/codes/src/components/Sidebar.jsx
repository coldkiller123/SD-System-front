import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navItems } from '@/nav-items';
import { ChevronLeft, ChevronRight, ChevronDown, Users as UsersIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePermission } from '@/hooks/usePermission';
import { toast } from 'sonner';

const SidebarItem = ({ item, depth = 0, theme }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { hasModulePermission } = usePermission();
  
  const isActive = location.pathname === item.to;
  const hasPermission = hasModulePermission(item.title);
  
  // 根据主题设置样式
  const bgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const hoverClass = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-blue-100';
  const activeClass = theme === 'dark' ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-blue-600 text-white hover:bg-blue-700';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  
  if (item.children) {
    const hasChildrenPermission = item.children.some(child => hasModulePermission(child.title));
    
    return (
      <div className={cn("py-1", depth > 0 ? "pl-4" : "")}>
        <button
          className={cn(
            "flex items-center w-full p-2 text-left rounded-md transition-colors",
            hasChildrenPermission 
              ? `${hoverClass} ${textClass}` 
              : "text-gray-400 cursor-not-allowed",
            depth === 0 ? "font-medium" : ""
          )}
          onClick={() => {
            if (hasChildrenPermission) {
              setOpen(!open);
            } else {
              toast.error('无权限访问该模块');
            }
          }}
        >
          <span className="mr-2">{item.icon}</span>
          <span className="flex-1">{item.title}</span>
          {hasChildrenPermission && (
            open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </button>
        
        {open && hasChildrenPermission && (
          <div className={`mt-1 ml-2 border-l ${borderClass} pl-2`}>
            {item.children.map((child) => (
              <SidebarItem key={child.to} item={child} depth={depth + 1} theme={theme} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <NavLink
        to={item.to}
        className={cn(
          "flex items-center p-2 rounded-md transition-colors mb-1",
          hasPermission 
            ? `${hoverClass} ${textClass}` 
            : "text-gray-400 cursor-not-allowed",
          isActive && hasPermission 
            ? activeClass 
            : isActive && !hasPermission 
            ? (theme === 'dark' ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-400") 
            : ""
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={(e) => {
          if (!hasPermission) {
            e.preventDefault();
            toast.error('无权限访问该功能');
          }
        }}
      >
        <span className="mr-2">{item.icon}</span>
        <span>{item.title}</span>
      </NavLink>
      
      {!hasPermission && (
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} bg-opacity-50 rounded-md pointer-events-none`} />
      )}
    </div>
  );
};

export const Sidebar = ({ isOpen, toggleSidebar, theme }) => {
  // 根据主题设置样式
  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-blue-800';
  const borderClass = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const hoverClass = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
  const copyrightClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  
  return (
    <div 
      className={cn(
        `${bgClass} ${borderClass} transition-all duration-300 flex flex-col`,
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className={`p-4 ${borderClass} flex items-center justify-between`}>
        <div className={cn("flex items-center", isOpen ? "" : "justify-center w-full")}>
          {isOpen ? (
            <h1 className={`text-xl font-bold ${textClass}`}>SD销售分发系统</h1>
          ) : (
            <div className="bg-blue-600 text-white rounded-md p-2">
              <UsersIcon className="h-6 w-6" />
            </div>
          )}
        </div>
        
        <button 
          onClick={toggleSidebar}
          className={`p-1 rounded-full ${hoverClass}`}
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <SidebarItem key={item.title} item={item} theme={theme} />
        ))}
      </nav>
      
      <div className={`p-4 ${borderClass} text-center text-sm ${copyrightClass}`}>
        {isOpen ? "© 2025 SD销售分发系统" : "SD"}
      </div>
    </div>
  );
};