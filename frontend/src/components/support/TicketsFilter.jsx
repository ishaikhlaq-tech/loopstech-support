import { Search, Calendar, ListFilter, ChevronUp } from 'lucide-react';
import CustomDropdown from '@components/common/CustomDropdown';

const InputWrapper = ({ children, className = '' }) => (
  <div className={`relative flex items-center h-9 bg-white border border-[#E2E8F0] rounded-[6px] focus-within:border-[#0F766E] focus-within:ring-1 focus-within:ring-[#0F766E] transition-all overflow-hidden ${className}`}>
    {children}
  </div>
);

const CLIENTS = [
  { value: 'all', label: 'All Clients / Companies' },
  { value: 'dummer', label: 'Dummer Flour Mills' },
  { value: 'lyallpur', label: 'Lyallpur Pizza' },
  { value: 'zummar', label: 'Zummar Textile' },
];

const DEPARTMENTS = [
  { value: 'all', label: 'All Departments' },
  { value: 'finance', label: 'Finance & Billing' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'it', label: 'IT Support' },
  { value: 'production', label: 'Production' },
  { value: 'purchase', label: 'Purchase & Inventory' },
  { value: 'qa', label: 'QA & Production' },
  { value: 'sales', label: 'Sales & Distribution' },
];

const PRIORITIES = [
  { value: 'all', label: 'All Priorities' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'access', label: 'Access & Permissions' },
  { value: 'benefits', label: 'Benefits & Health' },
  { value: 'expense', label: 'Expense Reimbursements' },
  { value: 'hardware', label: 'Hardware Issue' },
  { value: 'invoicing', label: 'Invoicing Help' },
  { value: 'network', label: 'Network & VPN' },
  { value: 'onboarding', label: 'Onboarding Info' },
  { value: 'payroll', label: 'Payroll & Taxes' },
  { value: 'software', label: 'Software Bug' },
];

const STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending', label: 'Pending User' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const TicketsFilter = ({ filters, setFilters }) => {
  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters(prev => ({
      ...prev,
      search: '',
      status: 'all',
      priority: 'all',
      client: 'all',
      department: 'all',
      category: 'all',
    }));
  };

  return (
    <div className="bg-white rounded-[6px] border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] mb-5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-1.5">
          <ListFilter className="w-3.5 h-3.5 text-[#64748B]" strokeWidth={2} />
          <h3 className="text-[12px] font-bold text-[#0F172A] leading-none">Filters</h3>
        </div>
        <button className="flex items-center gap-1 text-[10px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors">
          Hide Filters
          <ChevronUp className="w-3 h-3" strokeWidth={2} />
        </button>
      </div>

      {/* Filter Rows */}
      <div className="p-4 flex flex-col gap-3">
        {/* Row 1 */}
        <div className="flex gap-3">
          <InputWrapper className="flex-[1.5]">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 pointer-events-none" strokeWidth={2} />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              value={filters?.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full h-full bg-transparent pl-8 pr-3 text-[12px] text-[#0F172A] placeholder-[#94A3B8] outline-none"
            />
          </InputWrapper>
          
          <CustomDropdown 
            options={STATUSES} 
            value={filters?.status || 'all'} 
            onChange={(val) => handleChange('status', val)} 
            placeholder="All Statuses" 
            className="flex-1"
          />

          <CustomDropdown 
            options={CLIENTS} 
            value={filters?.client || 'all'} 
            onChange={(val) => handleChange('client', val)} 
            placeholder="All Clients / Companies" 
            className="flex-1"
          />

          <CustomDropdown 
            options={DEPARTMENTS} 
            value={filters?.department || 'all'} 
            onChange={(val) => handleChange('department', val)} 
            placeholder="All Departments" 
            className="flex-1"
          />
        </div>

        {/* Row 2 */}
        <div className="flex gap-3">
          <CustomDropdown 
            options={PRIORITIES} 
            value={filters?.priority || 'all'} 
            onChange={(val) => handleChange('priority', val)} 
            placeholder="All Priorities" 
            className="flex-1"
          />

          <CustomDropdown 
            options={CATEGORIES} 
            value={filters?.category || 'all'} 
            onChange={(val) => handleChange('category', val)} 
            placeholder="All Categories" 
            className="flex-1"
          />

          <InputWrapper className="flex-[1.5] cursor-pointer">
            <input 
              type="text" 
              placeholder="Select Date Range" 
              readOnly
              className="w-full h-full bg-transparent pl-3 pr-8 text-[12px] text-[#475569] placeholder-[#475569] outline-none cursor-pointer"
            />
            <Calendar className="w-3.5 h-3.5 text-[#94A3B8] absolute right-3 pointer-events-none" strokeWidth={2} />
          </InputWrapper>

          <div className="flex-1 flex justify-end gap-3 ml-2">
            <button onClick={resetFilters} className="px-3 h-9 text-[12px] font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 rounded-[6px] transition-colors">
              Reset Filters
            </button>
            <button onClick={resetFilters} className="px-5 h-9 text-[12px] font-semibold text-[#109F8D] bg-[#EAF5F3] border border-[#A7D9D3] hover:bg-[#D4EBE7] rounded-[6px] transition-colors">
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsFilter;
