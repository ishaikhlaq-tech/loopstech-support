import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ options, value, onChange, placeholder, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || null;

  return (
    <div 
      ref={dropdownRef} 
      className={`relative flex-1 h-10 bg-white border ${isOpen ? 'border-[#0F766E] ring-1 ring-[#0F766E]' : 'border-[#E2E8F0]'} rounded-[6px] transition-all cursor-pointer ${className}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between w-full h-full pl-3 pr-3">
        <span className={`text-[13px] ${selectedOption ? 'text-[#0F172A]' : 'text-[#475569]'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-[#94A3B8]" strokeWidth={2} />
      </div>

      {isOpen && (
        <div className="absolute z-50 top-[calc(100%+4px)] left-0 w-full bg-white border border-[#E2E8F0] shadow-lg rounded-[6px] py-1 max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-3 py-1.5 text-[13px] transition-colors ${
                value === opt.value
                  ? 'bg-[#2563EB] text-white font-medium'
                  : 'text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
