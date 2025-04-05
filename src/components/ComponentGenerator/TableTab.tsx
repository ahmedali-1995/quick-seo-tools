import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, MoveVertical, Table2, TableProperties, TableCellsMerge } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';

interface TableTabProps {
  bulkMode: boolean;
  setBulkMode: (value: boolean) => void;
  tableData: string[][];
  setTableData: (data: string[][]) => void;
  tableHeaders: string[];
  setTableHeaders: (headers: string[]) => void;
  hasHeader: boolean;
  setHasHeader: (value: boolean) => void;
  hasAlternatingRows: boolean;
  setHasAlternatingRows: (value: boolean) => void;
  isResponsive: boolean;
  setIsResponsive: (value: boolean) => void;
  tableCaption: string;
  setTableCaption: (caption: string) => void;
  tableStyle: 'basic' | 'striped' | 'bordered' | 'minimal';
  setTableStyle: (style: 'basic' | 'striped' | 'bordered' | 'minimal') => void;
  headerColor: string;
  setHeaderColor: (color: string) => void;
}

const TableTab: React.FC<TableTabProps> = ({
  bulkMode,
  setBulkMode,
  tableData,
  setTableData,
  tableHeaders,
  setTableHeaders,
  hasHeader,
  setHasHeader,
  hasAlternatingRows,
  setHasAlternatingRows,
  isResponsive,
  setIsResponsive,
  tableCaption,
  setTableCaption,
  tableStyle,
  setTableStyle,
  headerColor,
  setHeaderColor
}) => {
  const isMobile = useIsMobile();
  const [bulkTableData, setBulkTableData] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const handleAddColumn = () => {
    const newHeaders = [...tableHeaders, `Column ${tableHeaders.length + 1}`];
    setTableHeaders(newHeaders);
    
    const newData = tableData.map(row => [...row, '']);
    setTableData(newData);
  };
  
  const handleAddRow = () => {
    const newRow = new Array(tableHeaders.length).fill('');
    setTableData([...tableData, newRow]);
  };
  
  const handleDeleteRow = (index: number) => {
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
  };
  
  const handleDeleteColumn = (index: number) => {
    const newHeaders = [...tableHeaders];
    newHeaders.splice(index, 1);
    setTableHeaders(newHeaders);
    
    const newData = tableData.map(row => {
      const newRow = [...row];
      newRow.splice(index, 1);
      return newRow;
    });
    setTableData(newData);
  };
  
  const handleHeaderChange = (index: number, value: string) => {
    const newHeaders = [...tableHeaders];
    newHeaders[index] = value;
    setTableHeaders(newHeaders);
  };
  
  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
  };
  
  const handleBulkDataParsing = () => {
    const rows = bulkTableData.trim().split('\n');
    let parsedData: string[][] = [];
    let parsedHeaders: string[] = [];
    
    const separator = rows[0].includes('\t') ? '\t' : ',';
    
    rows.forEach((row, rowIndex) => {
      const cells = row.split(separator);
      
      if (rowIndex === 0 && hasHeader) {
        parsedHeaders = cells.map(cell => cell.trim());
      } else {
        parsedData.push(cells.map(cell => cell.trim()));
      }
    });
    
    if (!hasHeader) {
      parsedHeaders = Array(parsedData[0]?.length || 0)
        .fill(0)
        .map((_, i) => `Column ${i + 1}`);
    }
    
    setTableHeaders(parsedHeaders);
    setTableData(parsedData);
  };
  
  const handleMoveRow = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === tableData.length - 1)
    ) {
      return;
    }
    
    const newData = [...tableData];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newData[index], newData[targetIndex]] = [newData[targetIndex], newData[index]];
    
    setTableData(newData);
  };

  const colorOptions = [
    { name: 'Default', value: '' },
    { name: 'Purple', value: '#5a2c82' },
    { name: 'Blue', value: '#2c5282' },
    { name: 'Green', value: '#2c8257' },
    { name: 'Teal', value: '#2c8275' },
    { name: 'Red', value: '#822c2c' },
    { name: 'Orange', value: '#82572c' },
    { name: 'Gray', value: '#4a5568' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hasHeader" 
            checked={hasHeader} 
            onCheckedChange={(checked) => setHasHeader(!!checked)}
          />
          <Label htmlFor="hasHeader">Include Headers</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="hasAlternatingRows" 
            checked={hasAlternatingRows} 
            onCheckedChange={(checked) => setHasAlternatingRows(!!checked)}
          />
          <Label htmlFor="hasAlternatingRows">Alternating Row Colors</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isResponsive" 
            checked={isResponsive} 
            onCheckedChange={(checked) => setIsResponsive(!!checked)}
          />
          <Label htmlFor="isResponsive">Responsive Table</Label>
        </div>
      </div>
      
      <div>
        <Label htmlFor="tableCaption">Table Caption</Label>
        <Input 
          id="tableCaption"
          value={tableCaption}
          onChange={(e) => setTableCaption(e.target.value)}
          placeholder="Enter table caption (optional)"
          className="mt-1"
        />
      </div>

      <div className="space-y-3">
        <Label>Header Color</Label>
        <div className="grid grid-cols-4 gap-2 mt-1">
          {colorOptions.map((color) => (
            <div
              key={color.value}
              onClick={() => setHeaderColor(color.value)}
              className={`h-10 rounded-md cursor-pointer flex items-center justify-center text-sm transition-all ${
                headerColor === color.value ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'
              }`}
              style={{ 
                backgroundColor: color.value || '#f3f4f6',
                color: color.value ? '#ffffff' : 'inherit'
              }}
            >
              {color.name}
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={headerColor || '#5a2c82'}
              onChange={(e) => setHeaderColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <Input
              value={headerColor}
              onChange={(e) => setHeaderColor(e.target.value)}
              placeholder="#HEX"
              className="w-20"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <Label className="w-full font-medium text-lg">Table Style</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div 
            className={`border p-3 rounded-md cursor-pointer hover:bg-accent transition-colors flex items-center justify-center gap-2 ${tableStyle === 'basic' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setTableStyle('basic')}
          >
            <Table2 size={18} />
            <span>Basic</span>
          </div>
          <div 
            className={`border p-3 rounded-md cursor-pointer hover:bg-accent transition-colors flex items-center justify-center gap-2 ${tableStyle === 'striped' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setTableStyle('striped')}
          >
            <TableProperties size={18} />
            <span>Striped</span>
          </div>
          <div 
            className={`border p-3 rounded-md cursor-pointer hover:bg-accent transition-colors flex items-center justify-center gap-2 ${tableStyle === 'bordered' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setTableStyle('bordered')}
          >
            <TableCellsMerge size={18} />
            <span>Bordered</span>
          </div>
          <div 
            className={`border p-3 rounded-md cursor-pointer hover:bg-accent transition-colors flex items-center justify-center gap-2 ${tableStyle === 'minimal' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setTableStyle('minimal')}
          >
            <Table2 size={18} />
            <span>Minimal</span>
          </div>
        </div>
      </div>
      
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center text-sm text-muted-foreground hover:text-foreground gap-1 mb-4">
            {isAdvancedOpen ? '− Hide' : '+ Show'} advanced options
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-4 p-4 border rounded-md bg-secondary/30">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bulkMode" 
                checked={bulkMode} 
                onCheckedChange={(checked) => setBulkMode(!!checked)}
              />
              <Label htmlFor="bulkMode">Bulk Mode (Paste CSV/TSV)</Label>
            </div>
            
            {bulkMode ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bulkTableData">Paste CSV or TSV data</Label>
                  <textarea
                    id="bulkTableData"
                    value={bulkTableData}
                    onChange={(e) => setBulkTableData(e.target.value)}
                    placeholder="Paste your CSV or TSV data here"
                    rows={10}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
                <Button onClick={handleBulkDataParsing}>
                  Parse Data
                </Button>
              </div>
            ) : null}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {!bulkMode && (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="w-10 p-2"></th>
                  {tableHeaders.map((header, index) => (
                    <th key={index} className="p-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={header}
                          onChange={(e) => handleHeaderChange(index, e.target.value)}
                          placeholder={`Column ${index + 1}`}
                          size={20}
                          className="min-w-[120px]"
                        />
                        <button
                          className="p-1 hover:bg-destructive/10 rounded"
                          onClick={() => handleDeleteColumn(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </th>
                  ))}
                  <th className="w-10 p-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleAddColumn}
                      className="w-full"
                    >
                      <Plus size={16} />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-muted/30' : ''}>
                    <td className="p-2">
                      <div className="flex flex-col gap-1">
                        <button
                          className={`p-1 hover:bg-accent rounded ${rowIndex === 0 ? 'opacity-50' : ''}`}
                          onClick={() => handleMoveRow(rowIndex, 'up')}
                          disabled={rowIndex === 0}
                        >
                          <MoveVertical size={16} />
                        </button>
                        <button
                          className="p-1 hover:bg-destructive/10 rounded"
                          onClick={() => handleDeleteRow(rowIndex)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-2">
                        <Input
                          value={cell}
                          onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                          className="min-w-[120px]"
                        />
                      </td>
                    ))}
                    <td></td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={tableHeaders.length + 2} className="p-2">
                    <Button 
                      variant="outline" 
                      onClick={handleAddRow}
                      className="w-full"
                    >
                      <Plus size={16} className="mr-1" /> Add Row
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="mt-4 bg-muted/30 p-4 rounded-lg border">
        <h3 className="text-sm font-medium mb-2">Table Preview</h3>
        <div className="overflow-x-auto">
          <table 
            className={`w-full border-collapse ${
              tableStyle === 'bordered' ? 'border border-gray-300' : 
              tableStyle === 'minimal' ? '' : 
              'border-t border-gray-200'
            }`}
          >
            {tableCaption && <caption className="text-sm text-muted-foreground p-2">{tableCaption}</caption>}
            {hasHeader && (
              <thead>
                <tr className={
                  tableStyle === 'bordered' ? 'border-b border-gray-300' : 
                  tableStyle === 'minimal' ? 'border-b-2 border-gray-400' : 
                  'border-b border-gray-200'
                } style={{ backgroundColor: headerColor || (tableStyle === 'minimal' ? 'transparent' : '#f3f4f6') }}>
                  {tableHeaders.map((header, index) => (
                    <th 
                      key={index} 
                      className={
                        tableStyle === 'bordered' ? 'p-3 border border-gray-300 text-left font-medium' : 
                        tableStyle === 'minimal' ? 'p-3 text-left font-medium' : 
                        'p-3 text-left font-medium'
                      }
                      style={{ color: headerColor ? '#ffffff' : 'inherit' }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={
                    hasAlternatingRows && rowIndex % 2 === 1 
                      ? tableStyle === 'bordered' 
                        ? 'bg-muted/30 border-b border-gray-300' 
                        : tableStyle === 'minimal' 
                          ? 'bg-muted/20' 
                          : 'bg-muted/30'
                      : tableStyle === 'bordered' 
                        ? 'border-b border-gray-300' 
                        : tableStyle === 'minimal' 
                          ? 'border-b border-gray-100' 
                          : 'border-b border-gray-200'
                  }
                >
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className={
                        tableStyle === 'bordered' ? 'p-3 border border-gray-300' : 
                        tableStyle === 'minimal' ? 'p-3' : 
                        'p-3'
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableTab;
