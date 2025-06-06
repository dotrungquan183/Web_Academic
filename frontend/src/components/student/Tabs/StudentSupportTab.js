import React, { useState, useRef, useEffect } from 'react';
import { FaRobot } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const StudentSupportTab = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleGenerate = async () => {
    const question = inputText.trim();
    if (!question) return;

    const newMessages = [...messages, { from: 'user', text: question }];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/generate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text: question }),
      });

      const data = await response.json();
      const reply = data.result || '⚠️ Không có phản hồi từ hệ thống.';

      const updatedMessages = [...newMessages, { from: 'bot', text: reply }];
      setMessages(updatedMessages);

      // Lưu lịch sử
      setChatHistory(prev => [
        { title: question.slice(0, 20) + '...', conversation: updatedMessages },
        ...prev,
      ]);
    } catch (error) {
      setMessages(prev => [...prev, { from: 'bot', text: '❌ Lỗi: ' + error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleLoadHistory = (conversation) => {
    setMessages(conversation);
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      backgroundColor: "#f0f2f5",
      display: "flex"
    }}>
      {/* Sidebar lịch sử chat */}
      <div style={{
        width: "280px",
        backgroundColor: "#003366",
        color: "#fff",
        padding: "20px",
        overflowY: "auto"
      }}>
        <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>🕘 Lịch sử chat</h3>
        {chatHistory.length === 0 && (
          <p style={{ fontStyle: "italic" }}>Chưa có cuộc trò chuyện nào</p>
        )}
        {chatHistory.map((item, index) => (
          <div
            key={index}
            onClick={() => handleLoadHistory(item.conversation)}
            style={{
              backgroundColor: "#004080",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {item.title}
          </div>
        ))}
      </div>

      {/* Khung chat chính */}
      <div style={{
        flex: 1,
        height: "100vh",
        display: "flex",
        padding: "20px"
      }}>

        <div style={{
          flex: 1,
          height: "90vh",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>

          {/* Tiêu đề */}
          <div style={{
            backgroundColor: "#003366",
            color: "#fff",
            padding: "16px 20px",
            borderRadius: "8px",
            fontSize: "20px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <FaRobot size={24} />
            Xin chào! Mình có thể giúp gì cho bạn?
          </div>

          {/* Khung tin nhắn */}
          <div style={{
            flex: 1,
            marginTop: "20px",
            overflowY: "auto",
            paddingRight: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor: "#fafafa"
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "16px",
                  textAlign: msg.from === 'user' ? 'right' : 'left',
                }}
              >
                <div style={{
                  display: "inline-block",
                  backgroundColor: msg.from === 'user' ? "#e3f2fd" : "#e0f7fa",
                  color: "#333",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  maxWidth: "100%",
                  whiteSpace: "pre-wrap",
                }}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ color: "#555", fontStyle: "italic" }}>
                🤖 Đang suy nghĩ...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Nhập liệu */}
          <textarea
            rows="3"
            placeholder="Nhập bài toán của bạn tại đây..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "16px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              resize: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              marginTop: "12px",
              padding: "12px 20px",
              fontSize: "16px",
              backgroundColor: "#003366",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              alignSelf: "flex-end"
            }}
          >
            {loading ? "Đang xử lý..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentSupportTab;
