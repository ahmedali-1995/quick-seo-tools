
import React from 'react';
import TextField from '../UI/TextField';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { 
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "../ui/accordion";

interface FaqTabProps {
  bulkMode: boolean;
  setBulkMode: (value: boolean) => void;
  faqs: Array<{ question: string; answer: string }>;
  setFaqs: (faqs: Array<{ question: string; answer: string }>) => void;
  bulkFaqData: string;
  setBulkFaqData: (value: string) => void;
}

const FaqTab: React.FC<FaqTabProps> = ({
  bulkMode,
  setBulkMode,
  faqs,
  setFaqs,
  bulkFaqData,
  setBulkFaqData,
}) => {
  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
  };

  const handleRemoveFaq = (index: number) => {
    const newFaqs = [...faqs];
    newFaqs.splice(index, 1);
    setFaqs(newFaqs);
  };

  // Preview of FAQs with accordion opened by default
  const renderFaqPreview = () => {
    const faqItems = bulkMode 
      ? bulkFaqData.trim().split('\n\n').map(pair => {
          const lines = pair.trim().split('\n');
          if (lines.length >= 2) {
            return {
              question: lines[0].replace(/^Q:\s*/i, '').trim(),
              answer: lines[1].replace(/^A:\s*/i, '').trim()
            };
          }
          return null;
        }).filter(Boolean)
      : faqs;
      
    return (
      <div className="mt-6 border rounded-lg p-4 bg-accent/30">
        <h3 className="text-lg font-medium text-primary mb-4">FAQ Preview</h3>
        <Accordion type="multiple" defaultValue={faqItems.map((_, i) => `item-${i}`)}>
          {faqItems.map((faq, i) => (
            <AccordionItem key={`preview-${i}`} value={`item-${i}`} className="border border-primary/20 rounded-md mb-3 overflow-hidden">
              <AccordionTrigger className="px-4 py-3 bg-primary/5 hover:bg-primary/10 font-medium text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3 bg-white">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4 flex items-center space-x-2">
        <Checkbox 
          id="bulk-mode-faq" 
          checked={bulkMode} 
          onCheckedChange={() => setBulkMode(!bulkMode)} 
        />
        <Label htmlFor="bulk-mode-faq">Use Bulk Mode</Label>
        <p className="mt-2 text-sm text-muted-foreground ml-7">
          {bulkMode
            ? "Enter multiple Q&A pairs in bulk format"
            : "Create FAQ items with detailed customization"}
        </p>
      </div>

      {bulkMode ? (
        <div className="p-6 rounded-lg glass-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-primary">Bulk FAQ Entries</h3>
            <div className="text-sm text-muted-foreground">
              Format: "Q: Question" on first line, "A: Answer" on second line
            </div>
          </div>
          <TextField
            multiline
            rows={10}
            value={bulkFaqData}
            onChange={(e) => setBulkFaqData(e.target.value)}
            placeholder={`Q: How do I install this product?
A: Installation is simple. Just unpack the box and follow instructions.

Q: What is the warranty period?
A: All our products come with a standard 2-year warranty.`}
          />
          
          {bulkFaqData.trim() && renderFaqPreview()}
        </div>
      ) : (
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={`faq-${index}`} className="p-6 rounded-lg glass-panel">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-primary">FAQ Item {index + 1}</h3>
                <button
                  onClick={() => handleRemoveFaq(index)}
                  className="btn-destructive py-1 px-2"
                  aria-label="Remove FAQ"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <TextField
                  label="Question"
                  value={faq.question}
                  onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                />
                <TextField
                  label="Answer"
                  value={faq.answer}
                  onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                  multiline
                  rows={3}
                />
              </div>
            </div>
          ))}
          <button onClick={handleAddFaq} className="btn-primary w-full">
            Add FAQ Item
          </button>
          
          {faqs.length > 0 && renderFaqPreview()}
        </div>
      )}
    </div>
  );
};

export default FaqTab;
