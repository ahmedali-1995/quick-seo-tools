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
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
//import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2, Edit, Download } from 'lucide-react';

interface SchemaTemplate {
  id: string;
  name: string;
  description: string;
  data: any;
  createdAt: string;
}

interface SchemaTemplatesProps {
  onSelectTemplate: (template: any) => void;
  currentSchema: any;
}

const SchemaTemplates: React.FC<SchemaTemplatesProps> = ({ 
  onSelectTemplate,
  currentSchema
}) => {
  const [templates, setTemplates] = useState<SchemaTemplate[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [currentTemplate, setCurrentTemplate] = useState<SchemaTemplate | null>(null);

  // Load templates from localStorage on component mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem('schemaTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('schemaTemplates', JSON.stringify(templates));
  }, [templates]);

  const handleCreateTemplate = () => {
    if (!templateName.trim()) {
      toast({
        title: "Template Name Required",
        description: "Please enter a name for your template",
        variant: "destructive"
      });
      return;
    }

    const newTemplate: SchemaTemplate = {
      id: `template-${Date.now()}`,
      name: templateName,
      description: templateDescription,
      data: currentSchema,
      createdAt: new Date().toISOString()
    };

    setTemplates([...templates, newTemplate]);
    setTemplateName('');
    setTemplateDescription('');
    setCreateDialogOpen(false);

    toast({
      title: "Template Saved",
      description: `Template "${templateName}" has been saved successfully`
    });
  };

  const handleEditTemplate = () => {
    if (!currentTemplate) return;

    if (!templateName.trim()) {
      toast({
        title: "Template Name Required",
        description: "Please enter a name for your template",
        variant: "destructive"
      });
      return;
    }

    const updatedTemplates = templates.map(template => 
      template.id === currentTemplate.id 
        ? { 
            ...template, 
            name: templateName, 
            description: templateDescription 
          } 
        : template
    );

    setTemplates(updatedTemplates);
    setEditDialogOpen(false);
    setCurrentTemplate(null);

    toast({
      title: "Template Updated",
      description: `Template "${templateName}" has been updated successfully`
    });
  };

  const handleDeleteTemplate = () => {
    if (!currentTemplate) return;

    const updatedTemplates = templates.filter(template => 
      template.id !== currentTemplate.id
    );

    setTemplates(updatedTemplates);
    setConfirmDeleteDialogOpen(false);
    setCurrentTemplate(null);

    toast({
      title: "Template Deleted",
      description: `Template "${currentTemplate.name}" has been deleted`
    });
  };

  const openEditDialog = (template: SchemaTemplate) => {
    setCurrentTemplate(template);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (template: SchemaTemplate) => {
    setCurrentTemplate(template);
    setConfirmDeleteDialogOpen(true);
  };

  const exportTemplate = (template: SchemaTemplate) => {
    const dataStr = JSON.stringify(template.data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `${template.name.replace(/\s+/g, '_')}_schema.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Saved Templates</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setTemplateName('');
            setTemplateDescription('');
            setCreateDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Save Current
        </Button>
      </div>

      {templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(template => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{template.name}</CardTitle>
                {template.description && (
                  <CardDescription className="text-xs line-clamp-2">
                    {template.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(template.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-muted/40 pt-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onSelectTemplate(template.data)}
                >
                  Use Template
                </Button>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => exportTemplate(template)}
                    title="Export Template"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(template)}
                    title="Edit Template"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(template)}
                    className="text-red-500 hover:text-red-600"
                    title="Delete Template"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No saved templates yet</p>
          <Button 
            variant="link" 
            onClick={() => {
              setTemplateName('');
              setTemplateDescription('');
              setCreateDialogOpen(true);
            }}
          >
            Create your first template
          </Button>
        </div>
      )}

      {/* Create Template Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
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
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="My Product Schema"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="templateDesc">Description (optional)</Label>
              <Textarea
                id="templateDesc"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="A template for product schemas"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update your template details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editTemplateName">Template Name</Label>
              <Input
                id="editTemplateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editTemplateDesc">Description (optional)</Label>
              <Textarea
                id="editTemplateDesc"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTemplate}>Update Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchemaTemplates;
