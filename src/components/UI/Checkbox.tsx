
import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, className }) => {
  return (
    <label className={cn("inline-flex items-center cursor-pointer", className)}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div
          className={cn(
            "w-5 h-5 border rounded-md mr-2 flex items-center justify-center transition-all duration-200",
            checked ? "bg-primary border-primary" : "bg-background border-input"
          )}
        >
          {checked && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3.5 w-3.5 text-white animate-fade-in" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
};

export default Checkbox;
