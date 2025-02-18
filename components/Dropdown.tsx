// components/Dropdown.tsx
import { Fragment } from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface DropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ nume: string; display?: string }>;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}

export const Dropdown = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  className
}: DropdownProps) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full p-3 pr-10 border border-purple-200 rounded-lg 
            focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
            transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
            ${className}`}
        />
        <ChevronDownIcon 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
    </div>
  );
};