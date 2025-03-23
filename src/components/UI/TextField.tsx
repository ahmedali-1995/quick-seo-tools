
import React from 'react';
import { cn } from '@/lib/utils';

interface TextFieldProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 4,
  className,
}) => {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium mb-1 text-foreground">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="input-field min-h-[80px]"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field"
        />
      )}
    </div>
  );
};

export default TextField;
