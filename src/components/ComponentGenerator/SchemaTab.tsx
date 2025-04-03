
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
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
  ArrowRight as ArrowRightIcon,
  Upload as UploadIcon,
  FileJson as FileJsonIcon,
  Link as LinkIcon
} from 'lucide-react';

import SchemaVisualization from './SchemaVisualization';
import SchemaTemplates from './SchemaTemplates';
import SchemaVersions from './SchemaVersions';

import { 
  extractSchema, 
  extractPageData, 
  mergeSchemaData, 
  validateSchema,
  getSchemaTemplate,
  SchemaResult
} from '@/utils/schemaUtils';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";

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
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importSource, setImportSource] = useState<'json' | 'url'>('json');
  const [jsonInput, setJsonInput] = useState('');
  const [importUrl, setImportUrl] = useState('');
  const [customPropertyPath, setCustomPropertyPath] = useState('');
  const [customPropertyValue, setCustomPropertyValue] = useState('');
  const [customPropertyType, setCustomPropertyType] = useState<'string' | 'number' | 'boolean' | 'object' | 'array'>('string');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
      const extractedData = await extractPageData(url);
      
      if (!schemaData) {
        if (extractedData['@type']) {
          const newSchema = getSchemaTemplate(extractedData['@type']);
          const mergedSchema = mergeSchemaData(newSchema, extractedData);
          setSchemaData(mergedSchema);
        } else {
          const newSchema = getSchemaTemplate('Product');
          const mergedSchema = mergeSchemaData(newSchema, extractedData);
          setSchemaData(mergedSchema);
        }
      } else {
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

  const updateSchemaField = (path: string, value: any) => {
    if (!schemaData) return;
    
    const newSchema = { ...schemaData };
    
    const keys = path.split('.');
    let current = newSchema;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (key.includes('[') && key.includes(']')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
        
        // Initialize array if it doesn't exist
        if (!current[arrayKey]) {
          current[arrayKey] = [];
        }
        
        // Expand array if needed
        while (current[arrayKey].length <= index) {
          current[arrayKey].push({});
        }
        
        current = current[arrayKey][index];
      } else {
        // Initialize object if it doesn't exist
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
    }
    
    const lastKey = keys[keys.length - 1];
    if (lastKey.includes('[') && lastKey.includes(']')) {
      const arrayKey = lastKey.substring(0, lastKey.indexOf('['));
      const index = parseInt(lastKey.substring(lastKey.indexOf('[') + 1, lastKey.indexOf(']')));
      
      // Initialize array if it doesn't exist
      if (!current[arrayKey]) {
        current[arrayKey] = [];
      }
      
      // Expand array if needed
      while (current[arrayKey].length <= index) {
        current[arrayKey].push("");
      }
      
      current[arrayKey][index] = value;
    } else {
      current[lastKey] = value;
    }
    
    setSchemaData(newSchema);
    setValidationResult(validateSchema(newSchema));
  };

  const addArrayItem = (path: string, defaultValue: any = "") => {
    if (!schemaData) return;
    
    const newSchema = { ...schemaData };
    
    const keys = path.split('.');
    let current = newSchema;
    
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key.includes('[') && key.includes(']')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
        
        // Initialize array if it doesn't exist
        if (!current[arrayKey]) {
          current[arrayKey] = [];
        }
        
        // Expand array if needed
        while (current[arrayKey].length <= index) {
          current[arrayKey].push({});
        }
        
        current = current[arrayKey][index];
      } else {
        // Initialize object if it doesn't exist
        if (!current[key]) {
          current[key] = Array.isArray(defaultValue) ? [] : {};
        }
        current = current[key];
      }
    }
    
    if (Array.isArray(current)) {
      const newItem = current.length > 0 
        ? JSON.parse(JSON.stringify(current[current.length - 1])) 
        : defaultValue;
      
      current.push(newItem);
    }
    
    setSchemaData(newSchema);
    setValidationResult(validateSchema(newSchema));
  };

  const removeArrayItem = (path: string, index: number) => {
    if (!schemaData) return;
    
    const newSchema = { ...schemaData };
    
    const keys = path.split('.');
    let current = newSchema;
    
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key.includes('[') && key.includes(']')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
        current = current[arrayKey][index];
      } else {
        current = current[key];
      }
    }
    
    if (Array.isArray(current) && index >= 0 && index < current.length) {
      current.splice(index, 1);
    }
    
    setSchemaData(newSchema);
    setValidationResult(validateSchema(newSchema));
  };

  const loadSchemaType = (schemaType: string) => {
    const newSchema = getSchemaTemplate(schemaType);
    setSchemaData(newSchema);
    setValidationResult(validateSchema(newSchema));
    
    toast({
      title: "Schema Type Loaded",
      description: `${schemaType} schema template has been loaded`
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedSchema = JSON.parse(content);
        setSchemaData(parsedSchema);
        setValidationResult(validateSchema(parsedSchema));
        setImportModalOpen(false);
        
        toast({
          title: "Schema Imported",
          description: "Schema has been successfully imported from file"
        });
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse JSON file",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleJsonImport = () => {
    try {
      const parsedSchema = JSON.parse(jsonInput);
      setSchemaData(parsedSchema);
      setValidationResult(validateSchema(parsedSchema));
      setImportModalOpen(false);
      setJsonInput('');
      
      toast({
        title: "Schema Imported",
        description: "Schema has been successfully imported from JSON"
      });
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to parse JSON input",
        variant: "destructive"
      });
    }
  };

  const handleUrlImport = async () => {
    if (!importUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to import schema from",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await extractSchema(importUrl);
      setSchemaData(result);
      setValidationResult(validateSchema(result));
      setImportModalOpen(false);
      setImportUrl('');
      
      toast({
        title: "Schema Imported",
        description: "Schema has been successfully imported from URL"
      });
    } catch (error) {
      toast({
        title: "Import Error",
        description: error instanceof Error ? error.message : "Failed to import schema from URL",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a custom property at any specified path
  const addCustomProperty = () => {
    if (!schemaData || !customPropertyPath) return;

    let value: any = customPropertyValue;
    
    // Convert value based on selected type
    switch (customPropertyType) {
      case 'number':
        value = Number(customPropertyValue);
        break;
      case 'boolean':
        value = customPropertyValue.toLowerCase() === 'true';
        break;
      case 'object':
        try {
          value = JSON.parse(customPropertyValue);
        } catch (e) {
          value = {};
        }
        break;
      case 'array':
        try {
          value = JSON.parse(customPropertyValue);
        } catch (e) {
          value = [];
        }
        break;
    }
    
    updateSchemaField(customPropertyPath, value);
    setCustomPropertyPath('');
    setCustomPropertyValue('');
    
    toast({
      title: "Custom Property Added",
      description: `Property at ${customPropertyPath} has been added/updated`
    });
  };

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
                      value={String(item)}
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
              value={String(value)}
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
        
        <div className="flex gap-2 flex-wrap">
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
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setImportModalOpen(true)}
          >
            <UploadIcon className="h-4 w-4" />
            Import Schema
          </Button>
          
          <input 
            type="file" 
            ref={fileInputRef}
            accept=".json" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload}
          />
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
              <div className="mb-6 p-4 bg-primary/5 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Add Custom Property</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TextField
                    label="Property Path"
                    value={customPropertyPath}
                    onChange={(e) => setCustomPropertyPath(e.target.value)}
                    placeholder="e.g., author.name or offers.price"
                    className="col-span-1"
                  />
                  <div className="col-span-1">
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <Select 
                      value={customPropertyType} 
                      onValueChange={(value) => setCustomPropertyType(value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="object">Object</SelectItem>
                        <SelectItem value="array">Array</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <TextField
                    label="Value"
                    value={customPropertyValue}
                    onChange={(e) => setCustomPropertyValue(e.target.value)}
                    placeholder={customPropertyType === 'object' ? '{"key": "value"}' : 
                                customPropertyType === 'array' ? '["item1", "item2"]' : 
                                "Property value"}
                    className="col-span-1"
                  />
                </div>
                <Button 
                  className="mt-4"
                  onClick={addCustomProperty}
                  disabled={!customPropertyPath || !customPropertyValue}
                >
                  Add Property
                </Button>
              </div>
              
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
      
      {/* Import Schema Modal */}
      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Import Schema</DialogTitle>
            <DialogDescription>
              Import schema data from a JSON file, pasted JSON, or a URL.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Tabs defaultValue="json" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="json" onClick={() => setImportSource('json')}>
                  <FileJsonIcon className="h-4 w-4 mr-2" />
                  JSON
                </TabsTrigger>
                <TabsTrigger value="file">
                  <FolderOpenIcon className="h-4 w-4 mr-2" />
                  File Upload
                </TabsTrigger>
                <TabsTrigger value="url" onClick={() => setImportSource('url')}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  URL
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="json">
                <Textarea
                  placeholder="Paste JSON schema here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="h-[200px]"
                />
              </TabsContent>
              
              <TabsContent value="file" className="flex justify-center items-center h-[200px]">
                <Button onClick={() => fileInputRef.current?.click()}>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Select JSON File
                </Button>
              </TabsContent>
              
              <TabsContent value="url">
                <TextField
                  label="Schema URL"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="https://example.com/schema.json"
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={
                (importSource === 'json' && !jsonInput) || 
                (importSource === 'url' && !importUrl)
              }
              onClick={importSource === 'json' ? handleJsonImport : handleUrlImport}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchemaTab;
