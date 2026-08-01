import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Ticket, BarChart2, MessageSquare, Users, Settings, LogOut, ChevronLeft } from 'lucide-react';
import Logo from '@components/common/Logo';
import UserProfileCard from '@components/dashboard/UserProfileCard';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Tickets', icon: Ticket, path: '/tickets' },
];

const managementItems = [
  { name: 'SLA Manager', icon: BarChart2, path: '/sla-manager' },
  { name: 'Canned Responses', icon: MessageSquare, path: '/responses' },
  { name: 'Team Directory', icon: Users, path: '/team' },
  { name: 'Company Settings', icon: Settings, path: '/company-settings' },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const isAdmin = (user?.app_role || user?.role) === 'admin';

  // Management items visible to all, but Company Settings only for admins
  const managementItems = [
    { name: 'SLA Manager', icon: BarChart2, path: '/sla-manager' },
    { name: 'Canned Responses', icon: MessageSquare, path: '/responses' },
    { name: 'Team Directory', icon: Users, path: '/team' },
    ...(isAdmin ? [{ name: 'Company Settings', icon: Settings, path: '/company-settings' }] : []),
  ];

  // Use function to handle isActive
  const getNavItemClass = ({ isActive }) => 
    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-[13px] mb-1 transition-colors group ${
      isActive 
        ? 'bg-[#EAF5F3] text-[#109F8D]' 
        : 'text-[#475569] hover:bg-[#EAF5F3] hover:text-[#109F8D]'
    }`;

  const getIconClass = (isActive) =>
    `w-[18px] h-[18px] shrink-0 transition-colors ${
      isActive ? 'text-[#109F8D]' : 'text-[#64748B] group-hover:text-[#109F8D]'
    }`;

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 64 : 224 }}
      className="bg-white border-r border-[#E2E8F0] flex flex-col hidden md:flex shrink-0 h-full"
    >
      {/* Header / Logo */}
      <div className="h-[72px] flex items-center px-4 border-b border-[#E2E8F0] shrink-0">
        <Logo isCollapsed={isCollapsed} />
      </div>
      
      {/* Scrollable Navigation - No Visible Scrollbar */}
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Main Nav */}
        <nav className="flex flex-col">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={getNavItemClass}
              title={isCollapsed ? item.name : undefined}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={getIconClass(isActive)} strokeWidth={2} />
                  {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Management Nav */}
        <div className="flex flex-col mt-4">
          {!isCollapsed && (
            <div className="px-3 mb-2">
              <span className="text-[10px] uppercase tracking-[0.08em] font-bold text-[#94A3B8]">
                Management
              </span>
            </div>
          )}
          {isCollapsed && <div className="h-4" />}
          
          <nav className="flex flex-col">
            {managementItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={getNavItemClass}
                title={isCollapsed ? item.name : undefined}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={getIconClass(isActive)} strokeWidth={2} />
                    {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-[#E2E8F0] shrink-0 flex flex-col gap-1.5">
        <UserProfileCard isCollapsed={isCollapsed} />
        
        <div className="flex flex-col gap-0.5 mt-1">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#475569] font-medium text-[13px] hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left bg-transparent group"
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0 text-[#64748B] group-hover:text-red-600" strokeWidth={2} />
            {!isCollapsed && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#475569] font-medium text-[13px] hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left bg-transparent group"
            title={isCollapsed ? "Expand Sidebar" : undefined}
          >
            <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
              <ChevronLeft className="w-[18px] h-[18px] shrink-0 text-[#64748B] group-hover:text-red-600" strokeWidth={2} />
            </motion.div>
            {!isCollapsed && <span className="whitespace-nowrap">Collapse</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
