
export interface SchemaResult {
  "@context": string;
  "@type": string;
  headline: string;
  description: string;
  url: string;
  "@id": string;
  author: {
    "@type": string;
    name: string;
    url: string;
  };
  publisher: {
    "@type": string;
    name: string;
    url: string;
    "@id": string;
  };
  about: Array<{
    "@type": string;
    name: string;
    "@id": string;
    sameAs: string[];
  }>;
  mainEntityOfPage: {
    "@type": string;
    url: string;
    "@id": string;
    significantLink: string[];
    relatedLink: string[];
    breadcrumb: {
      "@type": string;
      itemListElement: Array<{
        "@type": string;
        position: number;
        name: string;
        item: string;
      }>;
    };
  };
  articleSection: string;
  keywords: string[];
  isPartOf: {
    "@type": string;
    url: string;
    "@id": string;
  };
}

const extractTitleAndDescription = (html: string) => {
  // We need to use a different approach for server-side since DOMParser is browser-only
  try {
    // For browser environment
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract title
    const title = doc.querySelector('title')?.textContent || 
                  doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                  doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
                  'Untitled';

    // Extract description
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                       doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                       doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
                       'No description available';

    return { title, description };
  } catch (error) {
    console.error('Error parsing HTML:', error);
    return { title: 'Untitled', description: 'No description available' };
  }
};

export const extractSchema = async (url: string): Promise<SchemaResult> => {
  try {
    // Fetch the webpage content
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    
    if (!data.contents) {
      throw new Error('Failed to fetch webpage content');
    }

    // Extract title and description
    const { title, description } = extractTitleAndDescription(data.contents);
    
    console.log('Extracted title:', title);
    console.log('Extracted description:', description);

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "url": url,
      "@id": `${url}#Article`,
      "author": {
        "@type": "Organization",
        "name": "Sample Organization",
        "url": url
      },
      "publisher": {
        "@type": "Organization",
        "name": "Sample Organization",
        "url": url,
        "@id": `${url}#Organization`
      },
      "about": [
        {
          "@type": "Thing",
          "name": "sample topic",
          "@id": "https://www.wikidata.org/wiki/sample",
          "sameAs": [
            "https://en.wikipedia.org/wiki/sample",
            "https://www.google.com/search?kgmid=/sample"
          ]
        }
      ],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "url": url,
        "@id": `${url}#WebPage`,
        "significantLink": [url],
        "relatedLink": [`${url}/related`],
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": url
            }
          ]
        }
      },
      "articleSection": "Sample Section",
      "keywords": ["sample", "keywords"],
      "isPartOf": {
        "@type": "WebPage",
        "url": url,
        "@id": `${url}#WebPage`
      }
    };
  } catch (error) {
    console.error('Error extracting schema:', error);
    throw new Error('Failed to extract schema from URL');
  }
};
