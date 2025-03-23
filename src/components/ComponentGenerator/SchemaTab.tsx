import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
//import { Button } from '@/components/ui/button';
import TextField from '../UI/TextField';
import { toast } from '@/components/ui/use-toast';
import { 
  Code as CodeIcon, 
  Edit as EditIcon, 
  Eye as EyeIcon, 
  Download as DownloadIcon,
  History as HistoryIcon,
  FileText as TemplateIcon,
  Bookmark as BookmarkIcon,
  Info as InfoIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Save as SaveIcon,
  FolderOpen as FolderOpenIcon,
  GitCompare as DiffIcon,
  CheckCircle as CheckCircleIcon,
  ArrowRight as ArrowRightIcon
} from 'lucide-react';

// Import our newly created components
import SchemaVisualization from './SchemaVisualization';
import SchemaTemplates from './SchemaTemplates';
import SchemaVersions from './SchemaVersions';

// Import our utilities
import { 
  extractSchema, 
  extractPageData, 
  mergeSchemaData, 
  validateSchema,
  getSchemaTemplate,
  SchemaResult
} from '@/utils/schemaUtils';

// Import necessary UI components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface SchemaTabProps {
  url: string;
  setUrl: (url: string) => void;
  schemaData: SchemaResult | null;
  setSchemaData: (data: SchemaResult | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const commonSchemaTypes = [
  { id: 'Product', name: 'Product' },
  { id: 'Article', name: 'Article' },
  { id: 'FAQPage', name: 'FAQ Page' },
  { id: 'LocalBusiness', name: 'Local Business' },
  { id: 'Review', name: 'Review' },
  { id: 'Recipe', name: 'Recipe' },
  { id: 'Event', name: 'Event' },
  { id: 'Person', name: 'Person' },
  { id: 'Organization', name: 'Organization' }
];

const SchemaTab: React.FC<SchemaTabProps> = ({
  url,
  setUrl,
  schemaData,
  setSchemaData,
  isLoading,
  setIsLoading
}) => {
  const [activeSchemaTab, setActiveSchemaTab] = useState<string>("view");
  const [validationResult, setValidationResult] = useState<{ valid: boolean, errors: string[] } | null>(null);
  
  // Load and extract data functions
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleFetchSchema = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to extract schema from",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await extractSchema(url);
      setSchemaData(result);
      setValidationResult(validateSchema(result));
      
      toast({
        title: "Schema Generated",
        description: "Schema has been successfully extracted from the URL"
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

  const extractDataFromPage = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to extract data from",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Extract data from the page
      const extractedData = await extractPageData(url);
      
      // If we don't have schema data yet, create a new one based on the type
      if (!schemaData) {
        if (extractedData['@type']) {
          const newSchema = getSchemaTemplate(extractedData['@type']);
          const mergedSchema = mergeSchemaData(newSchema, extractedData);
          setSchemaData(mergedSchema);
        } else {
          // No type detected, use a basic Product schema as default
          const newSchema = getSchemaTemplate('Product');
          const mergedSchema = mergeSchemaData(newSchema, extractedData);
          setSchemaData(mergedSchema);
        }
      } else {
        // Merge extracted data with existing schema
        const mergedSchema = mergeSchemaData(schemaData, extractedData);
        setSchemaData(mergedSchema);
      }
      
      toast({
        title: "Data Extracted",
        description: "Content data has been extracted from the page"
      });
    } catch (error) {
      toast({
        title: "Extraction Error",
        description: error instanceof Error ? error.message : "Failed to extract data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Schema editing functions
  const updateSchemaField = (path: string, value: any) => {
    if (!schemaData) return;
    
    const newSchema = { ...schemaData };
    
    // Split the path string into an array of keys
    const keys = path.split('.');
    let current = newSchema;
    
    // Navigate to the nested property
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      // Handle array indices in path
      if (key.includes('[') && key.includes(']')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
        current = current[arrayKey][index];
      } else {
        current = current[key];
      }
    }
    
    // Set the value at the final key
    const lastKey = keys[keys.length - 1];
    if (lastKey.includes('[') && lastKey.includes(']')) {
      const arrayKey = lastKey.substring(0, lastKey.indexOf('['));
      const index = parseInt(lastKey.substring(lastKey.indexOf('[') + 1, lastKey.indexOf(']')));
      current[arrayKey][index] = value;
    } else {
      current[lastKey] = value;
    }
    
    setSchemaData(newSchema);
    setValidationResult(validateSchema(newSchema));
  };

  // Add a new item to an array in the schema
  const addArrayItem = (path: string, defaultValue: any = "") => {
    if (!schemaData) return;
    
    const newSchema = { ...schemaData };
    
    // Split the path string into an array of keys
    const keys = path.split('.');
    let current = newSchema;
    
    // Navigate to the nested property
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // Handle array indices in path
      if (key.includes('[') && key.includes(']')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
        current = current[arrayKey][index];
      } else {
        current = current[key];
      }
    }
    
    // Add new item to the array
    if (Array.isArray(current)) {
      // Clone the last item if exists, otherwise use default value
      const newItem = current.length > 0 
        ? JSON.parse(JSON.stringify(current[current.length - 1])) 
        : defaultValue;
      
      current.push(newItem);
    }
    
    setSchemaData(newSchema);
    setValidationResult(validateSchema(newSchema));
  };

  // Remove an item from an array in the schema
  const removeArrayItem = (path: string, index: number) => {
    if (!schemaData) return;
    
    const newSchema = { ...schemaData };
    
    // Split the path string into an array of keys
    const keys = path.split('.');
    let current = newSchema;
    
    // Navigate to the nested property
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // Handle array indices in path
      if (key.includes('[') && key.includes(']')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
        current = current[arrayKey][index];
      } else {
        current = current[key];
      }
    }
    
    // Remove item from the array
    if (Array.isArray(current) && index >= 0 && index < current.length) {
      current.splice(index, 1);
    }
    
    setSchemaData(newSchema);
    setValidationResult(validateSchema(newSchema));
  };

  // Load schema from a predefined template
  const loadSchemaType = (schemaType: string) => {
    const newSchema = getSchemaTemplate(schemaType);
    setSchemaData(newSchema);
    setValidationResult(validateSchema(newSchema));
    
    toast({
      title: "Schema Type Loaded",
      description: `${schemaType} schema template has been loaded`
    });
  };

  // Render schema editor fields recursively
  const renderSchemaEditor = (obj: any, path = '') => {
    return Object.entries(obj).map(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (Array.isArray(value)) {
        return (
          <div key={currentPath} className="pl-4 border-l-2 border-gray-200 mb-4">
            <div className="font-medium text-primary mb-2 flex items-center justify-between">
              <span>{key}:</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addArrayItem(currentPath, {})}
                className="h-7 w-7 p-0"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            {value.map((item, index) => {
              if (typeof item === 'object' && item !== null) {
                return (
                  <div key={`${currentPath}[${index}]`} className="pl-4 border-l-2 border-gray-200 mb-2">
                    <div className="text-sm text-muted-foreground flex items-center justify-between">
                      <span>[{index}]</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeArrayItem(currentPath, index)}
                        className="h-6 w-6 p-0 text-red-500"
                      >
                        <MinusIcon className="h-3 w-3" />
                      </Button>
                    </div>
                    {renderSchemaEditor(item, `${currentPath}[${index}]`)}
                  </div>
                );
              } else {
                return (
                  <div key={`${currentPath}[${index}]`} className="pl-4 mb-2 flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">[{index}]:</span>
                    <TextField
                      value={item as string}
                      onChange={(e) => updateSchemaField(`${currentPath}[${index}]`, e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeArrayItem(currentPath, index)}
                      className="ml-2 h-8 w-8 p-0 text-red-500"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                );
              }
            })}
          </div>
        );
      } else if (typeof value === 'object' && value !== null) {
        return (
          <div key={currentPath} className="pl-4 border-l-2 border-gray-200 mb-4">
            <div className="font-medium text-primary mb-2">{key}:</div>
            {renderSchemaEditor(value, currentPath)}
          </div>
        );
      } else {
        return (
          <div key={currentPath} className="mb-3 flex items-center">
            <div className="min-w-[150px] font-medium">{key}:</div>
            <TextField
              value={value as string}
              onChange={(e) => updateSchemaField(currentPath, e.target.value)}
              className="flex-1"
            />
          </div>
        );
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <TextField
            label="URL"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://example.com"
            className="flex-1"
          />
          <div className="flex gap-2 self-end">
            <Button 
              className="whitespace-nowrap"
              disabled={isLoading || !url}
              onClick={handleFetchSchema}
            >
              {isLoading ? "Loading..." : "Generate Schema"}
            </Button>
            
            <Button 
              variant="outline"
              className="whitespace-nowrap flex items-center gap-2"
              disabled={isLoading || !url}
              onClick={extractDataFromPage}
            >
              <DownloadIcon className="h-4 w-4" />
              Extract Data
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select onValueChange={loadSchemaType}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select schema type" />
            </SelectTrigger>
            <SelectContent>
              {commonSchemaTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {validationResult && !validationResult.valid && (
        <Alert variant="destructive">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Validation Issues</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2">
              {validationResult.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {schemaData && (
        <div className="border rounded-lg overflow-hidden">
          <Tabs value={activeSchemaTab} onValueChange={setActiveSchemaTab} className="w-full">
            <div className="border-b px-3">
              <TabsList className="bg-transparent h-12">
                <TabsTrigger value="view" className="data-[state=active]:bg-transparent flex items-center">
                  <CodeIcon className="h-4 w-4 mr-2" />
                  View Schema
                </TabsTrigger>
                <TabsTrigger value="edit" className="data-[state=active]:bg-transparent flex items-center">
                  <EditIcon className="h-4 w-4 mr-2" />
                  Edit Schema
                </TabsTrigger>
                <TabsTrigger value="visualize" className="data-[state=active]:bg-transparent flex items-center">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Visualize
                </TabsTrigger>
                <TabsTrigger value="templates" className="data-[state=active]:bg-transparent flex items-center">
                  <TemplateIcon className="h-4 w-4 mr-2" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="versions" className="data-[state=active]:bg-transparent flex items-center">
                  <HistoryIcon className="h-4 w-4 mr-2" />
                  Versions
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="view" className="p-4 mt-0">
              <pre className="bg-secondary/30 p-4 rounded overflow-auto max-h-[400px] text-sm">
                {JSON.stringify(schemaData, null, 2)}
              </pre>
            </TabsContent>
            
            <TabsContent value="edit" className="p-4 mt-0">
              <div className="max-h-[400px] overflow-auto">
                {renderSchemaEditor(schemaData)}
              </div>
            </TabsContent>
            
            <TabsContent value="visualize" className="p-4 mt-0 h-[400px]">
              <SchemaVisualization schemaData={schemaData} />
            </TabsContent>
            
            <TabsContent value="templates" className="p-4 mt-0">
              <SchemaTemplates 
                onSelectTemplate={setSchemaData} 
                currentSchema={schemaData}
              />
            </TabsContent>
            
            <TabsContent value="versions" className="p-4 mt-0">
              <SchemaVersions 
                url={url}
                currentSchema={schemaData}
                onSelectVersion={setSchemaData}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default SchemaTab;
