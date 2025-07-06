import React, { useRef, useEffect } from 'react';
import 'mathlive';

const MathInput = ({ value, onChange }) => {
  const editorRef = useRef(null);

  // Thêm math-field mới vào vị trí con trỏ
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
    mathField.setValue?.('\\sqrt{x}'); // Gợi ý mặc định (tuỳ bạn)

    const spacer = document.createElement('span');
    spacer.innerHTML = '\u00A0';

    range.deleteContents();
    range.insertNode(spacer);
    range.insertNode(mathField);

    setTimeout(() => mathField.focus(), 0);

    range.setStartAfter(spacer);
    range.setEndAfter(spacer);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  // Gửi nội dung mỗi khi có thay đổi
  const triggerChange = () => {
    const html = editorRef.current?.innerHTML || '';
    onChange?.(html);
  };

  // Sự kiện khi contentEditable thay đổi
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const onInput = () => triggerChange();
    editor.addEventListener('input', onInput);

    return () => editor.removeEventListener('input', onInput);
  }, [onChange]);

  // Sự kiện khi math-field thay đổi bên trong
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const mathFields = editorRef.current?.querySelectorAll('math-field') || [];
      mathFields.forEach((mf) => {
        mf.addEventListener('input', triggerChange);
      });
    });

    observer.observe(editorRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Backspace xóa math-field
  useEffect(() => {
    const editor = editorRef.current;
    const handleKeyDown = (e) => {
      if (e.key !== 'Backspace') return;

      const sel = window.getSelection();
      if (!sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      const container = range.startContainer;
      const offset = range.startOffset;

      let prevNode = null;
      if (container.nodeType === Node.TEXT_NODE && offset === 0) {
        prevNode = container.parentNode?.previousSibling;
      } else if (container.nodeType === Node.ELEMENT_NODE && offset > 0) {
        prevNode = container.childNodes[offset - 1];
      }

      if (prevNode?.nodeName === 'MATH-FIELD') {
        e.preventDefault();
        prevNode.remove();
        triggerChange();
      }
    };

    editor.addEventListener('keydown', handleKeyDown);
    return () => editor.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Khi có prop value, khôi phục lại nội dung
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !value) return;

    editor.innerHTML = value;

    // Sau khi gán HTML, phải set lại .value cho từng math-field
    const mathFields = editor.querySelectorAll('math-field');
    mathFields.forEach((mf) => {
      const latexMatch = mf.textContent?.match(/\$([^\$]+)\$/);
      if (latexMatch) {
        mf.setValue?.(latexMatch[1]);
      }
    });
  }, [value]);

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={insertMathField}>➕ Math Equation</button>
      </div>
      <div
        ref={editorRef}
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
    </div>
  );
};

export default MathInput;
