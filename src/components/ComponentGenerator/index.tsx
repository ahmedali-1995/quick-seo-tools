import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, Download, Github, XCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import TableTab from './TableTab';
import { Separator } from '@/components/ui/separator';

interface ComponentGeneratorProps {
  onClose: () => void;
}

const ComponentGenerator: React.FC<ComponentGeneratorProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'form' | 'table'>('basic');
  const [componentName, setComponentName] = useState('MyComponent');
  const [htmlCode, setHtmlCode] = useState('');
  const [reactCode, setReactCode] = useState('');
  const [componentType, setComponentType] = useState<'client' | 'server'>('client');
  const [inlineStyles, setInlineStyles] = useState(false);

  // Basic Tab State
  const [basicContent, setBasicContent] = useState('Hello, world!');

  // Form Tab State
  const [formFields, setFormFields] = useState([{ label: 'Field 1', type: 'text' }]);

  // Table Tab State
  const [bulkMode, setBulkMode] = useState(false);
  const [tableData, setTableData] = useState([['', ''], ['', '']]);
  const [tableHeaders, setTableHeaders] = useState(['Column 1', 'Column 2']);
  const [hasHeader, setHasHeader] = useState(true);
  const [hasAlternatingRows, setHasAlternatingRows] = useState(false);
  const [isResponsive, setIsResponsive] = useState(false);
  const [tableCaption, setTableCaption] = useState('');
  const [tableStyle, setTableStyle] = useState<'basic' | 'striped' | 'bordered' | 'minimal'>('basic');
  const [headerColor, setHeaderColor] = useState('');
  const [borderRadius, setBorderRadius] = useState('');
  const { toast } = useToast()

  function getInlineStyles() {
    return inlineStyles ? 'style={{ backgroundColor: "lightblue", padding: "1rem" }}' : '';
  }

  function generateBasicHTML(content: string, inlineStyles: boolean): string {
    const styleAttribute = inlineStyles ? 'style="background-color: lightblue; padding: 1rem;"' : '';
    return `<div ${styleAttribute}>${content}</div>`;
  }

  function generateFormHTML(fields: { label: string; type: string }[], inlineStyles: boolean): string {
    const styleAttribute = inlineStyles ? 'style="display: flex; flexDirection: column; gap: 0.5rem;"' : '';
    return `
    <form ${styleAttribute}>
      ${fields.map(field => `
        <label htmlFor="${field.label.toLowerCase().replace(/\s/g, '_')}">${field.label}:</label>
        <input type="${field.type}" id="${field.label.toLowerCase().replace(/\s/g, '_')}" name="${field.label.toLowerCase().replace(/\s/g, '_')}" />
      `).join('\n')}
      <button type="submit">Submit</button>
    </form>
  `;
  }

  function generateTableHTML(tableData: string[][], tableHeaders: string[], hasHeader: boolean, hasAlternatingRows: boolean, isResponsive: boolean, tableCaption: string, tableStyle: string, headerColor: string, borderRadius: string): string {
    const tableClasses = [
      'w-full',
      tableStyle === 'striped' ? 'table-striped' : '',
      tableStyle === 'bordered' ? 'table-bordered' : '',
      isResponsive ? 'table-responsive' : '',
      tableStyle === 'minimal' ? 'table-minimal' : '',
    ].filter(Boolean).join(' ');

    const tableStyles = {
      borderCollapse: 'collapse',
      width: '100%',
      ...(borderRadius ? { borderRadius, overflow: 'hidden' } : {})
    };

    const thStyles = {
      padding: '0.75rem',
      borderBottom: tableStyle === 'bordered' ? '1px solid #e2e8f0' : '2px solid #cbd5e0',
      textAlign: 'left',
      fontWeight: 'medium',
      ...(headerColor ? { backgroundColor: headerColor, color: '#ffffff' } : {})
    };

    const tdStyles = {
      padding: '0.75rem',
      borderBottom: tableStyle === 'bordered' ? '1px solid #e2e8f0' : '1px solid #e2e8f0',
      ...(tableStyle === 'bordered' ? { borderRight: '1px solid #e2e8f0' } : {}),
    };

    const wrapperStyles = isResponsive ? { overflowX: 'auto', width: '100%' } : {};

    const captionStyles = {
      margin: '0.5rem 0',
      fontStyle: 'italic',
      textAlign: 'left' as const,
      color: '#4a5568',
    };

    const objectToInlineStyle = (obj: Record<string, any>) => {
      return Object.entries(obj)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');
    };

    const table = `
    <${isResponsive ? 'div style="' + objectToInlineStyle(wrapperStyles) + '"' : 'div'}>
      <table class="${tableClasses}" style="${objectToInlineStyle(tableStyles)}">
        ${tableCaption ? `<caption style="${objectToInlineStyle(captionStyles)}">${tableCaption}</caption>` : ''}
        ${hasHeader ? `
        <thead>
          <tr>
            ${tableHeaders.map((header, index) => {
              const isFirstHeader = index === 0;
              const isLastHeader = index === tableHeaders.length - 1;
              const specificThStyles = {
                ...thStyles,
                ...(borderRadius && isFirstHeader ? { borderTopLeftRadius: borderRadius } : {}),
                ...(borderRadius && isLastHeader ? { borderTopRightRadius: borderRadius } : {})
              };
              return `<th style="${objectToInlineStyle(specificThStyles)}">${header}</th>`;
            }).join('')}
          </tr>
        </thead>` : ''}
        <tbody>
          ${tableData.map((row, rowIndex) => {
            const isLastRow = rowIndex === tableData.length - 1;
            const rowStyle = hasAlternatingRows && rowIndex % 2 === 1 ? 'background-color: rgba(241, 245, 249, 0.4);' : '';
            return `<tr style="${rowStyle}">
              ${row.map((cell, cellIndex) => {
                const isFirstCell = cellIndex === 0;
                const isLastCell = cellIndex === row.length - 1;
                const specificTdStyles = {
                  ...tdStyles,
                  ...(borderRadius && isLastRow && isFirstCell && !hasHeader ? { borderBottomLeftRadius: borderRadius } : {}),
                  ...(borderRadius && isLastRow && isLastCell && !hasHeader ? { borderBottomRightRadius: borderRadius } : {})
                };
                return `<td style="${objectToInlineStyle(specificTdStyles)}">${cell}</td>`;
              }).join('')}
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </${isResponsive ? 'div' : 'div'}>`;

    return table;
  }

  function generateHTMLCode(): string {
    let generatedHTML = '';

    switch (activeTab) {
      case 'basic':
        generatedHTML = generateBasicHTML(basicContent, inlineStyles);
        break;
      case 'form':
        generatedHTML = generateFormHTML(formFields, inlineStyles);
        break;
      case 'table':
        generatedHTML = generateTableHTML(tableData, tableHeaders, hasHeader, hasAlternatingRows, isResponsive, tableCaption, tableStyle, headerColor, borderRadius);
        break;
      default:
        generatedHTML = '<div>Select a tab to generate HTML.</div>';
        break;
    }

    setHtmlCode(generatedHTML);
    return generatedHTML;
  }

  let componentImports: string[] = [];

  function generateReactCode(componentName: string): string {
    componentImports = [];

    switch (activeTab) {
      case 'basic': {
        return `
export function ${componentName}() {
  return (
    <div ${getInlineStyles()}>
      ${basicContent}
    </div>
  )
}
`;
      }

      case 'form': {
        return `
import React from "react"

export function ${componentName}() {
  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      ${formFields.map(field => `
        <label htmlFor="${field.label.toLowerCase().replace(/\s/g, '_')}">${field.label}:</label>
        <input type="${field.type}" id="${field.label.toLowerCase().replace(/\s/g, '_')}" name="${field.label.toLowerCase().replace(/\s/g, '_')}" />
      `).join('\n')}
      <button type="submit">Submit</button>
    </form>
  )
}
`;
      }

      case 'table': {
        componentImports.push("import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from \"@/components/ui/table\"");
        
        const tableProps = [
          ...(headerColor ? [`headerColor="${headerColor}"` ] : []),
          ...(borderRadius ? [`borderRadius="${borderRadius}"` ] : [])
        ].join(' ');
        
        return `
import React from "react"
${componentImports.join("\n")}

export function ${componentName}() {
  return (
    <div className="rounded-md border">
      <Table${tableProps ? ` ${tableProps}` : ''}>
        ${tableCaption ? `<TableCaption>${tableCaption}</TableCaption>` : ''}
        ${hasHeader ? `
        <TableHeader>
          <TableRow>
            ${tableHeaders.map(header => `<TableHead>${header}</TableHead>`).join('\n            ')}
          </TableRow>
        </TableHeader>` : ''}
        <TableBody>
          ${tableData.map((row, rowIndex) => `
          <TableRow${hasAlternatingRows && rowIndex % 2 === 1 ? ' className="bg-muted/50"' : ''}>
            ${row.map(cell => `<TableCell>${cell}</TableCell>`).join('\n            ')}
          </TableRow>`).join('\n          ')}
        </TableBody>
      </Table>
    </div>
  )
}
`;
      }

      default:
        return 'Select a tab to generate React code.';
    }
  }

  const handleGenerate = () => {
    const generatedHTML = generateHTMLCode();
    setHtmlCode(generatedHTML);

    const generatedReact = generateReactCode(componentName);
    setReactCode(generatedReact);
  };

  const handleCopyCode = (codeType: 'html' | 'react') => {
    const codeToCopy = codeType === 'html' ? htmlCode : reactCode;
    navigator.clipboard.writeText(codeToCopy)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "The code has been successfully copied to the clipboard.",
        })
      })
      .catch(err => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Failed to copy code to clipboard.",
        })
      });
  };

  const handleDownloadCode = (codeType: 'html' | 'react') => {
    const codeToDownload = codeType === 'html' ? htmlCode : reactCode;
    const filename = `${componentName}.${codeType === 'html' ? 'html' : 'jsx'}`;
    const blob = new Blob([codeToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Component Generator</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XCircle className="h-6 w-6" />
            </Button>
          </div>

          <div className="mb-4">
            <Label htmlFor="componentName" className="block text-sm font-medium text-gray-700">Component Name</Label>
            <Input
              type="text"
              id="componentName"
              className="mt-1 w-full"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700">Component Type</Label>
            <div className="flex items-center space-x-4">
              <Button
                variant={componentType === 'client' ? 'default' : 'outline'}
                onClick={() => setComponentType('client')}
              >
                Client Component
              </Button>
              <Button
                variant={componentType === 'server' ? 'default' : 'outline'}
                onClick={() => setComponentType('server')}
              >
                Server Component
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700">Tabs</Label>
            <div className="flex space-x-4">
              <Button
                variant={activeTab === 'basic' ? 'default' : 'outline'}
                onClick={() => setActiveTab('basic')}
              >
                Basic
              </Button>
              <Button
                variant={activeTab === 'form' ? 'default' : 'outline'}
                onClick={() => setActiveTab('form')}
              >
                Form
              </Button>
              <Button
                variant={activeTab === 'table' ? 'default' : 'outline'}
                onClick={() => setActiveTab('table')}
              >
                Table
              </Button>
            </div>
          </div>

          {activeTab === 'basic' && (
            <div className="mb-4">
              <Label htmlFor="basicContent" className="block text-sm font-medium text-gray-700">Content</Label>
              <Textarea
                id="basicContent"
                className="mt-1 w-full"
                value={basicContent}
                onChange={(e) => setBasicContent(e.target.value)}
              />
            </div>
          )}

          {activeTab === 'form' && (
            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700">Form Fields</Label>
              {formFields.map((field, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Label"
                    value={field.label}
                    onChange={(e) => {
                      const newFields = [...formFields];
                      newFields[index].label = e.target.value;
                      setFormFields(newFields);
                    }}
                  />
                  <Select onValueChange={(value) => {
                    const newFields = [...formFields];
                    newFields[index].type = value;
                    setFormFields(newFields);
                  }}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Type" defaultValue={field.type} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="password">Password</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={() => {
                    const newFields = [...formFields];
                    newFields.splice(index, 1);
                    setFormFields(newFields);
                  }}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => setFormFields([...formFields, { label: 'New Field', type: 'text' }])}>
                Add Field
              </Button>
            </div>
          )}

          {activeTab === 'table' && (
              <TableTab
                bulkMode={bulkMode}
                setBulkMode={setBulkMode}
                tableData={tableData}
                setTableData={setTableData}
                tableHeaders={tableHeaders}
                setTableHeaders={setTableHeaders}
                hasHeader={hasHeader}
                setHasHeader={setHasHeader}
                hasAlternatingRows={hasAlternatingRows}
                setHasAlternatingRows={setHasAlternatingRows}
                isResponsive={isResponsive}
                setIsResponsive={setIsResponsive}
                tableCaption={tableCaption}
                setTableCaption={setTableCaption}
                tableStyle={tableStyle}
                setTableStyle={setTableStyle}
                headerColor={headerColor}
                setHeaderColor={setHeaderColor}
                borderRadius={borderRadius}
                setBorderRadius={setBorderRadius}
              />
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="inlineStyles"
              checked={inlineStyles}
              onCheckedChange={(checked) => setInlineStyles(!!checked)}
            />
            <Label htmlFor="inlineStyles" className="text-sm font-medium text-gray-700">Use Inline Styles</Label>
          </div>

          <div className="mt-6">
            <Button onClick={handleGenerate}>Generate Code</Button>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <div>
            <h3 className="text-lg font-bold mb-2">HTML Preview</h3>
            <div className="border rounded-md p-4 overflow-auto">
              <div dangerouslySetInnerHTML={{ __html: htmlCode }} />
            </div>
            <div className="flex justify-end space-x-2 mt-2">
              <Button size="sm" variant="secondary" onClick={() => handleCopyCode('html')}>
                <Copy className="h-4 w-4 mr-2" /> Copy HTML
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleDownloadCode('html')}>
                <Download className="h-4 w-4 mr-2" /> Download HTML
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2">React Code</h3>
            <div className="border rounded-md p-4 overflow-auto">
              <pre className="whitespace-pre-wrap">
                <code>{reactCode}</code>
              </pre>
            </div>
            <div className="flex justify-end space-x-2 mt-2">
              <Button size="sm" variant="secondary" onClick={() => handleCopyCode('react')}>
                <Copy className="h-4 w-4 mr-2" /> Copy React
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleDownloadCode('react')}>
                <Download className="h-4 w-4 mr-2" /> Download React
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ComponentGenerator;
