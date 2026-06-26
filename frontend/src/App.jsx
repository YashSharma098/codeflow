import { useState } from "react";
import axios from "axios";
import CodeEditor from "./components/CodeEditor";
import FlowCanvas from "./components/FlowCanvas";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DEFAULT_CODE = `#include<bits/stdc++.h>
using namespace std;

void solve() {
    int n; cin >> n;
    vector<int> v(n);
    for(int i = 0; i < n; i++) cin >> v[i];
    // your logic here
}

int main() {
    int t; cin >> t;
    while(t--) solve();
}`;

const LANGUAGES = [
  { value: "cpp",        label: "C++" },
  { value: "python",     label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java",       label: "Java" },
];

const PHASES = [
  "Parsing code…",
  "Tracing control flow…",
  "Building graph…",
  "Almost done…",
];

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("cpp");
  const [flowData, setFlowData] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [phase, setPhase]       = useState("");

  const handleGenerate = async () => {

    if (!code || code.trim().length === 0) {
      setError("No code provided");
      return;
    }

    setLoading(true);
    setError("");
    setFlowData(null);

    // Cycle through phases while waiting
    let pi = 0;
    setPhase(PHASES[0]);
    const ticker = setInterval(() => {
      pi = Math.min(pi + 1, PHASES.length - 1);
      setPhase(PHASES[pi]);
    }, 1200);

    try {
      const res = await axios.post(`${API_URL}/api/generate`, {
        code,
        language,
      });
      setFlowData(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to connect. Is the backend running?";
      setError(msg);
    } finally {
      clearInterval(ticker);
      setLoading(false);
      setPhase("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-dark-900 font-mono text-white">

      {/* ── Header ── */}
     <header className="flex items-center justify-between px-6 h-14 bg-dark-700 border-b border-dark-500 shrink-0 shadow-lg shadow-black/20">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="text-accent text-xl font-bold">{"</>"}</span>
          <span className="text-sm font-bold tracking-widest text-white">CodeFlow</span>
          <span className="text-[10px] bg-dark-500 text-accent px-2 py-0.5 rounded-full border border-dark-400">
            BETA
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="bg-dark-600 border border-dark-400 text-dark-100 text-xs px-3 py-2 rounded-md font-mono cursor-pointer outline-none hover:border-accent transition-colors"
          >
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-md text-xs font-bold tracking-widest border transition-all
              ${loading
                ? "bg-dark-500 border-dark-400 text-dark-300 cursor-not-allowed"
                : "bg-dark-600 border-accent text-accent hover:bg-accent hover:text-dark-900 hover:shadow-lg hover:shadow-accent/20 cursor-pointer active:scale-95"
              }`}
          >
            {loading ? (
              <>
                <span className="w-3 h-3 border border-dark-300 border-t-transparent rounded-full animate-spin" />
                {phase}
              </>
            ) : "▶  Generate"}
          </button>
        </div>
      </header>

      {/* ── Split Panel ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left — Code Editor */}
        <div className="w-[45%] flex flex-col border-r border-dark-500 bg-dark-800 shrink-0">
          <div className="flex items-center justify-between px-4 h-9 bg-dark-700 border-b border-dark-500">
            <span className="text-xs text-dark-200">
              {language === "cpp" ? "main.cpp"
               : language === "python" ? "main.py"
               : language === "javascript" ? "main.js"
               : "Main.java"}
            </span>
            <span className="text-[10px] text-dark-300 bg-dark-600 px-2 py-0.5 rounded">
              {LANGUAGES.find(l => l.value === language)?.label}
            </span>
          </div>
          <CodeEditor code={code} onChange={val => setCode(val)} language={language} />
        </div>

        {/* Right — Flowchart Canvas */}
        <div
          className="flex-1 flex flex-col bg-dark-900"
          style={{
            backgroundImage: "radial-gradient(circle, #1a2a3a33 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          <div className="flex items-center justify-between px-4 h-9 bg-dark-700/50 border-b border-dark-500 backdrop-blur-sm">
            <span className="text-xs text-dark-300">Flowchart Output</span>
            {flowData && (
              <span className="text-[10px] text-dark-300">
                {flowData.nodes.length} nodes · {flowData.edges.length} edges
              </span>
            )}
          </div>
          <FlowCanvas data={flowData} loading={loading} error={error} phase={phase}/>
        </div>

      </div>
    </div>
  );
}