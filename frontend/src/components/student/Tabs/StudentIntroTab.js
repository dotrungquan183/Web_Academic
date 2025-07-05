import React, { useState } from "react";
import {
  BookOpen,
  MessageCircle,
  Clock,
  BarChart3,
  Shield,
  Smartphone,
  Wrench,
  Sparkles,
  GraduationCap,
  Award,
  ChevronRight,
  Target
} from 'lucide-react';
 
function StudentIntroTab() {
  const [activeFeature, setActiveFeature] = useState(null);
 
  const features = [
    {
      id: 1,
      icon: <BookOpen className="stuintro-icon" />,
      title: "Quản lý khóa học",
      description: "Truy cập, học tập và theo dõi tiến độ các khóa học bạn đã đăng ký.",
      color: "stuintro-feature-blue",
      bgColor: "stuintro-feature-bg-blue",
      borderColor: "stuintro-feature-border-blue"
    },
    {
      id: 2,
      icon: <MessageCircle className="stuintro-icon" />,
      title: "Diễn đàn học tập",
      description: "Trao đổi, thảo luận và chia sẻ kinh nghiệm với bạn bè và giáo viên.",
      color: "stuintro-feature-green",
      bgColor: "stuintro-feature-bg-green",
      borderColor: "stuintro-feature-border-green"
    },
    {
      id: 3,
      icon: <Clock className="stuintro-icon" />,
      title: "Quản lý thời gian học tập",
      description: "Lên kế hoạch học tập và nhận thông báo nhắc nhở.",
      color: "stuintro-feature-purple",
      bgColor: "stuintro-feature-bg-purple",
      borderColor: "stuintro-feature-border-purple"
    },
    {
      id: 4,
      icon: <BarChart3 className="stuintro-icon" />,
      title: "Báo cáo & thống kê",
      description: "Theo dõi kết quả học tập với các báo cáo chi tiết.",
      color: "stuintro-feature-orange",
      bgColor: "stuintro-feature-bg-orange",
      borderColor: "stuintro-feature-border-orange"
    },
    {
      id: 5,
      icon: <Shield className="stuintro-icon" />,
      title: "Bảo mật dữ liệu",
      description: "Bảo vệ thông tin cá nhân và kết quả học tập của bạn.",
      color: "stuintro-feature-red",
      bgColor: "stuintro-feature-bg-red",
      borderColor: "stuintro-feature-border-red"
    },
    {
      id: 6,
      icon: <Smartphone className="stuintro-icon" />,
      title: "Hỗ trợ đa nền tảng",
      description: "Truy cập dễ dàng từ điện thoại, máy tính bảng và máy tính để bàn.",
      color: "stuintro-feature-indigo",
      bgColor: "stuintro-feature-bg-indigo",
      borderColor: "stuintro-feature-border-indigo"
    },
    {
      id: 7,
      icon: <Wrench className="stuintro-icon" />,
      title: "Hỗ trợ kỹ thuật",
      description: "Đội ngũ hỗ trợ luôn sẵn sàng giúp bạn khi cần.",
      color: "stuintro-feature-teal",
      bgColor: "stuintro-feature-bg-teal",
      borderColor: "stuintro-feature-border-teal"
    }
  ];
 
  return (
    <div className="stuintro-container">
      {/* Hero Section */}
      <div className="stuintro-hero">
        <div className="stuintro-hero-overlay"></div>
        <div className="stuintro-hero-content">
          <div className="stuintro-hero-text">
            <div className="stuintro-hero-icon">
              <GraduationCap className="stuintro-hero-icon-svg" />
            </div>
            <h1 className="stuintro-hero-title">
              Hệ thống Quản lý
              <span className="stuintro-hero-title-gradient"> Giáo dục </span>
              trực tuyến
            </h1>
            <p className="stuintro-hero-description">
              Nền tảng học tập toàn diện được thiết kế dành riêng cho học viên.
              Giao diện thân thiện, dễ sử dụng giúp bạn dễ dàng truy cập và quản lý các khóa học của mình.
            </p>
          </div>
        </div>
      </div>
 
      {/* Main Content */}
      <div className="stuintro-main-content">
        <div className="stuintro-content-grid">
          {/* Left Section - About */}
          <div className="stuintro-about-section">
            <div className="stuintro-about-card">
              <div className="stuintro-about-header">
                <div className="stuintro-about-icon">
                  <Target className="stuintro-icon" />
                </div>
                <h2 className="stuintro-about-title">Về chúng tôi</h2>
              </div>
              
              <div className="stuintro-about-content">
                <p className="stuintro-about-text-large">
                  Hệ thống hỗ trợ bạn tiếp cận tài liệu học tập, theo dõi tiến độ học tập
                  và giao tiếp với giáo viên cũng như bạn bè cùng lớp.
                </p>
                <p className="stuintro-about-text">
                  Chúng tôi cam kết đồng hành cùng bạn trong hành trình học tập,
                  giúp nâng cao kiến thức và phát triển kỹ năng một cách hiệu quả.
                </p>
                <div className="stuintro-about-highlight">
                  <Sparkles className="stuintro-about-highlight-icon" />
                  <p className="stuintro-about-highlight-text">
                    Được tin tưởng bởi hàng ngàn học viên trên toàn quốc
                  </p>
                </div>
              
              </div>
            </div>
          </div>
 
          {/* Right Section - Features */}
          <div>
            <div className="stuintro-features-header">
              <h3 className="stuintro-features-title">
                <Sparkles className="stuintro-features-title-icon" />
                Các chức năng chính
              </h3>
              <p className="stuintro-features-description">Khám phá những tính năng hỗ trợ học tập hiệu quả</p>
            </div>
 
            <div className="stuintro-features-list">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`stuintro-feature-card ${
                    activeFeature === feature.id
                      ? `${feature.borderColor} stuintro-feature-active`
                      : 'stuintro-feature-inactive'
                  }`}
                  onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                >
                  <div className="stuintro-feature-content">
                    <div className="stuintro-feature-main">
                      <div className={`stuintro-feature-icon-wrapper ${feature.color}`}>
                        <div className="stuintro-feature-icon-content">
                          {feature.icon}
                        </div>
                      </div>
                      <div className="stuintro-feature-text">
                        <div className="stuintro-feature-header">
                          <h4 className="stuintro-feature-title">
                            {feature.title}
                          </h4>
                          <ChevronRight className={`stuintro-feature-chevron ${
                            activeFeature === feature.id ? 'stuintro-feature-chevron-active' : ''
                          }`} />
                        </div>
                        <p className="stuintro-feature-description">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    
                    {activeFeature === feature.id && (
                      <div className={`stuintro-feature-tip ${feature.bgColor} ${feature.borderColor}`}>
                        <p className="stuintro-feature-tip-text">
                          💡 <strong>Lợi ích:</strong> Tính năng này giúp bạn cải thiện hiệu quả học tập lên đến 60%!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
 
            {/* CTA Section */}
            <div className="stuintro-cta-section">
              <div className="stuintro-cta-card">
                <div className="stuintro-cta-icon">
                  <Award className="stuintro-cta-icon-svg" />
                </div>
                <h4 className="stuintro-cta-title">Bắt đầu hành trình học tập</h4>
                <p className="stuintro-cta-description">
                  Tham gia cùng hàng ngàn học viên đã thành công với hệ thống của chúng tôi
                </p>
                <button className="stuintro-cta-button">
                  Khám phá ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default StudentIntroTab;
 
const styles = `
.stuintro-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #e0e7ff 100%);
}
 
.stuintro-hero {
  position: relative;
  overflow: hidden;
}
 
.stuintro-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(245, 158, 11, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
}
 
.stuintro-hero-content {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 24px;
}
 
.stuintro-hero-text {
  text-align: center;
  margin-bottom: 64px;
}
 
.stuintro-hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(90deg, #3b82f6, #4f46e5);
  border-radius: 50%;
  margin-bottom: 32px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
 
.stuintro-hero-icon-svg {
  height: 40px;
  width: 40px;
  color: white;
}
 
.stuintro-hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
  line-height: 1.2;
}
 
.stuintro-hero-title-gradient {
  background: linear-gradient(90deg, #2563eb, #4f46e5);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
 
.stuintro-hero-description {
  font-size: 1.25rem;
  color: #4b5563;
  max-width: 768px;
  margin: 0 auto;
  line-height: 1.75;
}
 
.stuintro-main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px 80px;
}
 
.stuintro-content-grid {
  display: grid;
  gap: 64px;
  align-items: start;
}
 
@media (min-width: 1024px) {
  .stuintro-content-grid {
    grid-template-columns: 1fr 1fr;
  }
}
 
.stuintro-about-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
 
.stuintro-about-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
}
 
.stuintro-about-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}
 
.stuintro-about-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(90deg, #3b82f6, #4f46e5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}
 
.stuintro-about-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
}
 
.stuintro-about-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: #374151;
  line-height: 1.75;
}
 
.stuintro-about-text-large {
  font-size: 1.125rem;
}
 
.stuintro-about-text {
  font-size: 1rem;
}
 
.stuintro-about-highlight {
  display: flex;
  align-items: center;
  padding: 16px;
  background: linear-gradient(90deg,#dbeafe, #e0e7ff);
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}
 
.stuintro-about-highlight-icon {
  height: 20px;
  width: 20px;
  color: #2563eb;
  margin-right: 12px;
  flex-shrink: 0;
}
 
.stuintro-about-highlight-text {
  color: #1e40af;
  font-weight: 500;
}
 
.stuintro-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 8px;
}
 
.stuintro-stat-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px solid #f3f4f6;
}
 
.stuintro-stat-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(90deg, #3b82f6, #4f46e5);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
}
 
.stuintro-stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}
 
.stuintro-stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}
 
.stuintro-features-header {
  margin-bottom: 32px;
}
 
.stuintro-features-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}
 
.stuintro-features-title-icon {
  height: 32px;
  width: 32px;
  color: #2563eb;
  margin-right: 12px;
}
 
.stuintro-features-description {
  color: #4b5563;
}
 
.stuintro-features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
 
.stuintro-feature-card {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  border: 1px solid;
  transition: all 0.3s ease;
  cursor: pointer;
}
 
.stuintro-feature-inactive {
  border-color: #f3f4f6;
}
 
.stuintro-feature-inactive:hover {
  border-color: #e5e7eb;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
 
.stuintro-feature-active {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}
 
.stuintro-feature-content {
  padding: 24px;
}
 
.stuintro-feature-main {
  display: flex;
  align-items: start;
  gap: 16px;
}
 
.stuintro-feature-icon-wrapper {
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
 
.stuintro-feature-blue {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}
 
.stuintro-feature-green {
  background: linear-gradient(90deg, #10b981, #059669);
}
 
.stuintro-feature-purple {
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
}
 
.stuintro-feature-orange {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}
 
.stuintro-feature-red {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}
 
.stuintro-feature-indigo {
  background: linear-gradient(90deg, #6366f1, #4f46e5);
}
 
.stuintro-feature-teal {
  background: linear-gradient(90deg, #14b8a6, #0d9488);
}
 
.stuintro-feature-icon-content {
  color: white;
}
 
.stuintro-feature-text {
  flex: 1;
}
 
.stuintro-feature-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
 
.stuintro-feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  transition: color 0.3s ease;
}
 
.stuintro-feature-card:hover .stuintro-feature-title {
  color: #2563eb;
}
 
.stuintro-feature-chevron {
  height: 20px;
  width: 20px;
  color: #9ca3af;
  transition: transform 0.3s ease;
}
 
.stuintro-feature-chevron-active {
  transform: rotate(90deg);
}
 
.stuintro-feature-description {
  color: #4b5563;
  line-height: 1.75;
}
 
.stuintro-feature-tip {
  margin-top: 16px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid;
  animation: slideIn 0.3s ease-in-out;
}
 
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
 
.stuintro-feature-bg-blue {
  background-color: #eff6ff;
}
 
.stuintro-feature-bg-green {
  background-color: #ecfdf5;
}
 
.stuintro-feature-bg-purple {
  background-color: #faf5ff;
}
 
.stuintro-feature-bg-orange {
  background-color: #fffbeb;
}
 
.stuintro-feature-bg-red {
  background-color: #fef2f2;
}
 
.stuintro-feature-bg-indigo {
  background-color: #eef2ff;
}
 
.stuintro-feature-bg-teal {
  background-color: #f0fdfa;
}
 
.stuintro-feature-border-blue {
  border-color: #bfdbfe;
}
 
.stuintro-feature-border-green {
  border-color: #bbf7d0;
}
 
.stuintro-feature-border-purple {
  border-color: #e9d5ff;
}
 
.stuintro-feature-border-orange {
  border-color: #fed7aa;
}
 
.stuintro-feature-border-red {
  border-color: #fecaca;
}
 
.stuintro-feature-border-indigo {
  border-color: #c7d2fe;
}
 
.stuintro-feature-border-teal {
  border-color: #99f6e4;
}
 
.stuintro-feature-tip-text {
  font-size: 0.875rem;
  color: #374151;
}
 
.stuintro-cta-section {
  margin-top: 48px;
  text-align: center;
}
 
.stuintro-cta-card {
  background: linear-gradient(90deg, #3b82f6, #4f46e5);
  border-radius: 16px;
  padding: 32px;
  color: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}
 
.stuintro-cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-bottom: 16px;
}
 
.stuintro-cta-icon-svg {
  height: 32px;
  width: 32px;
  color: white;
}
 
.stuintro-cta-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}
 
.stuintro-cta-description {
  margin-bottom: 24px;
  color: #bfdbfe;
}
 
.stuintro-cta-button {
  background: white;
  color: #2563eb;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
 
.stuintro-cta-button:hover {
  background: #dbeafe;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}
 
.stuintro-icon {
  height: 24px;
  width: 24px;
}
 
/* Responsive adjustments */
@media (max-width: 768px) {
  .stuintro-hero-title {
    font-size: 2rem;
  }
  
  .stuintro-hero-description {
    font-size: 1rem;
  }
  
  .stuintro-features-title {
    font-size: 1.5rem;
  }
  
  .stuintro-about-title {
    font-size: 1.5rem;
  }
  
  .stuintro-stats-grid {
    grid-template-columns: 1fr;
  }
}
`;
 
// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}