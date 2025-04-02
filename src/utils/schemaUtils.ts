
import axios from 'axios';

export interface SchemaResult {
  "@context": string;
  "@type": string;
  name?: string;
  description?: string;
  image?: string;
  offers?: {
    "@type": string;
    price?: string;
    priceCurrency?: string;
    availability?: string;
    url?: string;
    [key: string]: any;
  };
  additionalProperty?: Array<{
    "@type": string;
    name: string;
    value: string;
    [key: string]: any;
  }>;
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
    
    // Use regex to find JSON-LD scripts since we can't use Cheerio on the client
    const jsonLdRegex = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    const matches = [...response.data.matchAll(jsonLdRegex)];
    
    if (matches.length === 0) {
      throw new Error("No JSON-LD schema found on the page");
    }
    
    // Parse the first schema script found
    try {
      const schemaText = matches[0][1];
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
    
    // Simplified extraction using regex since we can't use Cheerio on the client
    const extractedData: Record<string, any> = {};
    
    // Extract title
    const titleRegex = /<title>(.*?)<\/title>/i;
    const titleMatch = response.data.match(titleRegex);
    if (titleMatch && titleMatch[1]) {
      extractedData.name = titleMatch[1].trim();
    }
    
    // Extract description from meta tags
    const metaDescriptionRegex = /<meta\s+name="description"\s+content="([^"]*)"[^>]*>/i;
    const metaDescMatch = response.data.match(metaDescriptionRegex);
    if (metaDescMatch && metaDescMatch[1]) {
      extractedData.description = metaDescMatch[1];
    }
    
    // Extract OG image
    const ogImageRegex = /<meta\s+property="og:image"\s+content="([^"]*)"[^>]*>/i;
    const ogImageMatch = response.data.match(ogImageRegex);
    if (ogImageMatch && ogImageMatch[1]) {
      extractedData.image = ogImageMatch[1];
    }
    
    // Extract author
    const authorRegex = /<meta\s+name="author"\s+content="([^"]*)"[^>]*>/i;
    const authorMatch = response.data.match(authorRegex);
    if (authorMatch && authorMatch[1]) {
      extractedData.author = {
        "@type": "Person",
        "name": authorMatch[1]
      };
    }
    
    // Try to determine schema type based on URL
    if (url.includes('product')) {
      extractedData['@type'] = 'Product';
      
      // Look for price information
      const priceRegex = /\$\d+(\.\d{2})?/;
      const priceMatch = response.data.match(priceRegex);
      if (priceMatch && priceMatch[0]) {
        const price = priceMatch[0].replace('$', '');
        extractedData.offers = {
          "@type": "Offer",
          "price": price,
          "priceCurrency": "USD"
        };
      }
    } else if (url.includes('article') || url.includes('blog')) {
      extractedData['@type'] = 'Article';
      extractedData.headline = extractedData.name;
      
      // Extract published date
      const publishedRegex = /<meta\s+property="article:published_time"\s+content="([^"]*)"[^>]*>/i;
      const publishedMatch = response.data.match(publishedRegex);
      if (publishedMatch && publishedMatch[1]) {
        extractedData.datePublished = publishedMatch[1];
      }
    } else if (url.includes('faq')) {
      extractedData['@type'] = 'FAQPage';
      
      // Attempt to extract FAQs using regex (simplified)
      const faqs: any[] = [];
      const faqRegex = /<dt[^>]*>(.*?)<\/dt>\s*<dd[^>]*>(.*?)<\/dd>/gs;
      const faqMatches = [...response.data.matchAll(faqRegex)];
      
      faqMatches.forEach(match => {
        if (match[1] && match[2]) {
          faqs.push({
            "@type": "Question",
            "name": match[1].replace(/<[^>]*>/g, '').trim(),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": match[2].replace(/<[^>]*>/g, '').trim()
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
