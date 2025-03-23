import axios from 'axios';
import { load } from 'cheerio';

export interface SchemaResult {
  "@context": string;
  "@type": string;
  [key: string]: any;
}

/**
 * Extract JSON-LD schema from a URL
 * @param url The URL to extract schema from
 * @returns The extracted schema data
 */
export async function extractSchema(url: string): Promise<SchemaResult> {
  try {
    const response = await axios.get(url);
    const $ = load(response.data);
    
    // Find JSON-LD scripts
    const schemaScripts = $('script[type="application/ld+json"]');
    
    if (schemaScripts.length === 0) {
      throw new Error("No JSON-LD schema found on the page");
    }
    
    // Parse the first schema script found
    try {
      const schemaText = $(schemaScripts[0]).html();
      const schemaData = schemaText ? JSON.parse(schemaText) : null;
      
      if (!schemaData) {
        throw new Error("Empty schema data");
      }
      
      return schemaData;
    } catch (parseError) {
      throw new Error(`Failed to parse schema data: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch URL: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Extract data from a webpage to pre-populate schema fields
 * @param url The URL to extract data from
 * @returns Extracted data that can be merged with a schema
 */
export async function extractPageData(url: string): Promise<Record<string, any>> {
  try {
    const response = await axios.get(url);
    const $ = load(response.data);
    
    const extractedData: Record<string, any> = {
      name: $('h1').first().text().trim() || $('title').text().trim(),
    };
    
    // Extract description from meta tags
    const metaDescription = $('meta[name="description"]').attr('content');
    if (metaDescription) {
      extractedData.description = metaDescription;
    }
    
    // Extract image from og:image or first significant image
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) {
      extractedData.image = ogImage;
    } else {
      const images = $('img').filter((_, img) => {
        const src = $(img).attr('src');
        const width = parseInt($(img).attr('width') || '0', 10);
        const height = parseInt($(img).attr('height') || '0', 10);
        return src && !src.includes('icon') && !src.includes('logo') && (width > 100 || height > 100);
      });
      
      if (images.length > 0) {
        extractedData.image = $(images[0]).attr('src');
      }
    }
    
    // Extract author information
    const author = $('meta[name="author"]').attr('content') || 
                  $('.author').text().trim() || 
                  $('[rel="author"]').text().trim();
    
    if (author) {
      extractedData.author = {
        "@type": "Person",
        "name": author
      };
    }
    
    // Extract date published
    const publishedDate = $('meta[property="article:published_time"]').attr('content') ||
                         $('time').attr('datetime');
    
    if (publishedDate) {
      extractedData.datePublished = publishedDate;
    }
    
    // Try to determine schema type based on URL and content
    if (url.includes('product') || $('.product').length > 0 || $('[itemtype*="Product"]').length > 0) {
      extractedData['@type'] = 'Product';
      
      // Look for price information
      const priceText = $('.price').text().trim() || 
                      $('[itemprop="price"]').text().trim() ||
                      $('*:contains($)').text().match(/\$\d+(\.\d{2})?/);
      
      if (priceText) {
        let price = '';
        if (typeof priceText === 'string') {
          // Extract numbers from price text
          const match = priceText.match(/[\d.,]+/);
          price = match ? match[0] : '';
        } else if (priceText && priceText[0]) {
          price = priceText[0].replace('$', '');
        }
        
        if (price) {
          extractedData.offers = {
            "@type": "Offer",
            "price": price,
            "priceCurrency": "USD" // Default to USD
          };
        }
      }
    } else if (url.includes('article') || url.includes('blog') || $('article').length > 0) {
      extractedData['@type'] = 'Article';
      extractedData.headline = extractedData.name;
    } else if (url.includes('faq') || $('.faq').length > 0 || $('dt').length > 0) {
      extractedData['@type'] = 'FAQPage';
      
      // Try to extract FAQs
      const faqs: any[] = [];
      
      // Method 1: Look for dt/dd pairs
      $('dt').each((i, element) => {
        const question = $(element).text().trim();
        const answer = $(element).next('dd').text().trim();
        
        if (question && answer) {
          faqs.push({
            "@type": "Question",
            "name": question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": answer
            }
          });
        }
      });
      
      // Method 2: Look for common FAQ patterns
      $('.faq, .question, .q-and-a').each((i, element) => {
        const questionEl = $(element).find('.question, h3, strong, b').first();
        const answerEl = $(element).find('.answer, p').first();
        
        const question = questionEl.text().trim();
        const answer = answerEl.text().trim();
        
        if (question && answer) {
          faqs.push({
            "@type": "Question",
            "name": question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": answer
            }
          });
        }
      });
      
      if (faqs.length > 0) {
        extractedData.mainEntity = faqs;
      }
    }
    
    return extractedData;
  } catch (error) {
    console.error('Error extracting page data:', error);
    throw new Error(`Failed to extract data from page: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Merge extracted data with existing schema
 * @param schema Existing schema object
 * @param extractedData Data extracted from the page
 * @returns Merged schema object
 */
export function mergeSchemaData(schema: SchemaResult, extractedData: Record<string, any>): SchemaResult {
  const result = { ...schema };
  
  // Handle context and type if not present
  if (!result['@context']) {
    result['@context'] = 'https://schema.org';
  }
  
  if (!result['@type'] && extractedData['@type']) {
    result['@type'] = extractedData['@type'];
  }
  
  // Helper function to recursively merge objects
  const mergeObjects = (target: any, source: any) => {
    Object.keys(source).forEach(key => {
      // Skip @context and @type if already present
      if ((key === '@context' || key === '@type') && target[key]) {
        return;
      }
      
      // Handle arrays (like mainEntity in FAQPage)
      if (Array.isArray(source[key])) {
        if (!target[key]) {
          target[key] = [];
        }
        
        // Only add items if the array is empty
        if (target[key].length === 0) {
          target[key] = [...source[key]];
        }
        return;
      }
      
      // Handle nested objects
      if (source[key] !== null && typeof source[key] === 'object' && 
          target[key] !== null && typeof target[key] === 'object') {
        mergeObjects(target[key], source[key]);
        return;
      }
      
      // Only populate empty fields
      if (!target[key] || target[key] === '') {
        target[key] = source[key];
      }
    });
  };
  
  mergeObjects(result, extractedData);
  return result;
}

/**
 * Validate schema against Schema.org standards
 * In a real implementation, this would validate against a Schema.org validator
 */
export function validateSchema(schema: SchemaResult): { valid: boolean, errors: string[] } {
  const errors: string[] = [];
  
  // Basic validation checks
  if (!schema['@context']) {
    errors.push('Missing @context property');
  }
  
  if (!schema['@type']) {
    errors.push('Missing @type property');
  }
  
  // Type-specific validation
  switch (schema['@type']) {
    case 'Product':
      if (!schema.name) {
        errors.push('Products should have a name property');
      }
      break;
      
    case 'Article':
      if (!schema.headline) {
        errors.push('Articles should have a headline property');
      }
      break;
      
    case 'FAQPage':
      if (!schema.mainEntity || !Array.isArray(schema.mainEntity) || schema.mainEntity.length === 0) {
        errors.push('FAQPage should have a mainEntity array with at least one Question');
      }
      break;
      
    case 'LocalBusiness':
      if (!schema.name) {
        errors.push('LocalBusiness should have a name property');
      }
      if (!schema.address) {
        errors.push('LocalBusiness should have an address property');
      }
      break;
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get default schema template by type
 * @param type Schema type
 * @returns Default schema template
 */
export function getSchemaTemplate(type: string): SchemaResult {
  const templates: Record<string, SchemaResult> = {
    'Product': {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': '',
      'description': '',
      'image': '',
      'offers': {
        '@type': 'Offer',
        'price': '',
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock'
      }
    },
    'Article': {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': '',
      'author': {
        '@type': 'Person',
        'name': ''
      },
      'datePublished': '',
      'image': ''
    },
    'FAQPage': {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': []
    },
    'LocalBusiness': {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': '',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '',
        'addressLocality': '',
        'addressRegion': '',
        'postalCode': '',
        'addressCountry': ''
      },
      'telephone': '',
      'openingHours': ''
    },
    'Review': {
      '@context': 'https://schema.org',
      '@type': 'Review',
      'itemReviewed': {
        '@type': 'Product',
        'name': ''
      },
      'reviewRating': {
        '@type': 'Rating',
        'ratingValue': ''
      },
      'author': {
        '@type': 'Person',
        'name': ''
      }
    }
  };
  
  return templates[type] || {
    '@context': 'https://schema.org',
    '@type': type,
  };
}
