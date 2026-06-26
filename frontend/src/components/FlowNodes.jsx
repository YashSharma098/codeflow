import { Handle, Position } from "reactflow";

const baseStyle = {
  fontFamily: "JetBrains Mono, monospace",
  fontSize: 11,
  fontWeight: 600,
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 14px",
  width: 170,
  minHeight: 50,
};

const TYPE_COLORS = {
  start:    { bg: "#1a1a2e", border: "#4a9eff", text: "#e0eaff" },
  end:      { bg: "#1a1a2e", border: "#4a9eff", text: "#e0eaff" },
  process:  { bg: "#0f1923", border: "#2d4a6e", text: "#8cb8e8" },
  decision: { bg: "#1a1200", border: "#c8940a", text: "#ffd166" },
  io:       { bg: "#0d1f1a", border: "#1d7a5a", text: "#5dcc9a" },
};


function NodeLabel({ label, sublabel, color }) {
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ background: color.border, width: 6, height: 6 }} />
      <span style={{ color: color.text }}>{label}</span>
      {sublabel && (
        <span style={{ color: color.text, opacity: 0.6, fontSize: 9, fontWeight: 400, marginTop: 2 }}>
          {sublabel}
        </span>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: color.border, width: 6, height: 6 }} />
    </>
  );
}


export function StartEndNode({ data }) {
  const color = TYPE_COLORS[data.type] || TYPE_COLORS.start;
  return (
    <div style={{
      ...baseStyle,
      background: color.bg,
      border: `1.5px solid ${color.border}`,
      borderRadius: 999,
    }}>
      <NodeLabel {...data} color={color} />
    </div>
  );
}

export function ProcessNode({ data }) {
  const color = TYPE_COLORS.process;
  return (
    <div style={{
      ...baseStyle,
      background: color.bg,
      border: `1.5px solid ${color.border}`,
      borderRadius: 8,
    }}>
      <NodeLabel {...data} color={color} />
    </div>
  );
}


export function IoNode({ data }) {
  const color = TYPE_COLORS.io;
  return (
    <div style={{
      ...baseStyle,
      background: color.bg,
      border: `1.5px solid ${color.border}`,
      borderRadius: 8,
      clipPath: "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)",
      width: 180,
    }}>
      <NodeLabel {...data} color={color} />
    </div>
  );
}

export function DecisionNode({ data }) {
  const color = TYPE_COLORS.decision;
  return (
    <div style={{ position: "relative", width: 170, height: 100 }}>
      <Handle type="target" position={Position.Top} style={{ background: color.border, width: 6, height: 6, left: "50%" }} />
      <div style={{
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "100%",
        background: color.bg,
        border: `1.5px solid ${color.border}`,
        transform: "rotate(45deg) scale(0.72)",
        borderRadius: 4,
      }} />
       <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "JetBrains Mono, monospace", fontSize: 10.5, fontWeight: 600,
        color: color.text, textAlign: "center", padding: "0 20px",
      }}>
        {data.label}
        {data.sublabel && (
          <span style={{ opacity: 0.6, fontSize: 9, fontWeight: 400, marginTop: 2 }}>{data.sublabel}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: color.border, width: 6, height: 6, left: "50%" }} />
      <Handle type="source" position={Position.Left} id="left" style={{ background: color.border, width: 6, height: 6, top: "50%" }} />
      <Handle type="source" position={Position.Right} id="right" style={{ background: color.border, width: 6, height: 6, top: "50%" }} />
    </div>
  );
}

export const nodeTypes = {
  start: StartEndNode,
  end: StartEndNode,
  process: ProcessNode,
  decision: DecisionNode,
  io: IoNode,
};