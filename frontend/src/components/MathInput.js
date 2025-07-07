// MathInput.js
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MathfieldElement } from 'mathlive';
 
// Đăng ký custom element nếu chưa có
if (!customElements.get('math-field')) {
  customElements.define('math-field', MathfieldElement);
}
 
const MathInput = ({ value, onChange, editorRef }) => {
  const localEditorRef = useRef(null);
  const effectiveEditorRef = editorRef || localEditorRef;
  const [currentLatex, setCurrentLatex] = useState('');
 
  // Hàm cập nhật nội dung HTML có chèn LaTeX
  const updateContent = useCallback(() => {
    if (!effectiveEditorRef.current) return;
 
    const clone = effectiveEditorRef.current.cloneNode(true);
    clone.querySelectorAll('math-field').forEach((mf) => {
      try {
        const latex = mf.getValue()?.trim();
        if (latex) {
          mf.replaceWith(document.createTextNode(`$${latex}$`));
        } else {
          mf.remove(); // bỏ math-field rỗng
        }
      } catch {}
    });
 
    const html = clone.innerHTML.trim();
    onChange?.(html);
  }, [effectiveEditorRef, onChange]);
 
  // Hàm chèn một math-field vào vị trí con trỏ
  const insertMathField = () => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const range = sel.getRangeAt(0);
 
    const mathField = document.createElement('math-field');
    mathField.setAttribute('virtualkeyboardmode', 'onfocus');
    mathField.setAttribute('smartmode', 'true');
    mathField.setAttribute('usesharedvirtualkeyboard', 'true');
    mathField.setAttribute(
      'style',
      'border: 1px solid #ccc; border-radius: 4px; padding: 2px 6px; margin: 0 4px; font-size: 18px; display: inline-block; min-width: 60px;'
    );
 
    // Sự kiện khi người dùng nhấn Enter trong math-field
    mathField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        try {
          const latex = mathField.getValue()?.trim();
          if (latex) {
            const textNode = document.createTextNode(`$${latex}$`);
            mathField.replaceWith(textNode);
            setCurrentLatex(latex);
            updateContent();
          } else {
            mathField.remove(); // không sinh ra $$ nếu rỗng
          }
        } catch (err) {
          console.warn("Không thể lấy LaTeX:", err);
          mathField.remove();
        }
      }
    });
 
    // Chèn math-field vào DOM
    range.deleteContents();
    range.insertNode(mathField);
    range.setStartAfter(mathField);
    range.setEndAfter(mathField);
    sel.removeAllRanges();
    sel.addRange(range);
 
    // Tự động focus
    setTimeout(() => mathField.focus(), 0);
  };
 
  // Lắng nghe thay đổi nội dung của vùng editor
  useEffect(() => {
    const editor = effectiveEditorRef.current;
    if (!editor) return;
 
    editor.addEventListener('input', updateContent);
    return () => {
      editor.removeEventListener('input', updateContent);
    };
  }, [effectiveEditorRef, updateContent]);
 
  // Đồng bộ prop value → innerHTML
  useEffect(() => {
    if (effectiveEditorRef.current && value !== effectiveEditorRef.current.innerHTML) {
      effectiveEditorRef.current.innerHTML = value || '';
    }
  }, [value, effectiveEditorRef]);
 
  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button type="button" onClick={insertMathField}>➕ Math Equation</button>
      </div>
      <div
        ref={effectiveEditorRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          border: '1px solid #ccc',
          borderRadius: '6px',
          minHeight: '200px',
          padding: '10px',
          fontSize: '18px',
          lineHeight: 1.6,
          backgroundColor: '#fff',
          whiteSpace: 'pre-wrap',
          outline: 'none',
        }}
      />
      <div style={{ marginTop: 10, fontStyle: 'italic', color: '#555' }}>
        <strong>Mã LaTeX vừa nhập:</strong> <code>{currentLatex || '(chưa có)'}</code>
      </div>
    </div>
  );
};
 
export default MathInput;
 
 