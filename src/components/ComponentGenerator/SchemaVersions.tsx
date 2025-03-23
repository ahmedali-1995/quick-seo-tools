import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { PlusIcon, Trash2Icon, HistoryIcon, CheckCircleIcon, ArrowRightIcon, DiffIcon } from 'lucide-react';
import { format } from 'date-fns';

interface SchemaVersion {
  id: string;
  name: string;
  data: any;
  createdAt: string;
  notes?: string;
}

interface SchemaVersionsProps {
  url: string;
  currentSchema: any;
  onSelectVersion: (version: any) => void;
}

const SchemaVersions: React.FC<SchemaVersionsProps> = ({ 
  url,
  currentSchema, 
  onSelectVersion
}) => {
  const [versions, setVersions] = useState<SchemaVersion[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [diffViewDialogOpen, setDiffViewDialogOpen] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [versionNotes, setVersionNotes] = useState('');
  const [currentVersion, setCurrentVersion] = useState<SchemaVersion | null>(null);
  const [compareVersion, setCompareVersion] = useState<SchemaVersion | null>(null);
  const [diffResult, setDiffResult] = useState<string>('');

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

  // Save versions to localStorage whenever they change
  useEffect(() => {
    if (url && versions.length > 0) {
      localStorage.setItem(`schemaVersions-${url}`, JSON.stringify(versions));
    }
  }, [versions, url]);

  const handleCreateVersion = () => {
    if (!versionName.trim()) {
      toast({
        title: "Version Name Required",
        description: "Please enter a name for this version",
        variant: "destructive"
      });
      return;
    }

    const newVersion: SchemaVersion = {
      id: `version-${Date.now()}`,
      name: versionName,
      data: currentSchema,
      createdAt: new Date().toISOString(),
      notes: versionNotes
    };

    setVersions([...versions, newVersion]);
    setVersionName('');
    setVersionNotes('');
    setCreateDialogOpen(false);

    toast({
      title: "Version Saved",
      description: `Version "${versionName}" has been saved successfully`
    });
  };

  const handleDeleteVersion = () => {
    if (!currentVersion) return;

    const updatedVersions = versions.filter(version => 
      version.id !== currentVersion.id
    );

    setVersions(updatedVersions);
    setConfirmDeleteDialogOpen(false);
    setCurrentVersion(null);

    toast({
      title: "Version Deleted",
      description: `Version "${currentVersion.name}" has been deleted`
    });
  };

  const openDeleteDialog = (version: SchemaVersion) => {
    setCurrentVersion(version);
    setConfirmDeleteDialogOpen(true);
  };

  const openDiffView = (version: SchemaVersion) => {
    setCurrentVersion(version);
    
    // If there's only one version, compare with current schema
    if (versions.length === 1) {
      setCompareVersion(null);
      setDiffResult(generateDiff(version.data, currentSchema));
    } else {
      // Find the next version or the current schema if this is the latest
      const versionIndex = versions.findIndex(v => v.id === version.id);
      if (versionIndex === versions.length - 1) {
        // This is the latest version, compare with current schema
        setCompareVersion(null);
        setDiffResult(generateDiff(version.data, currentSchema));
      } else {
        // Compare with the next version
        const nextVersion = versions[versionIndex + 1];
        setCompareVersion(nextVersion);
        setDiffResult(generateDiff(version.data, nextVersion.data));
      }
    }
    
    setDiffViewDialogOpen(true);
  };

  // Generate a readable diff between two schema objects
  const generateDiff = (oldSchema: any, newSchema: any): string => {
    let diff = '';
    
    // Function to recursively find differences
    const findDiff = (oldObj: any, newObj: any, path = '') => {
      // If types are different or one is missing, return entire object
      if (typeof oldObj !== typeof newObj || 
          (oldObj === null && newObj !== null) || 
          (oldObj !== null && newObj === null)) {
        diff += `${path}: ${JSON.stringify(oldObj)} → ${JSON.stringify(newObj)}\n`;
        return;
      }
      
      // Handle different primitive types
      if (typeof oldObj !== 'object' || oldObj === null) {
        if (oldObj !== newObj) {
          diff += `${path}: ${JSON.stringify(oldObj)} → ${JSON.stringify(newObj)}\n`;
        }
        return;
      }
      
      // Handle arrays
      if (Array.isArray(oldObj) && Array.isArray(newObj)) {
        if (oldObj.length !== newObj.length) {
          diff += `${path}: Array length changed from ${oldObj.length} to ${newObj.length}\n`;
        }
        
        // Compare elements
        const maxLength = Math.max(oldObj.length, newObj.length);
        for (let i = 0; i < maxLength; i++) {
          if (i >= oldObj.length) {
            diff += `${path}[${i}]: <added> ${JSON.stringify(newObj[i])}\n`;
          } else if (i >= newObj.length) {
            diff += `${path}[${i}]: <removed> ${JSON.stringify(oldObj[i])}\n`;
          } else {
            findDiff(oldObj[i], newObj[i], `${path}[${i}]`);
          }
        }
        
        return;
      }
      
      // For objects, compare properties
      const allProps = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
      
      for (const prop of allProps) {
        const propPath = path ? `${path}.${prop}` : prop;
        
        if (!(prop in oldObj)) {
          diff += `${propPath}: <added> ${JSON.stringify(newObj[prop])}\n`;
        } else if (!(prop in newObj)) {
          diff += `${propPath}: <removed> ${JSON.stringify(oldObj[prop])}\n`;
        } else {
          findDiff(oldObj[prop], newObj[prop], propPath);
        }
      }
    };
    
    findDiff(oldSchema, newSchema);
    
    return diff || "No differences found";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Version History</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setVersionName(`v${versions.length + 1}`);
            setVersionNotes('');
            setCreateDialogOpen(true);
          }}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Save Version
        </Button>
      </div>

      {versions.length > 0 ? (
        <div className="space-y-3">
          {versions.map((version, index) => (
            <Card key={version.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <HistoryIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  {version.name}
                  {index === versions.length - 1 && (
                    <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Latest</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs text-muted-foreground">
                  Created: {format(new Date(version.createdAt), 'PPpp')}
                </div>
                {version.notes && (
                  <div className="text-sm mt-2 italic">
                    "{version.notes}"
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between bg-muted/40 pt-2">
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onSelectVersion(version.data)}
                    className="flex items-center"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Restore
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDiffView(version)}
                    className="flex items-center"
                  >
                    <DiffIcon className="h-4 w-4 mr-1" />
                    View Changes
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDeleteDialog(version)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No version history for this URL</p>
          <Button 
            variant="link" 
            onClick={() => {
              setVersionName("v1");
              setVersionNotes('');
              setCreateDialogOpen(true);
            }}
          >
            Create your first version
          </Button>
        </div>
      )}

      {/* Create Version Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
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
            <div className="grid gap-2">
              <Label htmlFor="versionNotes">Notes (optional)</Label>
              <Input
                id="versionNotes"
                value={versionNotes}
                onChange={(e) => setVersionNotes(e.target.value)}
                placeholder="Added product offers"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateVersion}>Save Version</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Version</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this version? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteVersion}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diff View Dialog */}
      <Dialog open={diffViewDialogOpen} onOpenChange={setDiffViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Schema Changes</DialogTitle>
            <DialogDescription>
              {currentVersion && compareVersion ? 
                `Changes from ${currentVersion.name} to ${compareVersion.name}` :
                currentVersion ? 
                  `Changes from ${currentVersion.name} to current schema` :
                  'Schema Comparison'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
              <pre className="whitespace-pre-wrap font-mono text-xs">
                {diffResult}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDiffViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchemaVersions;
