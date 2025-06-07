import React, { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

// Hàm tách văn bản và công thức
function renderWithLatex(input) {
  const parts = input.split(/(\${1,2}[^$]+\${1,2})/g);

  return parts.map((part, index) => {
    const match = part.match(/^(\${1,2})([^$]+)\1$/);
    if (match) {
      const delimiter = match[1];
      const content = match[2];
      if (delimiter === "$$") {
        return (
          <div key={index} style={{ textAlign: "center", margin: "10px 0" }}>
            <BlockMath math={content} />
          </div>
        );
      } else {
        return <InlineMath key={index} math={content} />;
      }
    } else {
      return <span key={index}>{part}</span>;
    }
  });
}

export default function LatexInputKaTeX({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value || "");

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    onChange(val);
  };

  return (
    <div style={{ marginBottom: "15px", width: "100%" }}>
      <textarea
        value={localValue}
        onChange={handleChange}
        rows={5}
        style={{
          width: "100%",
          padding: "8px",
          fontFamily: "monospace",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxSizing: "border-box"
        }}
        placeholder="Nhập văn bản LaTeX của bạn"
      />
      <div
        style={{
          marginTop: "10px",
          background: "#f8f8f8",
          padding: "10px",
          minHeight: "40px",
          border: "1px solid #eee",
          borderRadius: "4px",

          whiteSpace: "normal",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          maxWidth: "100%",
        }}
      >
        {renderWithLatex(localValue)}
      </div>

    </div>
  );

}
export { renderWithLatex };
