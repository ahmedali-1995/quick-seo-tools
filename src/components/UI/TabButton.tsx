
import React from 'react';
import { cn } from '@/lib/utils';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => {
  return (
    <button
      className={cn(
        "py-3 px-5 font-medium relative transition-all duration-200",
        "hover:text-primary focus:outline-none",
        active ? "text-primary" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      {children}
      <span
        className={cn(
          "absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300",
          active ? "scale-x-100" : "scale-x-0"
        )}
      />
    </button>
  );
};

export default TabButton;
