export interface SchemaResult {
  '@context': string;
  '@type': string;
  name?: string;
  description?: string;
  image?: string;
  mainEntity?: any[];
  offers?: {
    '@type': string;
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  additionalProperty?: Array<{
    '@type': string;
    name: string;
    value: string;
  }>;
  [key: string]: any;
}

/**
 * Extracts schema data from a URL
 */
export const extractSchema = async (url: string): Promise<SchemaResult> => {
  try {
    // In a real implementation, this would make an API call to fetch and parse the schema
    // For demo purposes, we'll return a basic schema
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': 'Sample Product',
      'description': 'This is a sample product description',
      'image': 'https://example.com/sample-image.jpg'
    };
  } catch (error) {
    console.error('Error extracting schema:', error);
    throw new Error('Failed to extract schema from URL');
  }
};

/**
 * Extracts page data (title, meta descriptions, images, etc.) from a URL
 */
export const extractPageData = async (url: string): Promise<Record<string, any>> => {
  try {
    // In a real implementation, this would make an API call to fetch and parse the page content
    // For demo purposes, we'll return sample data
    return {
      title: 'Sample Page Title',
      description: 'Sample page meta description',
      image: 'https://example.com/sample-image.jpg',
      price: '$99.99',
      availability: 'In Stock'
    };
  } catch (error) {
    console.error('Error extracting page data:', error);
    throw new Error('Failed to extract data from URL');
  }
};

/**
 * Merges existing schema data with new data
 */
export const mergeSchemaData = (
  existingSchema: SchemaResult,
  newData: Record<string, any>
): SchemaResult => {
  const mergedSchema = { ...existingSchema };

  // Map common fields
  if (newData.title && !mergedSchema.name) {
    mergedSchema.name = newData.title;
  }
  
  if (newData.description && !mergedSchema.description) {
    mergedSchema.description = newData.description;
  }
  
  if (newData.image && !mergedSchema.image) {
    mergedSchema.image = newData.image;
  }
  
  // Handle product-specific fields
  if (mergedSchema['@type'] === 'Product') {
    if (newData.price && !mergedSchema.offers) {
      const price = newData.price.replace(/[^\d.]/g, '');
      mergedSchema.offers = {
        '@type': 'Offer',
        'price': price,
        'priceCurrency': 'USD',
        'availability': newData.availability 
          ? `https://schema.org/${newData.availability.replace(/\s+/g, '')}`
          : 'https://schema.org/InStock',
        'url': newData.url || ''
      };
    }
  }
  
  return mergedSchema;
};

/**
 * Validates schema data
 */
export const validateSchema = (
  schema: SchemaResult | null
): { valid: boolean; errors: string[] } => {
  if (!schema) {
    return { valid: false, errors: ['Schema is empty'] };
  }
  
  const errors: string[] = [];
  
  if (!schema['@context']) {
    errors.push('Missing @context property');
  }
  
  if (!schema['@type']) {
    errors.push('Missing @type property');
  }
  
  // Validate based on schema type
  switch (schema['@type']) {
    case 'Product':
      if (!schema.name) {
        errors.push('Product schema should have a name');
      }
      break;
    case 'FAQPage':
      if (!schema.mainEntity || !Array.isArray(schema.mainEntity) || schema.mainEntity.length === 0) {
        errors.push('FAQPage schema should have at least one question in mainEntity');
      }
      break;
    // Add other schema type validations as needed
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Returns a template schema for a given type
 */
export const getSchemaTemplate = (type: string): SchemaResult => {
  switch (type) {
    case 'Product':
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': '',
        'description': '',
        'image': '',
        'offers': {
          '@type': 'Offer',
          'price': '',
          'priceCurrency': 'USD',
          'availability': 'https://schema.org/InStock',
          'url': ''
        }
      };
    case 'Article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': '',
        'description': '',
        'image': '',
        'datePublished': '',
        'author': {
          '@type': 'Person',
          'name': ''
        }
      };
    case 'FAQPage':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': '',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': ''
            }
          }
        ]
      };
    case 'LocalBusiness':
      return {
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
      };
    case 'Recipe':
      return {
        '@context': 'https://schema.org',
        '@type': 'Recipe',
        'name': '',
        'author': {
          '@type': 'Person',
          'name': ''
        },
        'image': '',
        'description': '',
        'recipeIngredient': [],
        'recipeInstructions': []
      };
    case 'Review':
      return {
        '@context': 'https://schema.org',
        '@type': 'Review',
        'itemReviewed': {
          '@type': 'Product',
          'name': ''
        },
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': '',
          'bestRating': '5'
        },
        'author': {
          '@type': 'Person',
          'name': ''
        }
      };
    case 'Event':
      return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        'name': '',
        'startDate': '',
        'endDate': '',
        'location': {
          '@type': 'Place',
          'name': '',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': '',
            'addressLocality': '',
            'addressRegion': '',
            'postalCode': '',
            'addressCountry': ''
          }
        }
      };
    case 'Person':
      return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': '',
        'jobTitle': '',
        'telephone': '',
        'email': '',
        'url': ''
      };
    case 'Organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': '',
        'url': '',
        'logo': '',
        'contactPoint': {
          '@type': 'ContactPoint',
          'telephone': '',
          'contactType': ''
        }
      };
    default:
      return {
        '@context': 'https://schema.org',
        '@type': type,
      };
  }
};
