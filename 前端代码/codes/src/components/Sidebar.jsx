import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navItems } from '@/nav-items';
import { ChevronLeft, ChevronRight, ChevronDown, Users as UsersIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const SidebarItem = ({ item, depth = 0 }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === item.to;
  
  if (item.children) {
    return (
      <div className={cn("py-1", depth > 0 ? "pl-4" : "")}>
        <button
          className={cn(
            "flex items-center w-full p-2 text-left rounded-md transition-colors",
            "hover:bg-blue-100 text-gray-700",
            depth === 0 ? "font-medium" : ""
          )}
          onClick={() => setOpen(!open)}
        >
          <span className="mr-2">{item.icon}</span>
          <span className="flex-1">{item.title}</span>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        
        {open && (
          <div className="mt-1 ml-2 border-l border-gray-200 pl-2">
            {item.children.map((child) => (
              <SidebarItem key={child.to} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      className={cn(
        "flex items-center p-2 rounded-md transition-colors mb-1",
        "hover:bg-blue-100",
        isActive 
          ? "bg-blue-600 text-white hover:bg-blue-700" 
          : "text-gray-700"
      )}
      style={{ paddingLeft: `${depth * 16 + 12}px` }}
    >
      <span className="mr-2">{item.icon}</span>
      <span>{item.title}</span>
    </NavLink>
  );
};

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div 
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className={cn("flex items-center", isOpen ? "" : "justify-center w-full")}>
          {isOpen ? (
            <h1 className="text-xl font-bold text-blue-800">SD销售分发系统</h1>
          ) : (
            <div className="bg-blue-600 text-white rounded-md p-2">
              <UsersIcon className="h-6 w-6" />
            </div>
          )}
        </div>
        
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <SidebarItem key={item.title} item={item} />
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
        {isOpen ? "© 2023 SD销售分发系统" : "SD"}
      </div>
    </div>
  );
};
