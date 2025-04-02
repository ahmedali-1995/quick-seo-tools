import React, { useState } from 'react';
import TabButton from '../UI/TabButton';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import CodePreview from '../UI/CodePreview';
import ProductTab from './ProductTab';
import ProsConsTab from './ProsConsTab';
import FaqTab from './FaqTab';
import SchemaTab from './SchemaTab';
import { SchemaResult } from '@/utils/schemaUtils';
import { toast } from '@/components/ui/use-toast';
import { Button } from '../ui/button';

const ComponentGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('product');
  const [sharedStyles, setSharedStyles] = useState(true);
  const [bulkMode, setBulkMode] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [schemaUrl, setSchemaUrl] = useState('');
  const [schemaData, setSchemaData] = useState<SchemaResult | null>(null);
  
  const [productTitle, setProductTitle] = useState('BEST MEN\'S MULTIVITAMIN FOR IMMUNE SUPPORT');
  const [productName, setProductName] = useState('Theralogix Solo Vitamin & Mineral Supplement');
  const [imageUrl, setImageUrl] = useState('/api/placeholder/150/300');
  const [shopButtonText, setShopButtonText] = useState('SHOP AT AMAZON');
  const [shopUrl, setShopUrl] = useState('https://www.amazon.com');
  const [pros, setPros] = useState([
    'Price per dose is on the more affordable end',
    'Just one pill daily',
    'Contains 100% of the daily recommended value for more than 20 vitamins and minerals'
  ]);
  const [cons, setCons] = useState([
    'May not be suitable for vegans'
  ]);
  const [specs, setSpecs] = useState([
    { label: 'Type', value: 'Tablet' },
    { label: 'Dosage', value: '1 tablet' },
    { label: 'Price per dose', value: '$0.80' },
    { label: 'Age range', value: '18+' },
    { label: 'Certification', value: 'NSF' }
  ]);

  const [prosConsTitle, setProsConsTitle] = useState('Pros and Cons');
  const [prosOnly, setProsOnly] = useState([
    'Easy to use interface',
    'Comprehensive documentation',
    'Regular updates with new features'
  ]);
  const [consOnly, setConsOnly] = useState([
    'Limited free plan options',
    'Requires internet connection'
  ]);
  
  const [bulkProsConsData, setBulkProsConsData] = useState(
`Product A
pros: Easy to use, Affordable, Long battery life
cons: Heavier than competitors, Limited color options

Product B
pros: Lightweight design, Premium build quality, Fast charging
cons: Expensive, Short warranty period`);

  const [faqs, setFaqs] = useState([
    { 
      question: 'How do I install this product?', 
      answer: 'Installation is simple. Just unpack the box, connect the power cable, and follow the on-screen instructions.' 
    },
    { 
      question: 'What is the warranty period?', 
      answer: 'All our products come with a standard 2-year warranty that covers manufacturing defects.' 
    }
  ]);
  
  const [bulkFaqData, setBulkFaqData] = useState(
`Q: How do I install this product?
A: Installation is simple. Just unpack the box, connect the power cable, and follow the on-screen instructions.

Q: What is the warranty period?
A: All our products come with a standard 2-year warranty that covers manufacturing defects.`);

  function getInlineStyles() {
    return {
      container: {
        maxWidth: '600px',
        margin: '0 auto',
        border: '1px solid #5a2c82',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      },
      productHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px'
      },
      productImage: {
        width: '150px',
        marginRight: '20px'
      },
      productTitle: {
        flex: '1'
      },
      productTitleH3: {
        color: '#5a2c82',
        textAlign: 'center',
        fontSize: '14px',
        marginBottom: '10px'
      },
      productTitleH2: {
        textAlign: 'center',
        fontSize: '18px',
        marginTop: '0',
        color: '#333'
      },
      shopButton: {
        backgroundColor: '#5a2c82',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        fontWeight: 'bold',
        display: 'block',
        width: '150px',
        textAlign: 'center',
        margin: '10px auto',
        textDecoration: 'none'
      },
      prosCons: {
        display: 'flex',
        marginBottom: '20px'
      },
      pros: {
        flex: '1'
      },
      cons: {
        flex: '1'
      },
      prosConsStandalone: {
        border: '1px solid #dfdfdf',
        padding: '20px',
        marginBottom: '20px'
      },
      prosConsStandaloneH3: {
        color: '#5a2c82',
        textAlign: 'center',
        marginTop: '0',
        marginBottom: '20px'
      },
      h4: {
        color: '#5a2c82',
        borderBottom: '1px solid #5a2c82',
        paddingBottom: '5px'
      },
      prosList: {
        listStyleType: 'none',
        paddingLeft: '0'
      },
      consList: {
        listStyleType: 'none',
        paddingLeft: '0'
      },
      prosItem: {
        position: 'relative',
        paddingLeft: '25px',
        marginBottom: '10px'
      },
      consItem: {
        position: 'relative',
        paddingLeft: '25px',
        marginBottom: '10px'
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse'
      },
      tableTd: {
        border: '1px solid #dfdfdf',
        padding: '10px'
      },
      tableFirstTd: {
        fontWeight: 'bold',
        width: '150px',
        backgroundColor: '#f9f6fc',
        color: '#5a2c82'
      },
      faqContainer: {
        border: '1px solid #dfdfdf',
        padding: '20px',
        marginBottom: '20px'
      },
      faqContainerH3: {
        color: '#5a2c82',
        textAlign: 'center',
        marginTop: '0',
        marginBottom: '20px'
      },
      faqItem: {
        marginBottom: '10px',
        border: '1px solid #dfdfdf',
        borderRadius: '4px',
        overflow: 'hidden'
      },
      faqQuestion: {
        backgroundColor: '#f9f6fc',
        padding: '10px 15px',
        fontWeight: 'bold',
        cursor: 'pointer',
        position: 'relative',
        color: '#5a2c82'
      },
      faqAnswer: {
        padding: '15px',
        borderTop: '1px solid #dfdfdf',
        display: 'none'
      },
      faqAnswerActive: {
        padding: '15px',
        borderTop: '1px solid #dfdfdf',
        display: 'block'
      }
    };
  }

  function getFaqToggleScript() {
    return `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const questions = document.querySelectorAll('.faq-question');
        questions.forEach(question => {
          question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
          });
        });
      });
    </script>`;
  }

  function generateProductHTML() {
    const styles = getInlineStyles();
    const scriptTag = sharedStyles ? getFaqToggleScript() : '';
    
    const htmlContent = `
    <div style="${objectToInlineStyle(styles.container)}">
      <div style="${objectToInlineStyle(styles.productHeader)}">
        <img style="${objectToInlineStyle(styles.productImage)}" src="${imageUrl}" alt="Product Image">
        <div style="${objectToInlineStyle(styles.productTitle)}">
          <h3 style="${objectToInlineStyle(styles.productTitleH3)}">${productTitle}</h3>
          <h2 style="${objectToInlineStyle(styles.productTitleH2)}">${productName}</h2>
          <a href="${shopUrl}" style="${objectToInlineStyle(styles.shopButton)}">${shopButtonText}</a>
        </div>
      </div>
      
      <div style="${objectToInlineStyle(styles.prosCons)}">
        <div style="${objectToInlineStyle(styles.pros)}">
          <h4 style="${objectToInlineStyle(styles.h4)}">PROS</h4>
          <ul style="${objectToInlineStyle(styles.prosList)}">
            ${pros.map(pro => `<li style="${objectToInlineStyle(styles.prosItem)}">${pro}</li>`).join('')}
          </ul>
        </div>
        <div style="${objectToInlineStyle(styles.cons)}">
          <h4 style="${objectToInlineStyle(styles.h4)}">CONS</h4>
          <ul style="${objectToInlineStyle(styles.consList)}">
            ${cons.map(con => `<li style="${objectToInlineStyle(styles.consItem)}">${con}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <table style="${objectToInlineStyle(styles.table)}">
        ${specs.map(spec => 
          `<tr>
            <td style="${objectToInlineStyle({...styles.tableTd, ...styles.tableFirstTd})}">${spec.label}</td>
            <td style="${objectToInlineStyle(styles.tableTd)}">${spec.value}</td>
          </tr>`
        ).join('')}
      </table>
    </div>`;

    return sharedStyles ? scriptTag + htmlContent : htmlContent;
  }

  function objectToInlineStyle(styleObj) {
    return Object.entries(styleObj)
      .map(([key, value]) => {
        const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${kebabKey}:${value}`;
      })
      .join(';');
  }

  function generateProsConsHTML() {
    const styles = getInlineStyles();
    
    if (bulkMode) {
      const products = bulkProsConsData.trim().split('\n\n');
      let htmlContent = '';
      
      products.forEach(product => {
        const lines = product.trim().split('\n');
        const productName = lines[0].trim();
        
        let prosItems = [];
        let consItems = [];
        
        lines.slice(1).forEach(line => {
          if (line.startsWith('pros:')) {
            prosItems = line.replace('pros:', '').split(',').map(item => item.trim());
          } else if (line.startsWith('cons:')) {
            consItems = line.replace('cons:', '').split(',').map(item => item.trim());
          }
        });
        
        htmlContent += `
        <div style="${objectToInlineStyle(styles.prosConsStandalone)}">
          <h3 style="${objectToInlineStyle(styles.prosConsStandaloneH3)}">${productName}</h3>
          <div style="${objectToInlineStyle(styles.prosCons)}">
            <div style="${objectToInlineStyle(styles.pros)}">
              <h4 style="${objectToInlineStyle(styles.h4)}">PROS</h4>
              <ul style="${objectToInlineStyle(styles.prosList)}">
                ${prosItems.map(pro => `<li style="${objectToInlineStyle(styles.prosItem)}">${pro}</li>`).join('')}
              </ul>
            </div>
            <div style="${objectToInlineStyle(styles.cons)}">
              <h4 style="${objectToInlineStyle(styles.h4)}">CONS</h4>
              <ul style="${objectToInlineStyle(styles.consList)}">
                ${consItems.map(con => `<li style="${objectToInlineStyle(styles.consItem)}">${con}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>`;
      });
      
      return htmlContent;
    } else {
      const htmlContent = `
      <div style="${objectToInlineStyle(styles.prosConsStandalone)}">
        <h3 style="${objectToInlineStyle(styles.prosConsStandaloneH3)}">${prosConsTitle}</h3>
        <div style="${objectToInlineStyle(styles.prosCons)}">
          <div style="${objectToInlineStyle(styles.pros)}">
            <h4 style="${objectToInlineStyle(styles.h4)}">PROS</h4>
            <ul style="${objectToInlineStyle(styles.prosList)}">
              ${prosOnly.map(pro => `<li style="${objectToInlineStyle(styles.prosItem)}">${pro}</li>`).join('')}
            </ul>
          </div>
          <div style="${objectToInlineStyle(styles.cons)}">
            <h4 style="${objectToInlineStyle(styles.h4)}">CONS</h4>
            <ul style="${objectToInlineStyle(styles.consList)}">
              ${consOnly.map(con => `<li style="${objectToInlineStyle(styles.consItem)}">${con}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>`;
      
      return htmlContent;
    }
  }

  function generateFaqHTML() {
    const styles = getInlineStyles();
    const scriptTag = sharedStyles ? getFaqToggleScript() : '';
    
    if (bulkMode) {
      const faqPairs = bulkFaqData.trim().split('\n\n');
      let faqItems = [];
      
      faqPairs.forEach(pair => {
        const lines = pair.trim().split('\n');
        if (lines.length >= 2) {
          const question = lines[0].replace(/^Q:\s*/i, '').trim();
          const answer = lines[1].replace(/^A:\s*/i, '').trim();
          faqItems.push({ question, answer });
        }
      });
      
      const htmlContent = `
      <div style="${objectToInlineStyle(styles.faqContainer)}">
        <h3 style="${objectToInlineStyle(styles.faqContainerH3)}">Frequently Asked Questions</h3>
        ${faqItems.map(faq => `
          <div style="${objectToInlineStyle(styles.faqItem)}">
            <div class="faq-question" style="${objectToInlineStyle(styles.faqQuestion)}">${faq.question}</div>
            <div class="faq-answer" style="${objectToInlineStyle(styles.faqAnswer)}">${faq.answer}</div>
          </div>
        `).join('')}
      </div>`;
      
      return sharedStyles ? scriptTag + htmlContent : htmlContent;
    } else {
      const htmlContent = `
      <div style="${objectToInlineStyle(styles.faqContainer)}">
        <h3 style="${objectToInlineStyle(styles.faqContainerH3)}">Frequently Asked Questions</h3>
        ${faqs.map(faq => `
          <div style="${objectToInlineStyle(styles.faqItem)}">
            <div class="faq-question" style="${objectToInlineStyle(styles.faqQuestion)}">${faq.question}</div>
            <div class="faq-answer" style="${objectToInlineStyle(styles.faqAnswer)}">${faq.answer}</div>
          </div>
        `).join('')}
      </div>`;
      
      return sharedStyles ? scriptTag + htmlContent : htmlContent;
    }
  }

  function generateSchemaHTML() {
    if (!schemaData) return '';
    
    const htmlContent = `
    <script type="application/ld+json">
      ${JSON.stringify(schemaData, null, 2)}
    </script>`;
    
    return htmlContent;
  }

  function generateProductWithSchemaHTML() {
    if (!schemaData) {
      toast({
        title: "Schema Required",
        description: "Please generate a schema first",
        variant: "destructive"
      });
      return '';
    }
    
    const productSchema = {
      ...schemaData,
      name: productName,
      description: productTitle,
      image: imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`,
    };
    
    if (!productSchema.offers && productSchema['@type'] === 'Product') {
      const priceSpec = specs.find(spec => 
        spec.label.toLowerCase().includes('price') && 
        spec.value.includes('$')
      );
      
      if (priceSpec) {
        const priceMatch = priceSpec.value.match(/\$([0-9]+(\.[0-9]+)?)/);
        if (priceMatch && priceMatch[1]) {
          productSchema.offers = {
            "@type": "Offer",
            "price": priceMatch[1],
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": shopUrl
          };
        }
      }
    }
    
    if (productSchema['@type'] === 'Product' && specs.length > 0) {
      if (!productSchema.additionalProperty) {
        productSchema.additionalProperty = [];
      }
      
      specs.forEach(spec => {
        if (!productSchema.additionalProperty.some(prop => prop.name === spec.label)) {
          productSchema.additionalProperty.push({
            "@type": "PropertyValue",
            "name": spec.label,
            "value": spec.value
          });
        }
      });
    }
    
    const schemaScript = `
    <script type="application/ld+json">
      ${JSON.stringify(productSchema, null, 2)}
    </script>`;
    
    return generateProductHTML() + schemaScript;
  }

  function generateFaqWithSchemaHTML() {
    if (!schemaData || schemaData['@type'] !== 'FAQPage') {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
      };
      
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
      
      faqItems.forEach(faq => {
        faqSchema.mainEntity.push({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        });
      });
      
      const schemaScript = `
      <script type="application/ld+json">
        ${JSON.stringify(faqSchema, null, 2)}
      </script>`;
      
      return generateFaqHTML() + schemaScript;
    } else {
      return generateFaqHTML() + generateSchemaHTML();
    }
  }

  function generateHTML() {
    let htmlContent = '';
    
    switch (activeTab) {
      case 'product':
        if (schemaData && schemaData['@type'] === 'Product') {
          htmlContent = generateProductWithSchemaHTML();
        } else {
          htmlContent = generateProductHTML();
        }
        break;
      case 'proscons':
        htmlContent = generateProsConsHTML();
        break;
      case 'faq':
        if (schemaData && schemaData['@type'] === 'FAQPage') {
          htmlContent = generateFaqWithSchemaHTML();
        } else {
          htmlContent = generateFaqHTML();
        }
        break;
      case 'schema':
        htmlContent = generateSchemaHTML();
        break;
      default:
        htmlContent = '';
    }
    
    setGeneratedHTML(htmlContent);
  }

  function generateProductSchema() {
    const newSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": productName,
      "description": productTitle,
      "image": imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`,
    };
    
    const priceSpec = specs.find(spec => 
      spec.label.toLowerCase().includes('price') && 
      spec.value.includes('$')
    );
    
    if (priceSpec) {
      const priceMatch = priceSpec.value.match(/\$([0-9]+(\.[0-9]+)?)/);
      if (priceMatch && priceMatch[1]) {
        newSchema.offers = {
          "@type": "Offer",
          "price": priceMatch[1],
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": shopUrl
        };
      }
    }
    
    if (specs.length > 0) {
      newSchema.additionalProperty = specs.map(spec => ({
        "@type": "PropertyValue",
        "name": spec.label,
        "value": spec.value
      }));
    }
    
    setSchemaData(newSchema);
    
    toast({
      title: "Schema Generated",
      description: "Product schema has been generated from your product data"
    });
  }

  function generateFaqSchema() {
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
    
    const newSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    
    setSchemaData(newSchema);
    
    toast({
      title: "Schema Generated",
      description: "FAQ schema has been generated from your FAQs"
    });
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-block px-3 py-1 bg-accent text-primary rounded-full text-sm font-medium mb-3">
          Component Generator
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          HTML Component Generator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create beautifully styled HTML components for product displays, pros & cons lists, FAQ accordions, and Schema markup.
        </p>
      </div>
      
      <div className="border rounded-xl shadow-sm overflow-hidden bg-card">
        <div className="border-b">
          <div className="flex overflow-x-auto px-4">
            <TabButton
              active={activeTab === 'product'}
              onClick={() => setActiveTab('product')}
            >
              Product Display
            </TabButton>
            <TabButton
              active={activeTab === 'proscons'}
              onClick={() => setActiveTab('proscons')}
            >
              Pros & Cons
            </TabButton>
            <TabButton
              active={activeTab === 'faq'}
              onClick={() => setActiveTab('faq')}
            >
              FAQ Accordion
            </TabButton>
            <TabButton
              active={activeTab === 'schema'}
              onClick={() => setActiveTab('schema')}
            >
              Schema Markup
            </TabButton>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6 pb-6 border-b flex flex-wrap gap-4">
            {activeTab !== 'product' && activeTab !== 'schema' && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bulkMode"
                  checked={bulkMode}
                  onCheckedChange={() => setBulkMode(!bulkMode)}
                />
                <Label htmlFor="bulkMode">Bulk Mode</Label>
              </div>
            )}
            {activeTab !== 'schema' && (
              <div className="flex items-center space-x-2 ml-auto">
                <Checkbox
                  id="sharedStyles"
                  checked={sharedStyles}
                  onCheckedChange={() => setSharedStyles(!sharedStyles)}
                />
                <Label htmlFor="sharedStyles">Include CSS & JavaScript</Label>
              </div>
            )}
            
            {activeTab === 'product' && (
              <Button
                variant="outline"
                size="sm"
                onClick={generateProductSchema}
                className="ml-4"
              >
                Auto-Generate Schema
              </Button>
            )}
            
            {activeTab === 'faq' && (
              <Button
                variant="outline"
                size="sm"
                onClick={generateFaqSchema}
                className="ml-4"
              >
                Auto-Generate Schema
              </Button>
            )}
          </div>
          
          <div className="tab-content">
            {activeTab === 'product' && (
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
            )}
            
            {activeTab === 'proscons' && (
              <ProsConsTab
                bulkMode={bulkMode}
                setBulkMode={setBulkMode}
                prosConsTitle={prosConsTitle}
                setProsConsTitle={setProsConsTitle}
                prosOnly={prosOnly}
                setProsOnly={setProsOnly}
                consOnly={consOnly}
                setConsOnly={setConsOnly}
                bulkProsConsData={bulkProsConsData}
                setBulkProsConsData={setBulkProsConsData}
              />
            )}
            
            {activeTab === 'faq' && (
              <FaqTab
                bulkMode={bulkMode}
                setBulkMode={setBulkMode}
                faqs={faqs}
                setFaqs={setFaqs}
                bulkFaqData={bulkFaqData}
                setBulkFaqData={setBulkFaqData}
              />
            )}
            
            {activeTab === 'schema' && (
              <SchemaTab
                url={schemaUrl}
                setUrl={setSchemaUrl}
                schemaData={schemaData}
                setSchemaData={setSchemaData}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
          </div>
        </div>
        
        <div className="p-6 border-t bg-secondary/30">
          <button
            onClick={generateHTML}
            className="btn-primary w-full md:w-auto transform transition-transform duration-200 hover:scale-105"
          >
            Generate HTML
          </button>
        </div>
      </div>
      
      {generatedHTML && (
        <div className="space-y-4 animate-fade-up">
          <h3 className="text-lg font-medium">Generated HTML</h3>
          <CodePreview code={generatedHTML} language="html" />
        </div>
      )}
    </div>
  );
};

export default ComponentGenerator;
