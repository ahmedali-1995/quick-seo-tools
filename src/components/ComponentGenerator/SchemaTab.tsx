
import React, { useState } from 'react';
import TextField from '../UI/TextField';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SchemaTabProps {
  url: string;
  setUrl: (url: string) => void;
  schemaData: any;
  setSchemaData: (data: any) => void;
  isLoading: boolean;
  handleFetchSchema: () => void;
}

const SchemaTab: React.FC<SchemaTabProps> = ({
  url,
  setUrl,
  schemaData,
  setSchemaData,
  isLoading,
  handleFetchSchema
}) => {
  const [activeSchemaTab, setActiveSchemaTab] = useState("view");
  
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

  const renderSchemaEditor = (obj: any, path = '') => {
    return Object.entries(obj).map(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (Array.isArray(value)) {
        return (
          <div key={currentPath} className="pl-4 border-l-2 border-gray-200 mb-4">
            <div className="font-medium text-primary mb-2">{key}:</div>
            {value.map((item, index) => {
              if (typeof item === 'object' && item !== null) {
                return (
                  <div key={`${currentPath}[${index}]`} className="pl-4 border-l-2 border-gray-200 mb-2">
                    <div className="text-sm text-muted-foreground">[{index}]</div>
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
      <div className="flex flex-col md:flex-row gap-4">
        <TextField
          label="URL"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://example.com"
          className="flex-1"
        />
        <Button 
          className="self-end whitespace-nowrap"
          disabled={isLoading || !url}
          onClick={handleFetchSchema}
        >
          {isLoading ? "Loading..." : "Generate Schema"}
        </Button>
      </div>
      
      {schemaData && (
        <div className="border rounded-lg overflow-hidden">
          <Tabs value={activeSchemaTab} onValueChange={setActiveSchemaTab} className="w-full">
            <div className="border-b px-3">
              <TabsList className="bg-transparent h-12">
                <TabsTrigger value="view" className="data-[state=active]:bg-transparent">
                  View Schema
                </TabsTrigger>
                <TabsTrigger value="edit" className="data-[state=active]:bg-transparent">
                  Edit Schema
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
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default SchemaTab;
