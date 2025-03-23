
import React from 'react';
import TextField from '../UI/TextField';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface ProsConsTabProps {
  bulkMode: boolean;
  setBulkMode: (value: boolean) => void;
  prosConsTitle: string;
  setProsConsTitle: (value: string) => void;
  prosOnly: string[];
  setProsOnly: (pros: string[]) => void;
  consOnly: string[];
  setConsOnly: (cons: string[]) => void;
  bulkProsConsData: string;
  setBulkProsConsData: (value: string) => void;
}

const ProsConsTab: React.FC<ProsConsTabProps> = ({
  bulkMode,
  setBulkMode,
  prosConsTitle,
  setProsConsTitle,
  prosOnly,
  setProsOnly,
  consOnly,
  setConsOnly,
  bulkProsConsData,
  setBulkProsConsData,
}) => {
  const handleAddProOnly = () => {
    setProsOnly([...prosOnly, '']);
  };

  const handleUpdateProOnly = (index: number, value: string) => {
    const newProsOnly = [...prosOnly];
    newProsOnly[index] = value;
    setProsOnly(newProsOnly);
  };

  const handleRemoveProOnly = (index: number) => {
    const newProsOnly = [...prosOnly];
    newProsOnly.splice(index, 1);
    setProsOnly(newProsOnly);
  };

  const handleAddConOnly = () => {
    setConsOnly([...consOnly, '']);
  };

  const handleUpdateConOnly = (index: number, value: string) => {
    const newConsOnly = [...consOnly];
    newConsOnly[index] = value;
    setConsOnly(newConsOnly);
  };

  const handleRemoveConOnly = (index: number) => {
    const newConsOnly = [...consOnly];
    newConsOnly.splice(index, 1);
    setConsOnly(newConsOnly);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4 flex items-center space-x-2">
        <Checkbox 
          id="bulk-mode-proscons" 
          checked={bulkMode} 
          onCheckedChange={() => setBulkMode(!bulkMode)} 
        />
        <Label htmlFor="bulk-mode-proscons">Use Bulk Mode</Label>
        <p className="mt-2 text-sm text-muted-foreground ml-7">
          {bulkMode
            ? "Enter multiple products with pros and cons in bulk format"
            : "Create a single pros and cons list with detailed customization"}
        </p>
      </div>

      {bulkMode ? (
        <div className="p-6 rounded-lg glass-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-primary">Bulk Pros & Cons</h3>
            <div className="text-sm text-muted-foreground">
              Format: Product name, then "pros:" and "cons:" with comma-separated items
            </div>
          </div>
          <TextField
            multiline
            rows={10}
            value={bulkProsConsData}
            onChange={(e) => setBulkProsConsData(e.target.value)}
            placeholder={`Product A
pros: Easy to use, Affordable, Long battery life
cons: Heavier than competitors, Limited color options

Product B
pros: Lightweight design, Premium build quality, Fast charging
cons: Expensive, Short warranty period`}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-lg glass-panel">
            <h3 className="text-lg font-medium text-primary mb-4">Title</h3>
            <TextField
              value={prosConsTitle}
              onChange={(e) => setProsConsTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg glass-panel">
              <h3 className="text-lg font-medium text-primary mb-4">Pros</h3>
              <div className="space-y-3">
                {prosOnly.map((pro, index) => (
                  <div key={`pro-only-${index}`} className="flex items-center gap-2">
                    <TextField
                      value={pro}
                      onChange={(e) => handleUpdateProOnly(index, e.target.value)}
                      className="flex-grow"
                    />
                    <button
                      onClick={() => handleRemoveProOnly(index)}
                      className="btn-destructive py-1 px-2"
                      aria-label="Remove pro"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18"></path>
                        <path d="M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
                <button onClick={handleAddProOnly} className="btn-primary w-full mt-2">
                  Add Pro
                </button>
              </div>
            </div>

            <div className="p-6 rounded-lg glass-panel">
              <h3 className="text-lg font-medium text-primary mb-4">Cons</h3>
              <div className="space-y-3">
                {consOnly.map((con, index) => (
                  <div key={`con-only-${index}`} className="flex items-center gap-2">
                    <TextField
                      value={con}
                      onChange={(e) => handleUpdateConOnly(index, e.target.value)}
                      className="flex-grow"
                    />
                    <button
                      onClick={() => handleRemoveConOnly(index)}
                      className="btn-destructive py-1 px-2"
                      aria-label="Remove con"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6L6 18"></path>
                        <path d="M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
                <button onClick={handleAddConOnly} className="btn-primary w-full mt-2">
                  Add Con
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProsConsTab;
