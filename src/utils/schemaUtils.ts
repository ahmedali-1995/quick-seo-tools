
export interface SchemaResult {
  '@context': string;
  '@type': string;
  name?: string;
  description?: string;
  image?: string;
  mainEntity?: any[];
  // Add types for Product schema
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
  // Add other properties as needed
  [key: string]: any;
}
