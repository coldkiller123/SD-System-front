import { useState } from 'react';
import { ChevronDown, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { usePermission } from '@/hooks/usePermission';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const RoleSelector = () => {
  const { currentRole, originalRole, canSwitchRole, switchRole, availableRoles } = usePermission();
  const [open, setOpen] = useState(false);

  // 如果不是系统管理员，不显示角色选择器
  if (!canSwitchRole) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="hidden md:inline-flex">
                角色：{currentRole}
              </Badge>
              <Button variant="ghost" className="flex items-center space-x-2 cursor-not-allowed opacity-60" disabled>
                <Lock className="h-4 w-4" />
                <span className="hidden md:inline">切换角色</span>
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>仅系统管理员可切换角色</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge variant="secondary" className="hidden md:inline-flex">
        当前角色：{currentRole}
      </Badge>
      
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">切换角色</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {availableRoles.map((role) => (
            <DropdownMenuItem
              key={role}
              onClick={() => switchRole(role)}
              className={`cursor-pointer ${currentRole === role ? 'bg-blue-100 text-blue-800' : ''}`}
            >
              {role}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};