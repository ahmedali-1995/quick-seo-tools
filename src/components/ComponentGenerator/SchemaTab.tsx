import React, { useState, useEffect } from 'react';
import TextField from '../UI/TextField';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PlusIcon, MinusIcon, SaveIcon, FolderOpenIcon, CodeIcon, EyeIcon, VersionsIcon, ExtractIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ForceGraph2D } from 'react-force-graph';

interface SchemaTemplate {
  id: string;
  name: string;
  description: string;
  data: any;
  createdAt: string;
}

interface SchemaVersion {
  id: string;
  name: string;
  data: any;
  createdAt: string;
}

interface SchemaTabProps {
  url: string;
  setUrl: (url: string) => void;
  schemaData: any;
  setSchemaData: (data: any) => void;
  isLoading: boolean;
  handleFetchSchema: () => void;
}

const commonSchemaTypes = [
  { id: 'product', name: 'Product', template: { "@context": "https://schema.org", "@type": "Product", "name": "", "description": "", "image": "", "offers": { "@type": "Offer", "price": "", "priceCurrency": "USD" } } },
  { id: 'article', name: 'Article', template: { "@context": "https://schema.org", "@type": "Article", "headline": "", "author": { "@type": "Person", "name": "" }, "datePublished": "", "image": "" } },
  { id: 'faq', name: 'FAQ', template: { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [] } },
  { id: 'localBusiness', name: 'Local Business', template: { "@context": "https://schema.org", "@type": "LocalBusiness", "name": "", "address": { "@type": "PostalAddress", "streetAddress": "", "addressLocality": "", "addressRegion": "", "postalCode": "", "addressCountry": "" } } },
  { id: 'review', name: 'Review', template: { "@context": "https://schema.org", "@type": "Review", "itemReviewed": { "@type": "Product", "name": "" }, "reviewRating": { "@type": "Rating", "ratingValue": "" }, "author": { "@type": "Person", "name": "" } } },
];

const SchemaTab: React.FC<SchemaTabProps> = ({
  url,
  setUrl,
  schemaData,
  setSchemaData,
  isLoading,
  handleFetchSchema
}) => {
  const [activeSchemaTab, setActiveSchemaTab] = useState("view");
  const [templates, setTemplates] = useState<SchemaTemplate[]>([]);
  const [versions, setVersions] = useState<SchemaVersion[]>([]);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [versionName, setVersionName] = useState("");
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  
  // Load templates and versions from localStorage on component mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('schemaTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
    
    if (schemaData) {
      generateGraphData(schemaData);
    }
  }, []);

  useEffect(() => {
    if (schemaData) {
      generateGraphData(schemaData);
    }
  }, [schemaData]);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  
  const updateSchemaField = (path: string, value: any) => {
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
  };

  // Add a new item to an array in the schema
  const addArrayItem = (path: string, defaultValue: any = "") => {
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
  };

  // Remove an item from an array in the schema
  const removeArrayItem = (path: string, index: number) => {
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
  };

  // Save current schema as a template
  const saveTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({
        title: "Template Name Required",
        description: "Please enter a name for your template",
        variant: "destructive"
      });
      return;
    }
    
    const newTemplate: SchemaTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplateName,
      description: newTemplateDesc,
      data: schemaData,
      createdAt: new Date().toISOString()
    };
    
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('schemaTemplates', JSON.stringify(updatedTemplates));
    
    setNewTemplateName("");
    setNewTemplateDesc("");
    setTemplateDialogOpen(false);
    
    toast({
      title: "Template Saved",
      description: `Template "${newTemplateName}" has been saved successfully`
    });
  };

  // Load a template
  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSchemaData(template.data);
      toast({
        title: "Template Loaded",
        description: `Template "${template.name}" has been loaded successfully`
      });
    }
  };

  // Save current schema as a version
  const saveVersion = () => {
    if (!versionName.trim()) {
      toast({
        title: "Version Name Required",
        description: "Please enter a name for your version",
        variant: "destructive"
      });
      return;
    }
    
    const newVersion: SchemaVersion = {
      id: `version-${Date.now()}`,
      name: versionName,
      data: schemaData,
      createdAt: new Date().toISOString()
    };
    
    const updatedVersions = [...versions, newVersion];
    setVersions(updatedVersions);
    localStorage.setItem(`schemaVersions-${url}`, JSON.stringify(updatedVersions));
    
    setVersionName("");
    setVersionDialogOpen(false);
    
    toast({
      title: "Version Saved",
      description: `Version "${versionName}" has been saved successfully`
    });
  };

  // Load a version
  const loadVersion = (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      setSchemaData(version.data);
      toast({
        title: "Version Loaded",
        description: `Version "${version.name}" has been loaded successfully`
      });
    }
  };

  // Load versions for the current URL
  useEffect(() => {
    if (url) {
      const savedVersions = localStorage.getItem(`schemaVersions-${url}`);
      if (savedVersions) {
        setVersions(JSON.parse(savedVersions));
      } else {
        setVersions([]);
      }
    }
  }, [url]);

  // Extract data from the page content to populate schema
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
      // This would be implemented to call a backend service
      // For now, we'll simulate extracting some data
      const result = await simulateExtractData(url);
      
      // Merge the extracted data with existing schema
      const updatedSchema = mergeData(schemaData, result);
      setSchemaData(updatedSchema);
      
      toast({
        title: "Data Extracted",
        description: "Content data has been extracted and merged with schema"
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

  // Simulate extracting data from page
  const simulateExtractData = async (url: string) => {
    // This would call a backend API in a real implementation
    // For now, we'll return mock data based on the URL
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.includes('product') || url.includes('amazon')) {
          resolve({
            name: "Sample Product",
            description: "This is a sample product extracted from the page",
            offers: {
              price: "19.99"
            }
          });
        } else if (url.includes('article') || url.includes('blog')) {
          resolve({
            headline: "Sample Article Title",
            author: {
              name: "John Doe"
            },
            datePublished: new Date().toISOString().split('T')[0]
          });
        } else {
          resolve({
            name: "Extracted Title",
            description: "Extracted description from the webpage"
          });
        }
      }, 1000);
    });
  };

  // Merge extracted data with existing schema
  const mergeData = (schema: any, extractedData: any) => {
    const newSchema = { ...schema };
    
    // Recursively merge properties
    Object.entries(extractedData).forEach(([key, value]) => {
      if (newSchema.hasOwnProperty(key)) {
        if (typeof value === 'object' && value !== null && typeof newSchema[key] === 'object' && newSchema[key] !== null) {
          // Recursively merge nested objects
          newSchema[key] = mergeData(newSchema[key], value);
        } else if (newSchema[key] === "" || newSchema[key] === null) {
          // Only overwrite if target field is empty
          newSchema[key] = value;
        }
      }
    });
    
    return newSchema;
  };

  // Load schema from a predefined template
  const loadSchemaType = (schemaType: string) => {
    const selectedType = commonSchemaTypes.find(type => type.id === schemaType);
    if (selectedType) {
      setSchemaData(selectedType.template);
      toast({
        title: "Schema Type Loaded",
        description: `${selectedType.name} schema template has been loaded`
      });
    }
  };

  // Generate graph data from schema for visualization
  const generateGraphData = (data: any) => {
    const nodes: any[] = [];
    const links: any[] = [];
    
    // Helper function to recursively process schema
    const processNode = (obj: any, parentId: string | null = null, path = "") => {
      if (!obj || typeof obj !== 'object') return;
      
      // Handle arrays
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            const nodeId = `${path}[${index}]`;
            const nodeType = item["@type"] || "Array Item";
            nodes.push({ id: nodeId, name: `${nodeType} ${index}`, type: nodeType, value: 1 });
            
            if (parentId) {
              links.push({ source: parentId, target: nodeId });
            }
            
            processNode(item, nodeId, `${path}[${index}]`);
          }
        });
        return;
      }
      
      // Process object
      const type = obj["@type"] || obj["@context"] ? "Schema Object" : "Object";
      const name = obj.name || obj.headline || obj["@type"] || path || "Root";
      const nodeId = path || "root";
      
      // Add node if it doesn't exist
      if (!nodes.some(n => n.id === nodeId)) {
        nodes.push({ id: nodeId, name, type, value: 1 });
        
        if (parentId) {
          links.push({ source: parentId, target: nodeId });
        }
      }
      
      // Process properties
      Object.entries(obj).forEach(([key, value]) => {
        if (key.startsWith('@')) return; // Skip @context and @type
        
        if (typeof value === 'object' && value !== null) {
          const childPath = path ? `${path}.${key}` : key;
          const childNodeId = childPath;
          
          processNode(value, nodeId, childPath);
        } else if (value) {
          // For primitive values, create a leaf node
          const childPath = path ? `${path}.${key}` : key;
          const childNodeId = childPath;
          nodes.push({ id: childNodeId, name: `${key}: ${value}`, type: "Property", value: 0.5 });
          links.push({ source: nodeId, target: childNodeId });
        }
      });
    };
    
    processNode(data);
    
    setGraphData({ nodes, links });
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
      <div className="flex gap-2 mb-4">
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
        
        <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SaveIcon className="h-4 w-4" />
              Save Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Schema Template</DialogTitle>
              <DialogDescription>
                Save your current schema as a template for future use.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="My Product Schema"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="templateDesc">Description (optional)</Label>
                <Input
                  id="templateDesc"
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                  placeholder="A template for product schemas"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveTemplate}>Save Template</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <FolderOpenIcon className="h-4 w-4" />
              Load Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Load Schema Template</DialogTitle>
              <DialogDescription>
                Choose a saved template to load.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {templates.length > 0 ? (
                templates.map(template => (
                  <Card key={template.id} className="cursor-pointer hover:bg-secondary/50" onClick={() => loadTemplate(template.id)}>
                    <CardContent className="p-4">
                      <div className="font-medium">{template.name}</div>
                      {template.description && (
                        <div className="text-sm text-muted-foreground">{template.description}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">No saved templates found.</div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={versionDialogOpen} onOpenChange={setVersionDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <VersionsIcon className="h-4 w-4" />
              Save Version
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Schema Version</DialogTitle>
              <DialogDescription>
                Save the current state as a version for this URL.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="versionName">Version Name</Label>
                <Input
                  id="versionName"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder="v1.0"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveVersion}>Save Version</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CodeIcon className="h-4 w-4" />
              Load Version
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Load Schema Version</DialogTitle>
              <DialogDescription>
                Choose a saved version to load.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {versions.length > 0 ? (
                versions.map(version => (
                  <Card key={version.id} className="cursor-pointer hover:bg-secondary/50" onClick={() => loadVersion(version.id)}>
                    <CardContent className="p-4">
                      <div className="font-medium">{version.name}</div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {new Date(version.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">No saved versions found for this URL.</div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <TextField
          label="URL"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://example.com"
          className="flex-1"
        />
        <div className="flex gap-2">
          <Button 
            className="self-end whitespace-nowrap"
            disabled={isLoading || !url}
            onClick={handleFetchSchema}
          >
            {isLoading ? "Loading..." : "Generate Schema"}
          </Button>
          
          <Button 
            variant="outline"
            className="self-end whitespace-nowrap flex items-center gap-2"
            disabled={isLoading || !url}
            onClick={extractDataFromPage}
          >
            <ExtractIcon className="h-4 w-4" />
            Extract Data
          </Button>
        </div>
      </div>
      
      {schemaData && (
        <div className="border rounded-lg overflow-hidden">
          <Tabs value={activeSchemaTab} onValueChange={setActiveSchemaTab} className="w-full">
            <div className="border-b px-3">
              <TabsList className="bg-transparent h-12">
                <TabsTrigger value="view" className="data-[state=active]:bg-transparent">
                  <CodeIcon className="h-4 w-4 mr-2" />
                  View Schema
                </TabsTrigger>
                <TabsTrigger value="edit" className="data-[state=active]:bg-transparent">
                  Edit Schema
                </TabsTrigger>
                <TabsTrigger value="visualize" className="data-[state=active]:bg-transparent">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Visualize
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
              {graphData.nodes.length > 0 ? (
                <div className="h-full w-full border rounded">
                  <ForceGraph2D
                    graphData={graphData}
                    nodeLabel={node => node.name}
                    nodeColor={node => {
                      if (node.type === "Schema Object") return "#5a2c82"; // Purple
                      if (node.type === "Property") return "#79b928"; // Green
                      return "#4299e1"; // Blue
                    }}
                    nodeRelSize={6}
                    linkWidth={1}
                    linkColor={() => "#999"}
                    cooldownTicks={100}
                    backgroundColor="#f9f6fc"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No schema data to visualize.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default SchemaTab;
