import { useMemo } from "react";
import ReactFlow, { Background, Controls, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import { computeLayout } from "../utils/layout";
import { nodeTypes } from "./FlowNodes";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function buildFlowElements(data) {
  const { positions, backEdgeIds } = computeLayout(data.nodes, data.edges);

  const flowNodes = data.nodes.map(node => ({
    id: node.id,
    type: node.type,
    position: positions[node.id] || { x: 0, y: 0 },
    data: { label: node.label, sublabel: node.sublabel, type: node.type },
  }));

  const flowEdges = data.edges.map((edge, i) => {
    const isBack = backEdgeIds.has(`${edge.from}->${edge.to}`);
    return {
      id: `e${i}`,
      source: edge.from,
      target: edge.to,
      label: edge.label || "",
      type: isBack ? "step" : "smoothstep",
      animated: isBack,
      style: {
        stroke: isBack ? "#c8940a" : "#2d4a6e",
        strokeWidth: 1.5,
        strokeDasharray: isBack ? "5 4" : "none",
      },
      labelStyle: {
        fill: isBack ? "#c8940a" : "#4a9eff",
        fontSize: 10,
        fontFamily: "JetBrains Mono, monospace",
        fontWeight: 600,
      },
      labelBgStyle: { fill: "#070d14", fillOpacity: 0.85 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isBack ? "#c8940a" : "#4a9eff",
        width: 16,
        height: 16,
      },
    };
  });

  return { flowNodes, flowEdges };
}

export default function FlowCanvas({ data, loading, error, phase }) {
  const { flowNodes, flowEdges } = useMemo(() => {
    if (!data) return { flowNodes: [], flowEdges: [] };
    return buildFlowElements(data);
  }, [data]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-dark-500 border-t-accent rounded-full animate-spin" />
        <span className="text-dark-300 text-xs tracking-widest">{phase || "Generating…"}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="border border-red-900 bg-red-950/50 text-red-400 text-xs px-5 py-4 rounded-lg text-center leading-relaxed">
          ⚠ {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <span className="text-5xl opacity-10">⟨/⟩</span>
        <span className="text-dark-300 text-xs tracking-wider">
          Paste your code and hit Generate
        </span>
        <span className="text-dark-400 text-[10px]">
          Supports C++, Python, JavaScript, Java
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background color="#1a2a3a" gap={28} size={1} />
        <Controls
          showInteractive={false}
          style={{ button: { background: "#0f1923", color: "#8cb8e8", border: "1px solid #2d4a6e" } }}
        />
      </ReactFlow>
    </div>
  );
}