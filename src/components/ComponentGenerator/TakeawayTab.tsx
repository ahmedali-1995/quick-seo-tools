
import React, { useState } from 'react';
import TextField from '../UI/TextField';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BrainCircuit, Info, Lightbulb, AlertTriangle, BookOpen } from 'lucide-react';

interface TakeawayProps {
  bulkMode: boolean;
  setBulkMode: (value: boolean) => void;
  takeaways: Array<{ title: string; content: string; type: string; icon: string }>;
  setTakeaways: (takeaways: Array<{ title: string; content: string; type: string; icon: string }>) => void;
  bulkTakeawayData: string;
  setBulkTakeawayData: (value: string) => void;
}

const TakeawayTab: React.FC<TakeawayProps> = ({
  bulkMode,
  setBulkMode,
  takeaways,
  setTakeaways,
  bulkTakeawayData,
  setBulkTakeawayData,
}) => {
  const [selectedType, setSelectedType] = useState<string>("research");
  
  const takeawayTypes = [
    { value: "research", label: "Research Note", color: "#e0f2fe", borderColor: "#0ea5e9", icon: "BookOpen" },
    { value: "safety", label: "Safety Notice", color: "#fef3c7", borderColor: "#f59e0b", icon: "AlertTriangle" },
    { value: "tip", label: "Nutrition Tip", color: "#dcfce7", borderColor: "#22c55e", icon: "Lightbulb" },
    { value: "memory", label: "Memory Aid", color: "#e0f2fe", borderColor: "#3b82f6", icon: "BrainCircuit" },
    { value: "info", label: "Information", color: "#f3e8ff", borderColor: "#8b5cf6", icon: "Info" }
  ];

  const handleAddTakeaway = () => {
    const typeInfo = takeawayTypes.find(type => type.value === selectedType) || takeawayTypes[0];
    setTakeaways([...takeaways, { 
      title: typeInfo.label, 
      content: '', 
      type: typeInfo.value,
      icon: typeInfo.icon
    }]);
  };

  const handleUpdateTakeaway = (index: number, field: 'title' | 'content' | 'type', value: string) => {
    const newTakeaways = [...takeaways];
    newTakeaways[index] = { ...newTakeaways[index], [field]: value };
    
    // Update icon if type changes
    if (field === 'type') {
      const typeInfo = takeawayTypes.find(type => type.value === value);
      if (typeInfo) {
        newTakeaways[index].icon = typeInfo.icon;
      }
    }
    
    setTakeaways(newTakeaways);
  };

  const handleRemoveTakeaway = (index: number) => {
    const newTakeaways = [...takeaways];
    newTakeaways.splice(index, 1);
    setTakeaways(newTakeaways);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="text-primary h-5 w-5" />;
      case 'AlertTriangle': return <AlertTriangle className="text-amber-500 h-5 w-5" />;
      case 'Lightbulb': return <Lightbulb className="text-green-500 h-5 w-5" />;
      case 'BrainCircuit': return <BrainCircuit className="text-blue-500 h-5 w-5" />;
      case 'Info': return <Info className="text-purple-500 h-5 w-5" />;
      default: return <Info className="text-primary h-5 w-5" />;
    }
  };

  // Preview of takeaways
  const renderTakeawayPreview = () => {
    const takeawayItems = bulkMode 
      ? parseBulkTakeaways()
      : takeaways;
      
    return (
      <div className="mt-6 space-y-4">
        {takeawayItems.map((takeaway, i) => {
          const typeInfo = takeawayTypes.find(type => type.value === takeaway.type) || takeawayTypes[0];
          
          return (
            <div 
              key={`preview-${i}`} 
              className="border-l-4 rounded-md overflow-hidden shadow-sm"
              style={{ 
                backgroundColor: typeInfo.color, 
                borderLeftColor: typeInfo.borderColor 
              }}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 font-medium mb-2">
                  {getIconComponent(takeaway.icon)}
                  <h4 className="text-lg">{takeaway.title}</h4>
                </div>
                <div className="text-gray-700">
                  {takeaway.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const parseBulkTakeaways = () => {
    return bulkTakeawayData.trim().split('\n\n').map(block => {
      const lines = block.trim().split('\n');
      const titleLine = lines[0].trim();
      const contentLines = lines.slice(1).join('\n').trim();
      
      // Determine the type based on the title
      let type = "info";
      let icon = "Info";
      
      if (titleLine.toLowerCase().includes("research")) {
        type = "research";
        icon = "BookOpen";
      } else if (titleLine.toLowerCase().includes("safety")) {
        type = "safety";
        icon = "AlertTriangle";
      } else if (titleLine.toLowerCase().includes("tip")) {
        type = "tip";
        icon = "Lightbulb";
      } else if (titleLine.toLowerCase().includes("memory")) {
        type = "memory";
        icon = "BrainCircuit";
      }
      
      return {
        title: titleLine,
        content: contentLines,
        type,
        icon
      };
    }).filter(item => item.title && item.content);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4 flex items-center space-x-2">
        <Checkbox 
          id="bulk-mode-takeaway" 
          checked={bulkMode} 
          onCheckedChange={() => setBulkMode(!bulkMode)} 
        />
        <Label htmlFor="bulk-mode-takeaway">Use Bulk Mode</Label>
        <p className="mt-2 text-sm text-muted-foreground ml-7">
          {bulkMode
            ? "Enter multiple takeaways in bulk format"
            : "Create takeaway items with detailed customization"}
        </p>
      </div>

      {bulkMode ? (
        <div className="p-6 rounded-lg glass-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-primary">Bulk Takeaway Entries</h3>
            <div className="text-sm text-muted-foreground">
              Format: Title on first line, content on following lines
            </div>
          </div>
          <TextField
            multiline
            rows={10}
            value={bulkTakeawayData}
            onChange={(e) => setBulkTakeawayData(e.target.value)}
            placeholder={`Research Note
The Women's Health Study found that women over 45 who took 600 IU of Vitamin E every other day had a 24% reduction in cardiovascular death risk, though overall heart disease rates were unchanged.

Important Safety Notice
High-dose Vitamin E supplements (400 IU/day or more) should not be taken without medical supervision, especially if you take blood thinners, aspirin, or are scheduled for surgery.

Nutrition Tip
Since Vitamin E is fat-soluble, consuming it with some healthy fat improves absorption. Add olive oil to your spinach salad or eat nuts with your fruits to maximize nutrient uptake.`}
          />
          
          {bulkTakeawayData.trim() && renderTakeawayPreview()}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 border rounded-lg bg-accent/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Takeaway</h3>
              <div className="flex items-center gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {takeawayTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddTakeaway} variant="secondary">Add</Button>
              </div>
            </div>
          </div>

          {takeaways.map((takeaway, index) => (
            <div key={`takeaway-${index}`} className="p-6 rounded-lg glass-panel">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getIconComponent(takeaway.icon)}
                  <h3 className="text-lg font-medium text-primary">Takeaway {index + 1}</h3>
                </div>
                <button
                  onClick={() => handleRemoveTakeaway(index)}
                  className="btn-destructive py-1 px-2"
                  aria-label="Remove Takeaway"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <TextField
                  label="Title"
                  value={takeaway.title}
                  onChange={(e) => handleUpdateTakeaway(index, 'title', e.target.value)}
                />
                <Select 
                  value={takeaway.type} 
                  onValueChange={(value) => handleUpdateTakeaway(index, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {takeawayTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <TextField
                  label="Content"
                  value={takeaway.content}
                  onChange={(e) => handleUpdateTakeaway(index, 'content', e.target.value)}
                  multiline
                  rows={3}
                />
              </div>
            </div>
          ))}
          
          {takeaways.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No takeaways added yet. Use the form above to add your first takeaway.
            </div>
          ) : (
            renderTakeawayPreview()
          )}
        </div>
      )}
    </div>
  );
};

export default TakeawayTab;
