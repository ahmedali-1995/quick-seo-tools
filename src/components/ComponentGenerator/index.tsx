import React, { useState } from 'react';
import TabButton from '../UI/TabButton';
import Checkbox from '../UI/Checkbox';
import CodePreview from '../UI/CodePreview';
import ProductTab from './ProductTab';
import ProsConsTab from './ProsConsTab';
import FaqTab from './FaqTab';
import SchemaTab from './SchemaTab';
import { extractSchema, SchemaResult } from '@/utils/schemaUtils';
import { toast } from '@/components/ui/use-toast';

const ComponentGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('product');
  const [sharedStyles, setSharedStyles] = useState(true);
  const [bulkMode, setBulkMode] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Schema Tab State
  const [schemaUrl, setSchemaUrl] = useState('');
  const [schemaData, setSchemaData] = useState<SchemaResult | null>(null);
  
  // Product Display State
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

  // Pros Cons Only State
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
  
  // Bulk Pros Cons State
  const [bulkProsConsData, setBulkProsConsData] = useState(
`Product A
pros: Easy to use, Affordable, Long battery life
cons: Heavier than competitors, Limited color options

Product B
pros: Lightweight design, Premium build quality, Fast charging
cons: Expensive, Short warranty period`);

  // FAQ State
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
  
  // Bulk FAQ State
  const [bulkFaqData, setBulkFaqData] = useState(
`Q: How do I install this product?
A: Installation is simple. Just unpack the box, connect the power cable, and follow the on-screen instructions.

Q: What is the warranty period?
A: All our products come with a standard 2-year warranty that covers manufacturing defects.`);

  // Get CSS Styles
  function getStyles() {
    return `
    <style>
      /* DNP Colors */
      :root {
        --dnp-purple: #5a2c82;
        --dnp-green: #79b928;
        --dnp-light-purple: #f9f6fc;
        --border-color: #dfdfdf;
      }
      
      /* Common Styles */
      .dnp-container {
        max-width: 600px;
        margin: 0 auto;
        border: 1px solid var(--dnp-purple);
        padding: 20px;
        font-family: Arial, sans-serif;
      }
      
      /* Product Display Styles */
      .product-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      .product-image {
        width: 150px;
        margin-right: 20px;
      }
      .product-title {
        flex: 1;
      }
      .product-title h3 {
        color: var(--dnp-purple);
        text-align: center;
        font-size: 14px;
        margin-bottom: 10px;
      }
      .product-title h2 {
        text-align: center;
        font-size: 18px;
        margin-top: 0;
        color: #333;
      }
      .shop-button {
        background-color: var(--dnp-purple);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-weight: bold;
        display: block;
        width: 150px;
        text-align: center;
        margin: 10px auto;
        text-decoration: none;
      }
      .shop-button:hover {
        background-color: #4a2569;
      }
      
      /* Pros Cons Styles */
      .pros-cons {
        display: flex;
        margin-bottom: 20px;
      }
      .pros, .cons {
        flex: 1;
      }
      .pros-cons-standalone {
        border: 1px solid var(--border-color);
        padding: 20px;
        margin-bottom: 20px;
      }
      .pros-cons-standalone h3 {
        color: var(--dnp-purple);
        text-align: center;
        margin-top: 0;
        margin-bottom: 20px;
      }
      h4 {
        color: var(--dnp-purple);
        border-bottom: 1px solid var(--dnp-purple);
        padding-bottom: 5px;
      }
      .pros ul, .cons ul {
        list-style-type: none;
        padding-left: 0;
      }
      .pros li, .cons li {
        position: relative;
        padding-left: 25px;
        margin-bottom: 10px;
      }
      .pros li:before, .cons li:before {
        content: "";
        position: absolute;
        left: 0;
        top: 2px;
        width: 16px;
        height: 16px;
        background-color: #f0f0f0;
        border-radius: 50%;
        border: 1px solid var(--border-color);
      }
      .pros li:after {
        content: "✓";
        position: absolute;
        left: 4px;
        top: -1px;
        color: var(--dnp-green);
      }
      .cons li:after {
        content: "✗";
        position: absolute;
        left: 4px;
        top: -1px;
        color: var(--dnp-purple);
      }
      
      /* Table Styles */
      table {
        width: 100%;
        border-collapse: collapse;
      }
      table td {
        border: 1px solid var(--border-color);
        padding: 10px;
      }
      td:first-child {
        font-weight: bold;
        width: 150px;
        background-color: var(--dnp-light-purple);
        color: var(--dnp-purple);
      }
      
      /* FAQ Styles */
      .faq-container {
        border: 1px solid var(--border-color);
        padding: 20px;
        margin-bottom: 20px;
      }
      .faq-container h3 {
        color: var(--dnp-purple);
        text-align: center;
        margin-top: 0;
        margin-bottom: 20px;
      }
      .faq-item {
        margin-bottom: 10px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        overflow: hidden;
      }
      .faq-question {
        background-color: var(--dnp-light-purple);
        padding: 10px 15px;
        font-weight: bold;
        cursor: pointer;
        position: relative;
        color: var(--dnp-purple);
      }
      .faq-question:after {
        content: "+";
        position: absolute;
        right: 15px;
        top: 10px;
      }
      .faq-question.active:after {
        content: "-";
      }
      .faq-answer {
        padding: 15px;
        border-top: 1px solid var(--border-color);
        display: none;
      }
      .faq-answer.active {
        display: block;
      }
    </style>
    
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        // Add click event to FAQ questions
        const questions = document.querySelectorAll('.faq-question');
        questions.forEach(question => {
          question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            answer.classList.toggle('active');
          });
        });
      });
    </script>`;
  }

  // Generate HTML for Product Display
  function generateProductHTML() {
    const htmlContent = `
    <div class="dnp-container">
      <div class="product-header">
        <img class="product-image" src="${imageUrl}" alt="Product Image">
        <div class="product-title">
          <h3>${productTitle}</h3>
          <h2>${productName}</h2>
          <a href="${shopUrl}" class="shop-button">${shopButtonText}</a>
        </div>
      </div>
      
      <div class="pros-cons">
        <div class="pros">
          <h4>PROS</h4>
          <ul>
            ${pros.map(pro => `<li>${pro}</li>`).join('')}
          </ul>
        </div>
        <div class="cons">
          <h4>CONS</h4>
          <ul>
            ${cons.map(con => `<li>${con}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <table>
        ${specs.map(spec => 
          `<tr>
            <td>${spec.label}</td>
            <td>${spec.value}</td>
          </tr>`
        ).join('')}
      </table>
    </div>`;

    return sharedStyles ? getStyles() + htmlContent : htmlContent;
  }

  // Generate HTML for Pros Cons
  function generateProsConsHTML() {
    if (bulkMode) {
      // Parse bulk data
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
        <div class="pros-cons-standalone">
          <h3>${productName}</h3>
          <div class="pros-cons">
            <div class="pros">
              <h4>PROS</h4>
              <ul>
                ${prosItems.map(pro => `<li>${pro}</li>`).join('')}
              </ul>
            </div>
            <div class="cons">
              <h4>CONS</h4>
              <ul>
                ${consItems.map(con => `<li>${con}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>`;
      });
      
      return sharedStyles ? getStyles() + htmlContent : htmlContent;
    } else {
      // Generate from form data
      const htmlContent = `
      <div class="pros-cons-standalone">
        <h3>${prosConsTitle}</h3>
        <div class="pros-cons">
          <div class="pros">
            <h4>PROS</h4>
            <ul>
              ${prosOnly.map(pro => `<li>${pro}</li>`).join('')}
            </ul>
          </div>
          <div class="cons">
            <h4>CONS</h4>
            <ul>
              ${consOnly.map(con => `<li>${con}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>`;
      
      return sharedStyles ? getStyles() + htmlContent : htmlContent;
    }
  }

  // Generate HTML for FAQ
  function generateFaqHTML() {
    if (bulkMode) {
      // Parse bulk FAQ data
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
      <div class="faq-container">
        <h3>Frequently Asked Questions</h3>
        ${faqItems.map(faq => `
          <div class="faq-item">
            <div class="faq-question">${faq.question}</div>
            <div class="faq-answer">${faq.answer}</div>
          </div>
        `).join('')}
      </div>`;
      
      return sharedStyles ? getStyles() + htmlContent : htmlContent;
    } else {
      // Generate from form data
      const htmlContent = `
      <div class="faq-container">
        <h3>Frequently Asked Questions</h3>
        ${faqs.map(faq => `
          <div class="faq-item">
            <div class="faq-question">${faq.question}</div>
            <div class="faq-answer">${faq.answer}</div>
          </div>
        `).join('')}
      </div>`;
      
      return sharedStyles ? getStyles() + htmlContent : htmlContent;
    }
  }

  // Generate Schema HTML
  function generateSchemaHTML() {
    if (!schemaData) return '';
    
    const htmlContent = `
    <script type="application/ld+json">
      ${JSON.stringify(schemaData, null, 2)}
    </script>`;
    
    return htmlContent;
  }

  // Generate HTML based on active tab
  function generateHTML() {
    let htmlContent = '';
    
    switch (activeTab) {
      case 'product':
        htmlContent = generateProductHTML();
        break;
      case 'proscons':
        htmlContent = generateProsConsHTML();
        break;
      case 'faq':
        htmlContent = generateFaqHTML();
        break;
      case 'schema':
        htmlContent = generateSchemaHTML();
        break;
      default:
        htmlContent = '';
    }
    
    setGeneratedHTML(htmlContent);
  }
  
  // Handle schema fetching
  const handleFetchSchema = async () => {
    if (!schemaUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to extract schema from",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await extractSchema(schemaUrl);
      setSchemaData(result);
      toast({
        title: "Schema Generated",
        description: "Schema has been successfully generated from the URL"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate schema",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <Checkbox
                label="Bulk Mode"
                checked={bulkMode}
                onChange={() => setBulkMode(!bulkMode)}
              />
            )}
            {activeTab !== 'schema' && (
              <Checkbox
                label="Include CSS & JavaScript"
                checked={sharedStyles}
                onChange={() => setSharedStyles(!sharedStyles)}
                className="ml-auto"
              />
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
                handleFetchSchema={handleFetchSchema}
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
