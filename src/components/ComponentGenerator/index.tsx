import React, { useState } from 'react';
import TabButton from '../UI/TabButton';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import CodePreview from '../UI/CodePreview';
import ProductTab from './ProductTab';
import ProsConsTab from './ProsConsTab';
import FaqTab from './FaqTab';
import SchemaTab from './SchemaTab';
import TakeawayTab from './TakeawayTab';
import { SchemaResult } from '@/utils/schemaUtils';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface ExtendedSchemaResult extends SchemaResult {
  offers?: {
    "@type": string;
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  additionalProperty?: Array<{
    "@type": string;
    name: string;
    value: string;
  }>;
}

const ComponentGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('product');
  const [sharedStyles, setSharedStyles] = useState(true);
  const [bulkMode, setBulkMode] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [schemaUrl, setSchemaUrl] = useState('');
  const [schemaData, setSchemaData] = useState<ExtendedSchemaResult | null>(null);
  
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

  const [takeaways, setTakeaways] = useState([
    { 
      title: 'Research Note', 
      content: "The Women's Health Study found that women over 45 who took 600 IU of Vitamin E every other day had a 24% reduction in cardiovascular death risk, though overall heart disease rates were unchanged.", 
      type: 'research',
      icon: 'BookOpen'
    },
    { 
      title: 'Important Safety Notice', 
      content: "High-dose Vitamin E supplements (400 IU/day or more) should not be taken without medical supervision, especially if you take blood thinners, aspirin, or are scheduled for surgery.", 
      type: 'safety',
      icon: 'AlertTriangle'
    },
    { 
      title: 'Nutrition Tip', 
      content: "Since Vitamin E is fat-soluble, consuming it with some healthy fat improves absorption. Add olive oil to your spinach salad or eat nuts with your fruits to maximize nutrient uptake.", 
      type: 'tip',
      icon: 'Lightbulb'
    }
  ]);
  
  const [bulkTakeawayData, setBulkTakeawayData] = useState(
`Research Note
The Women's Health Study found that women over 45 who took 600 IU of Vitamin E every other day had a 24% reduction in cardiovascular death risk, though overall heart disease rates were unchanged.

Important Safety Notice
High-dose Vitamin E supplements (400 IU/day or more) should not be taken without medical supervision, especially if you take blood thinners, aspirin, or are scheduled for surgery.

Nutrition Tip
Since Vitamin E is fat-soluble, consuming it with some healthy fat improves absorption. Add olive oil to your spinach salad or eat nuts with your fruits to maximize nutrient uptake.`);

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
        border: '1px solid #e2e2e2',
        borderRadius: '12px',
        padding: '28px',
        marginBottom: '30px',
        boxShadow: '0 8px 24px rgba(90, 44, 130, 0.1)',
        backgroundColor: '#ffffff',
        maxWidth: '900px',
        margin: '0 auto'
      },
      faqContainerH3: {
        color: '#5a2c82',
        textAlign: 'center',
        marginTop: '0',
        marginBottom: '32px',
        fontSize: '28px',
        fontWeight: '700',
        letterSpacing: '-0.5px',
        borderBottom: '2px solid #efe5fa',
        paddingBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      },
      faqIcon: {
        width: '24px',
        height: '24px',
        fill: '#5a2c82'
      },
      faqItem: {
        marginBottom: '24px',
        border: '1px solid #e9e1f3',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(90, 44, 130, 0.06)',
        backgroundColor: '#ffffff',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        borderLeft: '4px solid #5a2c82'
      },
      faqQuestion: {
        backgroundColor: '#f9f6fc',
        padding: '20px 24px',
        fontWeight: '600',
        color: '#5a2c82',
        borderBottom: '1px solid #efe5fa',
        fontSize: '18px',
        lineHeight: '1.5',
        letterSpacing: '-0.2px',
        position: 'relative'
      },
      faqAnswer: {
        padding: '24px',
        lineHeight: '1.7',
        color: '#444',
        backgroundColor: '#ffffff',
        fontSize: '16px'
      },
      takeawayContainer: {
        padding: '0',
        margin: '20px 0',
        maxWidth: '900px'
      },
      researchNote: {
        backgroundColor: '#e0f2fe',
        borderLeft: '4px solid #0ea5e9',
        padding: '20px',
        margin: '15px 0',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      },
      safetyNotice: {
        backgroundColor: '#fef3c7',
        borderLeft: '4px solid #f59e0b',
        padding: '20px',
        margin: '15px 0',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      },
      nutritionTip: {
        backgroundColor: '#dcfce7',
        borderLeft: '4px solid #22c55e',
        padding: '20px',
        margin: '15px 0',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      },
      memoryAid: {
        backgroundColor: '#e0f2fe',
        borderLeft: '4px solid #3b82f6',
        padding: '20px',
        margin: '15px 0',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      },
      infoBox: {
        backgroundColor: '#f3e8ff',
        borderLeft: '4px solid #8b5cf6',
        padding: '20px',
        margin: '15px 0',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      },
      takeawayHeading: {
        display: 'flex',
        alignItems: 'center',
        fontWeight: '600',
        fontSize: '18px',
        marginBottom: '10px',
        color: '#333'
      },
      takeawayContent: {
        lineHeight: '1.6',
        fontSize: '16px',
        color: '#444'
      },
      iconWrapper: {
        display: 'inline-flex',
        marginRight: '10px'
      },
      iconBook: {
        width: '20px',
        height: '20px',
        color: '#0ea5e9'
      },
      iconAlert: {
        width: '20px',
        height: '20px',
        color: '#f59e0b'
      },
      iconBulb: {
        width: '20px',
        height: '20px',
        color: '#22c55e'
      },
      iconBrain: {
        width: '20px',
        height: '20px',
        color: '#3b82f6'
      },
      iconInfo: {
        width: '20px',
        height: '20px',
        color: '#8b5cf6'
      }
    };
  }

  function getFaqToggleScript() {
    return `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const questions = document.querySelectorAll('.faq-question');
        questions.forEach(question => {
          const answer = question.nextElementSibling;
          answer.style.display = 'block';
          
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
        <h3 style="${objectToInlineStyle(styles.faqContainerH3)}">
          <svg style="${objectToInlineStyle(styles.faqIcon)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-10h2v8h-2z" />
          </svg>
          Frequently Asked Questions
        </h3>
        ${faqItems.map((faq, index) => `
          <div style="${objectToInlineStyle(styles.faqItem)}">
            <div style="${objectToInlineStyle(styles.faqQuestion)}">
              ${faq.question}
            </div>
            <div style="${objectToInlineStyle(styles.faqAnswer)}">
              ${faq.answer}
            </div>
          </div>
        `).join('')}
      </div>`;
      
      return htmlContent;
    } else {
      const htmlContent = `
      <div style="${objectToInlineStyle(styles.faqContainer)}">
        <h3 style="${objectToInlineStyle(styles.faqContainerH3)}">
          <svg style="${objectToInlineStyle(styles.faqIcon)}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-10h2v8h-2z" />
          </svg>
          Frequently Asked Questions
        </h3>
        ${faqs.map((faq, index) => `
          <div style="${objectToInlineStyle(styles.faqItem)}">
            <div style="${objectToInlineStyle(styles.faqQuestion)}">
              ${faq.question}
            </div>
            <div style="${objectToInlineStyle(styles.faqAnswer)}">
              ${faq.answer}
            </div>
          </div>
        `).join('')}
      </div>`;
      
      return htmlContent;
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
    
    const productSchema: ExtendedSchemaResult = {
      ...schemaData,
      name: productName,
      description: productTitle,
      image: imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`,
    };
    
    if (productSchema['@type'] === 'Product') {
      const priceSpec = specs.find(spec => 
        spec.label.toLowerCase().includes('price') && 
        spec.value.includes('$')
      );
      
      if (priceSpec) {
        const priceMatch = priceSpec.value.match(/\$([0-9]+(\.[0-9]+)?)/);
        if (priceMatch && priceMatch[1]) {
          productSchema.offers = productSchema.offers || {
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
      productSchema.additionalProperty = productSchema.additionalProperty || [];
      
      specs.forEach(spec => {
        const existingPropIndex = productSchema.additionalProperty?.findIndex(prop => prop.name === spec.label);
        
        if (existingPropIndex === -1 || existingPropIndex === undefined) {
          productSchema.additionalProperty?.push({
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
    } else {
      return generateFaqHTML() + generateSchemaHTML();
    }
  }

  function generateTakeawayHTML() {
    const styles = getInlineStyles();
    
    const getTakeawayItems = () => {
      if (bulkMode) {
        return bulkTakeawayData.trim().split('\n\n').map(block => {
          const lines = block.trim().split('\n');
          const title = lines[0].trim();
          const content = lines.slice(1).join('\n').trim();
          
          let type = "info";
          
          if (title.toLowerCase().includes("research")) {
            type = "research";
          } else if (title.toLowerCase().includes("safety")) {
            type = "safety";
          } else if (title.toLowerCase().includes("tip")) {
            type = "tip";
          } else if (title.toLowerCase().includes("memory")) {
            type = "memory";
          }
          
          return { title, content, type };
        }).filter(item => item.title && item.content);
      } else {
        return takeaways;
      }
    };
    
    const takeawayItems = getTakeawayItems();
    
    const generateTakeawayIcon = (type: string) => {
      let iconSvg = '';
      let iconStyle = '';
      
      switch(type) {
        case 'research':
          iconStyle = objectToInlineStyle(styles.iconBook);
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="'+iconStyle+'"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>';
          break;
        case 'safety':
          iconStyle = objectToInlineStyle(styles.iconAlert);
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="'+iconStyle+'"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
          break;
        case 'tip':
          iconStyle = objectToInlineStyle(styles.iconBulb);
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="'+iconStyle+'"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>';
          break;
        case 'memory':
          iconStyle = objectToInlineStyle(styles.iconBrain);
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="'+iconStyle+'"><path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z"></path><path d="M16 8V4"></path><path d="M18 6h-4"></path><path d="M15 12h-3"></path><path d="M16 16h-4"></path><path d="M19 10a2 2 0 0 1 0 4"></path></svg>';
          break;
        default:
          iconStyle = objectToInlineStyle(styles.iconInfo);
          iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="'+iconStyle+'"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
      }
      
      return `<span style="${objectToInlineStyle(styles.iconWrapper)}">${iconSvg}</span>`;
    };
    
    const htmlContent = `
    <div style="${objectToInlineStyle(styles.takeawayContainer)}">
      ${takeawayItems.map(takeaway => {
        let boxStyle;
        
        switch(takeaway.type) {
          case 'research':
            boxStyle = styles.researchNote;
            break;
          case 'safety':
            boxStyle = styles.safetyNotice;
            break;
          case 'tip':
            boxStyle = styles.nutritionTip;
            break;
          case 'memory':
            boxStyle = styles.memoryAid;
            break;
          default:
            boxStyle = styles.infoBox;
        }
        
        return `
          <div style="${objectToInlineStyle(boxStyle)}">
            <h4 style="${objectToInlineStyle(styles.takeawayHeading)}">
              ${generateTakeawayIcon(takeaway.type)}
              ${takeaway.title}
            </h4>
            <div style="${objectToInlineStyle(styles.takeawayContent)}">
              ${takeaway.content}
            </div>
          </div>
        `;
      }).join('')}
    </div>`;
    
    return htmlContent;
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
      case 'takeaway':
        htmlContent = generateTakeawayHTML();
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
    const newSchema: ExtendedSchemaResult = {
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
          Create beautifully styled HTML components for product displays, pros & cons lists, FAQ accordions, takeaways, and Schema markup.
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
              active={activeTab === 'takeaway'}
              onClick={() => setActiveTab('takeaway')}
            >
              Takeaways
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
            
            {activeTab === 'takeaway' && (
              <TakeawayTab
                bulkMode={bulkMode}
                setBulkMode={setBulkMode}
                takeaways={takeaways}
                setTakeaways={setTakeaways}
                bulkTakeawayData={bulkTakeawayData}
                setBulkTakeawayData={setBulkTakeawayData}
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
