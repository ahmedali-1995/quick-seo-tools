import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CopyIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import ProductTab from './ProductTab';
import TableTab from './TableTab';

const ComponentGenerator = () => {
  const [activeTab, setActiveTab] = useState('product');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [reactOutput, setReactOutput] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [showReactCode, setShowReactCode] = useState(false);

  // Product tab state
  const [productTitle, setProductTitle] = useState('BEST MEN\'S MULTIVITAMIN FOR IMMUNE SUPPORT');
  const [productName, setProductName] = useState('Theralogix Solo Vitamin & Mineral Supplement');
  const [imageUrl, setImageUrl] = useState('/api/placeholder/150/300');
  const [shopButtonText, setShopButtonText] = useState('SHOP AT AMAZON');
  const [shopUrl, setShopUrl] = useState('https://www.amazon.com');
  const [pros, setPros] = useState(['Strong immune support', 'Science-backed ingredients']);
  const [cons, setCons] = useState(['Premium price', 'Only available online']);
  const [specs, setSpecs] = useState([
    { label: 'Servings', value: '30 tablets' },
    { label: 'Dosage', value: '1 tablet daily' }
  ]);

  // Table tab state
  const [bulkMode, setBulkMode] = useState(false);
  const [tableData, setTableData] = useState([
    ['Data 1', 'Data 2', 'Data 3'],
    ['Data 4', 'Data 5', 'Data 6'],
    ['Data 7', 'Data 8', 'Data 9'],
  ]);
  const [tableHeaders, setTableHeaders] = useState(['Header 1', 'Header 2', 'Header 3']);
  const [hasHeader, setHasHeader] = useState(true);
  const [hasAlternatingRows, setHasAlternatingRows] = useState(true);
  const [isResponsive, setIsResponsive] = useState(true);
  const [tableCaption, setTableCaption] = useState('Table Caption');
  const [tableStyle, setTableStyle] = useState<'basic' | 'striped' | 'bordered' | 'minimal'>('basic');
  const [headerColor, setHeaderColor] = useState('');
  const [borderRadius, setBorderRadius] = useState('');

  function styleObjectToCss(styleObj: Record<string, string | number>) {
    return Object.entries(styleObj)
      .map(([key, value]) => {
        // Convert camelCase to kebab-case
        const kebabKey = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        return `${kebabKey}: ${value}`;
      })
      .join('; ');
  }

  function getInlineStyles() {
    if (activeTab === 'table') {
      const tableStyles = {
        table: {
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '1rem',
          borderRadius: borderRadius || undefined,
          overflow: 'hidden',
        },
        caption: {
          captionSide: 'bottom',
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#6b7280',
        },
        th: {
          padding: '0.75rem',
          textAlign: 'left',
          fontWeight: 'bold',
          backgroundColor: headerColor || '#f3f4f6',
          color: headerColor ? '#ffffff' : '#374151',
          borderBottom: tableStyle === 'bordered' ? '1px solid #d1d5db' : '2px solid #d1d5db',
        },
        td: {
          padding: '0.75rem',
          borderBottom: tableStyle === 'bordered' ? '1px solid #d1d5db' : '1px solid #e5e7eb',
          borderRight: tableStyle === 'bordered' ? '1px solid #d1d5db' : 'none',
        },
        tr: {
          backgroundColor: 'white',
        },
        trAlt: {
          backgroundColor: '#f9fafb',
        },
        responsiveWrapper: {
          overflowX: 'auto',
        },
      };

      return tableStyles;
    }

    return {};
  }

  function renderProductDisplay() {
    const productStyles = {
      card: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
        maxWidth: '800px',
        margin: '0 auto',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      },
      header: {
        backgroundColor: '#f9fafb',
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        textAlign: 'center' as const
      },
      title: {
        fontWeight: 'bold',
        fontSize: '14px',
        color: '#6b7280',
        letterSpacing: '0.05em',
        margin: '0'
      },
      content: {
        display: 'flex',
        flexDirection: 'column' as const,
        padding: '16px'
      },
      imageContainer: {
        display: 'flex',
        justifyContent: 'center' as const,
        marginBottom: '16px'
      },
      image: {
        maxWidth: '200px',
        maxHeight: '300px',
        objectFit: 'contain' as const
      },
      productName: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '16px',
        textAlign: 'center' as const
      },
      section: {
        marginBottom: '16px'
      },
      sectionTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '8px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '4px'
      },
      list: {
        margin: '0',
        padding: '0 0 0 24px'
      },
      listItem: {
        margin: '4px 0'
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse' as const
      },
      tableRow: {
        borderBottom: '1px solid #f3f4f6'
      },
      tableCell: {
        padding: '8px',
        fontSize: '14px'
      },
      buttonContainer: {
        display: 'flex',
        justifyContent: 'center' as const,
        marginTop: '16px'
      },
      button: {
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '10px 16px',
        fontWeight: 'bold',
        borderRadius: '4px',
        textDecoration: 'none',
        textAlign: 'center' as const
      },
      prosIcon: {
        color: '#16a34a',
        marginRight: '6px'
      },
      consIcon: {
        color: '#dc2626',
        marginRight: '6px'
      }
    };

    const htmlContent = `<div style="${styleObjectToCss(productStyles.card)}">
  <div style="${styleObjectToCss(productStyles.header)}">
    <p style="${styleObjectToCss(productStyles.title)}">${productTitle}</p>
  </div>
  <div style="${styleObjectToCss(productStyles.content)}">
    <div style="${styleObjectToCss(productStyles.imageContainer)}">
      <img 
        src="${imageUrl}" 
        alt="${productName}" 
        style="${styleObjectToCss(productStyles.image)}"
      />
    </div>
    <h2 style="${styleObjectToCss(productStyles.productName)}">${productName}</h2>
    
    <div style="${styleObjectToCss(productStyles.section)}">
      <h3 style="${styleObjectToCss(productStyles.sectionTitle)}">Pros</h3>
      <ul style="${styleObjectToCss(productStyles.list)}">
        ${pros.map(pro => `
          <li style="${styleObjectToCss(productStyles.listItem)}">
            <span style="${styleObjectToCss(productStyles.prosIcon)}">✓</span> ${pro}
          </li>
        `).join('')}
      </ul>
    </div>
    
    <div style="${styleObjectToCss(productStyles.section)}">
      <h3 style="${styleObjectToCss(productStyles.sectionTitle)}">Cons</h3>
      <ul style="${styleObjectToCss(productStyles.list)}">
        ${cons.map(con => `
          <li style="${styleObjectToCss(productStyles.listItem)}">
            <span style="${styleObjectToCss(productStyles.consIcon)}">✗</span> ${con}
          </li>
        `).join('')}
      </ul>
    </div>
    
    ${specs.length > 0 ? `
    <div style="${styleObjectToCss(productStyles.section)}">
      <h3 style="${styleObjectToCss(productStyles.sectionTitle)}">Specifications</h3>
      <table style="${styleObjectToCss(productStyles.table)}">
        <tbody>
          ${specs.map(spec => `
            <tr style="${styleObjectToCss(productStyles.tableRow)}">
              <td style="${styleObjectToCss({...productStyles.tableCell, fontWeight: 'bold', width: '40%'})}">${spec.label}</td>
              <td style="${styleObjectToCss(productStyles.tableCell)}">${spec.value}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}
    
    <div style="${styleObjectToCss(productStyles.buttonContainer)}">
      <a 
        href="${shopUrl}" 
        target="_blank" 
        rel="noopener noreferrer" 
        style="${styleObjectToCss(productStyles.button)}"
      >
        ${shopButtonText}
      </a>
    </div>
  </div>
</div>`;

    return htmlContent;
  }

  function renderTableDisplay() {
    const styles = getInlineStyles();
    
    const tableHtml = `
      ${isResponsive ? `<div style="${styleObjectToCss(styles.responsiveWrapper)}">` : ''}
      <table style="${styleObjectToCss(styles.table)}">
        ${tableCaption ? `<caption style="${styleObjectToCss(styles.caption)}">${tableCaption}</caption>` : ''}
        ${hasHeader ? `
        <thead>
          <tr>
            ${tableHeaders.map(header => `<th style="${styleObjectToCss(styles.th)}">${header}</th>`).join('')}
          </tr>
        </thead>
        ` : ''}
        <tbody>
          ${tableData.map((row, rowIndex) => `
            <tr style="${styleObjectToCss(hasAlternatingRows && rowIndex % 2 === 1 ? styles.trAlt : styles.tr)}">
              ${row.map(cell => `<td style="${styleObjectToCss(styles.td)}">${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${isResponsive ? `</div>` : ''}
    `;
    
    return tableHtml;
  }

  function generateReactCode() {
    if (activeTab === 'table') {
      const tableCode = `import React from 'react';
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from '@/components/ui/table';

const DataTable = () => {
  return (
    ${isResponsive ? '<div className="overflow-x-auto w-full">' : ''}
      <Table${tableStyle === 'bordered' ? ' className="border"' : ''}${headerColor ? ` headerColor="${headerColor}"` : ''}${borderRadius ? ` borderRadius="${borderRadius}"` : ''}>
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
    ${isResponsive ? '</div>' : ''}
  );
};

export default DataTable;`;
      
      return tableCode;
    }

    if (activeTab === 'product') {
      return `import React from 'react';

const ProductDisplay = () => {
  return (
    <div className="border rounded-lg shadow-md max-w-2xl mx-auto overflow-hidden">
      <div className="bg-gray-50 border-b px-4 py-3 text-center">
        <p className="text-sm font-bold text-gray-500 tracking-wide">
          ${productTitle}
        </p>
      </div>
      
      <div className="flex flex-col p-4">
        <div className="flex justify-center mb-4">
          <img 
            src="${imageUrl}" 
            alt="${productName}" 
            className="max-w-[200px] max-h-[300px] object-contain"
          />
        </div>
        
        <h2 className="text-xl font-bold mb-4 text-center">
          ${productName}
        </h2>
        
        <div className="mb-4">
          <h3 className="text-base font-bold mb-2 pb-1 border-b">Pros</h3>
          <ul className="pl-6">
            {${JSON.stringify(pros)}.map((pro, index) => (
              <li key={\`pro-\${index}\`} className="flex items-start my-1">
                <span className="text-green-600 mr-1.5">✓</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <h3 className="text-base font-bold mb-2 pb-1 border-b">Cons</h3>
          <ul className="pl-6">
            {${JSON.stringify(cons)}.map((con, index) => (
              <li key={\`con-\${index}\`} className="flex items-start my-1">
                <span className="text-red-600 mr-1.5">✗</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
        
        {${specs.length > 0 ? 'true' : 'false'} && (
          <div className="mb-4">
            <h3 className="text-base font-bold mb-2 pb-1 border-b">Specifications</h3>
            <table className="w-full border-collapse">
              <tbody>
                {${JSON.stringify(specs)}.map((spec, index) => (
                  <tr key={\`spec-\${index}\`} className="border-b border-gray-100">
                    <td className="py-2 px-3 font-semibold w-2/5">{spec.label}</td>
                    <td className="py-2 px-3">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex justify-center mt-4">
          <a
            href="${shopUrl}"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded"
          >
            ${shopButtonText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;`;
    }

    return '';
  }

  function handleGenerate() {
    let html = '';
    
    if (activeTab === 'product') {
      html = renderProductDisplay();
    } else if (activeTab === 'table') {
      html = renderTableDisplay();
    }
    
    setHtmlOutput(html);
    setReactOutput(generateReactCode());
    setShowPreview(true);
  }

  function copyToClipboard(text: string, type: 'html' | 'react') {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type === 'html' ? 'HTML' : 'React'} code copied to clipboard`);
    }).catch(err => {
      toast.error('Failed to copy code');
      console.error('Failed to copy: ', err);
    });
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Component Generator</CardTitle>
          <CardDescription>
            Generate HTML and React components for your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="product" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="product">Product Display</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
            
            <TabsContent value="product">
              <ProductTab
                productTitle={productTitle}
                setProductTitle={setProductTitle}
                productName={productName}
                setProductName={setProductName}
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                shopButtonText={shopButtonText}
                setShopButtonText={setShopButtonText}
                shopUrl={shopUrl}
                setShopUrl={setShopUrl}
                pros={pros}
                setPros={setPros}
                cons={cons}
                setCons={setCons}
                specs={specs}
                setSpecs={setSpecs}
              />
            </TabsContent>
            
            <TabsContent value="table">
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
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate}>Generate Component</Button>
        </CardFooter>
      </Card>

      {htmlOutput && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Preview</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
            </CardTitle>
          </CardHeader>
          {showPreview && (
            <CardContent>
              <div 
                className="border rounded-lg p-4 bg-white"
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            </CardContent>
          )}
        </Card>
      )}

      {htmlOutput && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>HTML Code</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCode(!showCode)}
                >
                  {showCode ? 'Hide' : 'Show'} Code
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(htmlOutput, 'html')}
                >
                  <CopyIcon className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          {showCode && (
            <CardContent>
              <div className="relative">
                <SyntaxHighlighter
                  language="html"
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {htmlOutput}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {reactOutput && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>React Code</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowReactCode(!showReactCode)}
                >
                  {showReactCode ? 'Hide' : 'Show'} Code
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(reactOutput, 'react')}
                >
                  <CopyIcon className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          {showReactCode && (
            <CardContent>
              <div className="relative">
                <SyntaxHighlighter
                  language="jsx"
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {reactOutput}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default ComponentGenerator;
