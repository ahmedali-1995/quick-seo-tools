
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CodePreviewProps {
  code: string;
  language?: string;
  className?: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({
  code,
  language = 'html',
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopyClick = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      document.execCommand('copy');
      // Deselect the text
      window.getSelection()?.removeAllRanges();
    }
  };

  useEffect(() => {
    // Adjust height to fit content
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [code]);

  return (
    <div className={cn("relative rounded-lg overflow-hidden border", className)}>
      <div className="flex items-center justify-between bg-secondary p-2">
        <span className="text-xs font-medium text-muted-foreground">{language.toUpperCase()}</span>
        <button
          onClick={handleCopyClick}
          className="text-xs text-primary hover:text-primary/80 font-medium transition-colors px-2 py-1 rounded"
        >
          Copy
        </button>
      </div>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={code}
          readOnly
          className="w-full h-64 p-4 bg-secondary/50 font-mono text-sm resize-none overflow-auto focus:outline-none"
          style={{ tabSize: 2 }}
        />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-transparent to-background/5"></div>
      </div>
    </div>
  );
};

export default CodePreview;
