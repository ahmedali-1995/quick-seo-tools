
import React, { useEffect, useState } from 'react';
// Use our custom dynamic import shim instead of next/dynamic
import dynamic from '@/lib/next-dynamic-shim';

// Dynamically import ForceGraph2D with SSR disabled
const ForceGraph2D = dynamic(
  () => import('react-force-graph-2d'),
  { ssr: false }
);

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
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    // Set isBrowser to true when component mounts on client side
    setIsBrowser(typeof window !== 'undefined');
  }, []);

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

  // If not in browser or schema data is empty, return fallback UI
  if (!isBrowser || graphData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground border rounded">
        {!graphData.nodes.length ? "No schema data to visualize." : "Loading visualization..."}
      </div>
    );
  }

  return (
    <div className="h-full w-full border rounded">
      {ForceGraph2D && (
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
      )}
    </div>
  );
};

export default SchemaVisualization;
