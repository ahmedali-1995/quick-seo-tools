import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Copy, Download, Github, Link, Loader2, Maximize2, MessageSquare, Minimize2, Moon, Sun, Tv2 } from 'lucide-react';
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/sonner"

import CodePreview from '../UI/CodePreview';
import TableTab from './TableTab';
import TakeawayTab from './TakeawayTab';

const ComponentGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('html');
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [cssCode, setCssCode] = useState<string>('');
  const [jsCode, setJsCode] = useState<string>('');
  const [componentName, setComponentName] = useState<string>('MyComponent');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isResponsive, setIsResponsive] = useState<boolean>(true);
  const [isInteractive, setIsInteractive] = useState<boolean>(false);
  const [componentDescription, setComponentDescription] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [bulkMode, setBulkMode] = useState<boolean>(false);
  const [tableData, setTableData] = useState<string[][]>([['', ''], ['', '']]);
  const [tableHeaders, setTableHeaders] = useState<string[]>(['Column 1', 'Column 2']);
  const [hasHeader, setHasHeader] = useState<boolean>(true);
  const [hasAlternatingRows, setHasAlternatingRows] = useState<boolean>(false);
  const [tableCaption, setTableCaption] = useState<string>('');
  const [tableStyle, setTableStyle] = useState<'basic' | 'striped' | 'bordered' | 'minimal'>('basic');
  const [headerColor, setHeaderColor] = useState<string>('');
  const [takeaways, setTakeaways] = useState<Array<{ title: string; content: string; type: string; icon: string }>>([]);
  const [bulkTakeawayData, setBulkTakeawayData] = useState<string>('');
  const { toast } = useToast()
  const { setTheme } = useTheme()

  const generateHTML = () => {
    let html = `<div class="my-component">\n`;
    html += `  <h1>Hello, ${componentName}!</h1>\n`;
    html += `  <p>${componentDescription}</p>\n`;
    html += `</div>\n`;
    setHtmlCode(html);
  };

  const generateCSS = () => {
    let css = `.my-component {\n`;
    css += `  color: ${isDarkMode ? 'white' : 'black'};\n`;
    css += `}\n`;
    setCssCode(css);
  };

  const generateJS = () => {
    let js = `function ${componentName}() {\n`;
    js += `  return (\n`;
    js += `    <div className="my-component">\n`;
    js += `      <h1>Hello, ${componentName}!</h1>\n`;
    js += `      <p>${componentDescription}</p>\n`;
    js += `    </div>\n`;
    js += `  );\n`;
    js += `}\n`;
    setJsCode(js);
  };

  const generateTableHTML = () => {
    let tableClasses = 'table';
    
    if (tableStyle === 'striped') tableClasses += ' table-striped';
    if (tableStyle === 'bordered') tableClasses += ' table-bordered';
    if (tableStyle === 'minimal') tableClasses += ' table-minimal';
    if (isResponsive) tableClasses += ' responsive';
    
    let html = `<div class="table-container"${isResponsive ? ' style="overflow-x: auto;"' : ''}>\n`;
    html += `  <table class="${tableClasses}">\n`;
    
    if (tableCaption) {
      html += `    <caption>${tableCaption}</caption>\n`;
    }
    
    if (hasHeader) {
      const headerStyle = headerColor ? ` style="background-color: ${headerColor}; color: #ffffff;"` : '';
      html += `    <thead${headerStyle}>\n`;
      html += '      <tr>\n';
      tableHeaders.forEach(header => {
        html += `        <th>${header}</th>\n`;
      });
      html += '      </tr>\n';
      html += '    </thead>\n';
    }
    
    html += '    <tbody>\n';
    tableData.forEach((row, rowIndex) => {
      const rowClass = hasAlternatingRows && rowIndex % 2 === 1 ? ' class="alternate-row"' : '';
      html += `      <tr${rowClass}>\n`;
      row.forEach(cell => {
        html += `        <td>${cell}</td>\n`;
      });
      html += '      </tr>\n';
    });
    html += '    </tbody>\n';
    html += '  </table>\n';
    html += '</div>\n';
    
    let css = `<style>
  .table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
  .table th,
  .table td {
    padding: 0.75rem;
    text-align: left;
  }
  .table-striped tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.05);
  }
  .table-bordered {
    border: 1px solid #dee2e6;
  }
  .table-bordered th,
  .table-bordered td {
    border: 1px solid #dee2e6;
  }
  .table-minimal th {
    border-bottom: 2px solid #dee2e6;
  }
  .table-minimal td {
    border-bottom: 1px solid #dee2e6;
  }
  .table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
    font-weight: 600;
  }
  .alternate-row {
    background-color: rgba(0, 0, 0, 0.05);
  }
  .table caption {
    caption-side: bottom;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    color: #6c757d;
    text-align: left;
  }
</style>`;

    return html + css;
  };

  const handleCodeCopy = (codeType: string) => {
    let code = '';
    switch (codeType) {
      case 'html':
        code = htmlCode;
        break;
      case 'css':
        code = cssCode;
        break;
      case 'js':
        code = jsCode;
        break;
      case 'table':
        code = generateTableHTML();
        break;
      default:
        code = '';
    }

    navigator.clipboard.writeText(code)
      .then(() => {
        toast({
          title: `${codeType.toUpperCase()} code copied to clipboard!`,
        })
      })
      .catch(err => {
        toast({
          variant: "destructive",
          title: "Oops! Failed to copy code.",
          description: err.message,
        })
      });
  };

  return (
    <div className="min-h-screen bg-background antialiased">
      <Toaster />
      <div className="container relative flex flex-col items-center justify-center md:grid lg:max-w-5xl">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Component Generator
            </h1>
            <p className="text-sm text-muted-foreground">
              Craft your web components with ease.
            </p>
          </div>
          <Tabs defaultValue="html" className="w-full">
            <TabsList>
              <TabsTrigger value="html" onClick={() => setActiveTab('html')}>HTML</TabsTrigger>
              <TabsTrigger value="table" onClick={() => setActiveTab('table')}>Table</TabsTrigger>
              <TabsTrigger value="takeaway" onClick={() => setActiveTab('takeaway')}>Takeaway</TabsTrigger>
              {/* <TabsTrigger value="js" onClick={() => setActiveTab('js')}>JS/TS</TabsTrigger>
              <TabsTrigger value="css" onClick={() => setActiveTab('css')}>CSS</TabsTrigger> */}
            </TabsList>
            <TabsContent value="html" className="space-y-4 tab-content">
              <div className="space-y-2">
                <Label htmlFor="name">Component Name</Label>
                <Input
                  id="name"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  placeholder="Component Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={componentDescription}
                  onChange={(e) => setComponentDescription(e.target.value)}
                  placeholder="Component Description"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={(checked) => setIsDarkMode(!!checked)}
                />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="responsive"
                  checked={isResponsive}
                  onCheckedChange={(checked) => setIsResponsive(!!checked)}
                />
                <Label htmlFor="responsive">Responsive</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="interactive"
                  checked={isInteractive}
                  onCheckedChange={(checked) => setIsInteractive(!!checked)}
                />
                <Label htmlFor="interactive">Interactive</Label>
              </div>
              <Button onClick={generateHTML}>Generate HTML</Button>
              {htmlCode && (
                <CodePreview code={htmlCode} language="html" />
              )}
              {htmlCode && (
                <Button variant="secondary" onClick={() => handleCodeCopy('html')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy HTML
                </Button>
              )}
            </TabsContent>
            <TabsContent value="table" className="space-y-1 tab-content">
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
              />
              {generateTableHTML() && (
                <CodePreview code={generateTableHTML()} language="html" />
              )}
              {generateTableHTML() && (
                <Button variant="secondary" onClick={() => handleCodeCopy('table')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Table HTML
                </Button>
              )}
            </TabsContent>
            <TabsContent value="takeaway" className="space-y-1 tab-content">
              <TakeawayTab
                bulkMode={bulkMode}
                setBulkMode={setBulkMode}
                takeaways={takeaways}
                setTakeaways={setTakeaways}
                bulkTakeawayData={bulkTakeawayData}
                setBulkTakeawayData={setBulkTakeawayData}
              />
            </TabsContent>
            <TabsContent value="js" className="space-y-4 tab-content">
              <Button onClick={generateJS}>Generate JS</Button>
              {jsCode && (
                <CodePreview code={jsCode} language="javascript" />
              )}
              {jsCode && (
                <Button variant="secondary" onClick={() => handleCodeCopy('js')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy JS
                </Button>
              )}
            </TabsContent>
            <TabsContent value="css" className="space-y-4 tab-content">
              <Button onClick={generateCSS}>Generate CSS</Button>
              {cssCode && (
                <CodePreview code={cssCode} language="css" />
              )}
              {cssCode && (
                <Button variant="secondary" onClick={() => handleCodeCopy('css')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy CSS
                </Button>
              )}
            </TabsContent>
          </Tabs>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Additional Notes</AccordionTrigger>
              <AccordionContent>
                Add any additional notes or instructions here.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ComponentGenerator;
