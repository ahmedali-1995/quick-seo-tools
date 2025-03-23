import React, { useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface Node {
  id: string;
  name: string;
  type: string;
  value: number;
}

interface Link {
  source: string;
  target: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface SchemaVisualizationProps {
  schemaData: any;
}

const SchemaVisualization: React.FC<SchemaVisualizationProps> = ({ schemaData }) => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  useEffect(() => {
    if (schemaData) {
      setGraphData(generateGraphData(schemaData));
    }
  }, [schemaData]);

  // Generate graph data from schema for visualization
  const generateGraphData = (data: any): GraphData => {
    const nodes: Node[] = [];
    const links: Link[] = [];
    
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
    
    return { nodes, links };
  };

  const getNodeColor = (node: Node) => {
    if (highlightedNode === node.id) {
      return "#ff9900"; // Highlight color
    }
    
    switch (node.type) {
      case "Schema Object":
        return "#5a2c82"; // Purple
      case "Property":
        return "#79b928"; // Green
      default:
        return "#4299e1"; // Blue
    }
  };

  // Fallback message if ForceGraph2D is not available (server-side rendering)
  if (typeof window === 'undefined') {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading visualization...
      </div>
    );
  }

  return (
    <div className="h-full w-full border rounded">
      {graphData.nodes.length > 0 ? (
        <ForceGraph2D
          graphData={graphData}
          nodeLabel={(node) => node.name}
          nodeColor={(node) => getNodeColor(node)}
          nodeRelSize={6}
          linkWidth={1}
          linkColor={() => "#999"}
          cooldownTicks={100}
          backgroundColor="#f9f6fc"
          onNodeHover={node => {
            setHighlightedNode(node ? node.id : null);
          }}
          onNodeClick={node => {
            // When a node is clicked, we could do something like showing its details
            console.log("Node clicked:", node);
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No schema data to visualize.
        </div>
      )}
    </div>
  );
};

export default SchemaVisualization;
