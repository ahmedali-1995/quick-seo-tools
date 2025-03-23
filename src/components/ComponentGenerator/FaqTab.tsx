
import React from 'react';
import TextField from '../UI/TextField';
import Checkbox from '../UI/Checkbox';

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <Checkbox
          label="Use Bulk Mode"
          checked={bulkMode}
          onChange={() => setBulkMode(!bulkMode)}
        />
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
        </div>
      )}
    </div>
  );
};

export default FaqTab;
