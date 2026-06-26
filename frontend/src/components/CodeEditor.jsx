import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, onChange, language }) {
  const monacoLang = {
    cpp: "cpp",
    python: "python",
    javascript: "javascript",
    java: "java",
  }[language] || "cpp";

  return (
    <div className="flex-1 overflow-hidden">
      <Editor
        height="100%"
        language={monacoLang}
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{
          fontSize: 13,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          renderLineHighlight: "none",
          fontFamily: "JetBrains Mono",
          padding: { top: 14 },
        }}
      />
    </div>
  );
}