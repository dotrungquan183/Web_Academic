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
  Users,
  Award,
  ChevronRight,
  Star
} from 'lucide-react';
 
function StudentIntroTab() {
  const [activeFeature, setActiveFeature] = useState(null);
 
  const features = [
    {
      id: 1,
      icon: <BookOpen className="teaintro-icon" />,
      title: "Quản lý khóa học",
      description: "Tạo mới, cập nhật, quản lý tài liệu và theo dõi tiến độ học tập của học viên.",
      color: "teaintro-feature-blue",
      bgColor: "teaintro-feature-bg-blue",
      borderColor: "teaintro-feature-border-blue"
    },
    {
      id: 2,
      icon: <MessageCircle className="teaintro-icon" />,
      title: "Diễn đàn giáo viên",
      description: "Trao đổi, thảo luận và chia sẻ kinh nghiệm giảng dạy.",
      color: "teaintro-feature-green",
      bgColor: "teaintro-feature-bg-green",
      borderColor: "teaintro-feature-border-green"
    },
    {
      id: 3,
      icon: <Clock className="teaintro-icon" />,
      title: "Quản lý thời gian",
      description: "Lên kế hoạch giảng dạy và nhận nhắc nhở hiệu quả.",
      color: "teaintro-feature-purple",
      bgColor: "teaintro-feature-bg-purple",
      borderColor: "teaintro-feature-border-purple"
    },
    {
      id: 4,
      icon: <BarChart3 className="teaintro-icon" />,
      title: "Báo cáo & thống kê",
      description: "Theo dõi hiệu suất giảng dạy với báo cáo chi tiết.",
      color: "teaintro-feature-orange",
      bgColor: "teaintro-feature-bg-orange",
      borderColor: "teaintro-feature-border-orange"
    },
    {
      id: 5,
      icon: <Shield className="teaintro-icon" />,
      title: "Bảo mật dữ liệu",
      description: "Đảm bảo an toàn thông tin cá nhân và khóa học.",
      color: "teaintro-feature-red",
      bgColor: "teaintro-feature-bg-red",
      borderColor: "teaintro-feature-border-red"
    },
    {
      id: 6,
      icon: <Smartphone className="teaintro-icon" />,
      title: "Hỗ trợ đa nền tảng",
      description: "Sử dụng được cả trên điện thoại và máy tính.",
      color: "teaintro-feature-indigo",
      bgColor: "teaintro-feature-bg-indigo",
      borderColor: "teaintro-feature-border-indigo"
    },
    {
      id: 7,
      icon: <Wrench className="teaintro-icon" />,
      title: "Hỗ trợ kỹ thuật",
      description: "Luôn sẵn sàng hỗ trợ khi bạn cần.",
      color: "teaintro-feature-teal",
      bgColor: "teaintro-feature-bg-teal",
      borderColor: "teaintro-feature-border-teal"
    }
  ];
 
  const stats = [
    { number: "10,000+", label: "Giáo viên đang sử dụng", icon: <Users className="teaintro-stat-icon" /> },
    { number: "50,000+", label: "Học viên được quản lý", icon: <BookOpen className="teaintro-stat-icon" /> },
    { number: "99.9%", label: "Thời gian hoạt động", icon: <Shield className="teaintro-stat-icon" /> },
    { number: "4.9/5", label: "Đánh giá từ người dùng", icon: <Star className="teaintro-stat-icon" /> }
  ];
 
  return (
    <div className="teaintro-container">
      {/* Hero Section */}
      <div className="teaintro-hero">
        <div className="teaintro-hero-overlay"></div>
        <div className="teaintro-hero-content">
          <div className="teaintro-hero-text">
            <div className="teaintro-hero-icon">
              <Sparkles className="teaintro-hero-icon-svg" />
            </div>
            <h1 className="teaintro-hero-title">
              Hệ thống Quản lý
              <span className="teaintro-hero-title-gradient"> Giáo dục </span>
              trực tuyến
            </h1>
            <p className="teaintro-hero-description">
              Nền tảng toàn diện và tiện lợi được thiết kế dành riêng cho giáo viên.
              Giao diện thân thiện, dễ sử dụng, giúp tối ưu hóa quy trình giảng dạy và quản lý học viên.
            </p>
          </div>
 
          {/* Stats */}
          <div className="teaintro-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="teaintro-stat-card">
                <div className="teaintro-stat-icon-wrapper">
                  <div className="teaintro-stat-icon-bg">
                    {stat.icon}
                  </div>
                </div>
                <div className="teaintro-stat-number">{stat.number}</div>
                <div className="teaintro-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* Main Content */}
      <div className="teaintro-main-content">
        <div className="teaintro-content-grid">
          {/* Left Section - About */}
          <div className="teaintro-about-section">
            <div className="teaintro-about-card">
              <div className="teaintro-about-header">
                <div className="teaintro-about-icon">
                  <Award className="teaintro-icon" />
                </div>
                <h2 className="teaintro-about-title">Về chúng tôi</h2>
              </div>
              
              <div className="teaintro-about-content">
                <p className="teaintro-about-text-large">
                  Hệ thống hỗ trợ bạn tập trung vào việc nâng cao chất lượng giảng dạy,
                  đồng thời tạo điều kiện thuận lợi để trao đổi kinh nghiệm và kết nối với đồng nghiệp.
                </p>
                <p className="teaintro-about-text">
                  Chúng tôi cam kết đồng hành cùng bạn trong mọi hoạt động quản lý lớp học,
                  hỗ trợ phát triển năng lực cá nhân và nâng cao hiệu quả giáo dục.
                </p>
                <div className="teaintro-about-highlight">
                  <Sparkles className="teaintro-about-highlight-icon" />
                  <p className="teaintro-about-highlight-text">
                    Được tin tưởng bởi hàng ngàn giáo viên trên toàn quốc
                  </p>
                </div>
              </div>
            </div>
          </div>
 
          {/* Right Section - Features */}
          <div>
            <div className="teaintro-features-header">
              <h3 className="teaintro-features-title">
                <Sparkles className="teaintro-features-title-icon" />
                Các chức năng chính
              </h3>
              <p className="teaintro-features-description">Khám phá những tính năng mạnh mẽ được thiết kế đặc biệt cho giáo viên</p>
            </div>
 
            <div className="teaintro-features-list">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`teaintro-feature-card ${
                    activeFeature === feature.id
                      ? `${feature.borderColor} teaintro-feature-active`
                      : 'teaintro-feature-inactive'
                  }`}
                  onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                >
                  <div className="teaintro-feature-content">
                    <div className="teaintro-feature-main">
                      <div className={`teaintro-feature-icon-wrapper ${feature.color}`}>
                        <div className="teaintro-feature-icon-content">
                          {feature.icon}
                        </div>
                      </div>
                      <div className="teaintro-feature-text">
                        <div className="teaintro-feature-header">
                          <h4 className="teaintro-feature-title">
                            {feature.title}
                          </h4>
                          <ChevronRight className={`teaintro-feature-chevron ${
                            activeFeature === feature.id ? 'teaintro-feature-chevron-active' : ''
                          }`} />
                        </div>
                        <p className="teaintro-feature-description">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    
                    {activeFeature === feature.id && (
                      <div className={`teaintro-feature-tip ${feature.bgColor} ${feature.borderColor}`}>
                        <p className="teaintro-feature-tip-text">
                          💡 <strong>Mẹo:</strong> Tính năng này giúp bạn tiết kiệm đến 40% thời gian trong công việc hàng ngày!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
 
            {/* CTA Section */}
            <div className="teaintro-cta-section">
              <div className="teaintro-cta-card">
                <h4 className="teaintro-cta-title">Sẵn sàng bắt đầu?</h4>
                <p className="teaintro-cta-description">
                  Tham gia cùng hàng ngàn giáo viên đã tin tưởng sử dụng hệ thống của chúng tôi
                </p>
                <button className="teaintro-cta-button">
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
.teaintro-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #e0e7ff 100%);
}
 
.teaintro-hero {
  position: relative;
  overflow: hidden;
}
 
.teaintro-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(37, 99, 235, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%);
}
 
.teaintro-hero-content {
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 24px;
}
 
.teaintro-hero-text {
  text-align: center;
  margin-bottom: 64px;
}
 
.teaintro-hero-icon {
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
 
.teaintro-hero-icon-svg {
  height: 40px;
  width: 40px;
  color: white;
}
 
.teaintro-hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
  line-height: 1.2;
}
 
.teaintro-hero-title-gradient {
  background: linear-gradient(90deg, #2563eb, #4f46e5);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
 
.teaintro-hero-description {
  font-size: 1.25rem;
  color: #4b5563;
  max-width: 768px;
  margin: 0 auto;
  line-height: 1.75;
}
 
.teaintro-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 80px;
}
 
@media (min-width: 768px) {
  .teaintro-stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
 
.teaintro-stat-card {
  text-align: center;
  padding: 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
 
.teaintro-stat-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
 
.teaintro-stat-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(90deg, #3b82f6, #4f46e5);
  border-radius: 8px;
  margin-bottom: 16px;
}
 
.teaintro-stat-icon-bg {
  color: white;
}
 
.teaintro-stat-icon {
  height: 20px;
  width: 20px;
}
 
.teaintro-stat-number {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}
 
.teaintro-stat-label {
  font-size: 0.875rem;
  color: #4b5563;
}
 
.teaintro-main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px 80px;
}
 
.teaintro-content-grid {
  display: grid;
  gap: 64px;
  align-items: start;
}
 
@media (min-width: 1024px) {
  .teaintro-content-grid {
    grid-template-columns: 1fr 1fr;
  }
}
 
.teaintro-about-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
 
.teaintro-about-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
}
 
.teaintro-about-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}
 
.teaintro-about-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(90deg, #3b82f6, #4f46e5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}
 
.teaintro-about-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
}
 
.teaintro-about-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: #374151;
  line-height: 1.75;
}
 
.teaintro-about-text-large {
  font-size: 1.125rem;
}
 
.teaintro-about-text {
  font-size: 1rem;
}
 
.teaintro-about-highlight {
  display: flex;
  align-items: center;
  padding: 16px;
  background: linear-gradient(90deg, #dbeafe, #e0e7ff);
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}
 
.teaintro-about-highlight-icon {
  height: 20px;
  width: 20px;
  color: #2563eb;
  margin-right: 12px;
  flex-shrink: 0;
}
 
.teaintro-about-highlight-text {
  color: #1e40af;
  font-weight: 500;
}
 
.teaintro-features-header {
  margin-bottom: 32px;
}
 
.teaintro-features-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}
 
.teaintro-features-title-icon {
  height: 32px;
  width: 32px;
  color: #2563eb;
  margin-right: 12px;
}
 
.teaintro-features-description {
  color: #4b5563;
}
 
.teaintro-features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
 
.teaintro-feature-card {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  border: 1px solid;
  transition: all 0.3s ease;
  cursor: pointer;
}
 
.teaintro-feature-inactive {
  border-color: #f3f4f6;
}
 
.teaintro-feature-inactive:hover {
  border-color: #e5e7eb;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
 
.teaintro-feature-active {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}
 
.teaintro-feature-content {
  padding: 24px;
}
 
.teaintro-feature-main {
  display: flex;
  align-items: start;
  gap: 16px;
}
 
.teaintro-feature-icon-wrapper {
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
 
.teaintro-feature-blue {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
}
 
.teaintro-feature-green {
  background: linear-gradient(90deg, #10b981, #059669);
}
 
.teaintro-feature-purple {
  background: linear-gradient(90deg, #8b5cf6, #7c3aed);
}
 
.teaintro-feature-orange {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}
 
.teaintro-feature-red {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}
 
.teaintro-feature-indigo {
  background: linear-gradient(90deg, #6366f1, #4f46e5);
}
 
.teaintro-feature-teal {
  background: linear-gradient(90deg, #14b8a6, #0d9488);
}
 
.teaintro-feature-icon-content {
  color: white;
}
 
.teaintro-feature-text {
  flex: 1;
}
 
.teaintro-feature-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
 
.teaintro-feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  transition: color 0.3s ease;
}
 
.teaintro-feature-card:hover .teaintro-feature-title {
  color: #2563eb;
}
 
.teaintro-feature-chevron {
  height: 20px;
  width: 20px;
  color: #9ca3af;
  transition: transform 0.3s ease;
}
 
.teaintro-feature-chevron-active {
  transform: rotate(90deg);
}
 
.teaintro-feature-description {
  color: #4b5563;
  line-height: 1.75;
}
 
.teaintro-feature-tip {
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
 
.teaintro-feature-bg-blue {
  background-color: #eff6ff;
}
 
.teaintro-feature-bg-green {
  background-color: #ecfdf5;
}
 
.teaintro-feature-bg-purple {
  background-color: #faf5ff;
}
 
.teaintro-feature-bg-orange {
  background-color: #fffbeb;
}
 
.teaintro-feature-bg-red {
  background-color: #fef2f2;
}
 
.teaintro-feature-bg-indigo {
  background-color: #eef2ff;
}
 
.teaintro-feature-bg-teal {
  background-color: #f0fdfa;
}
 
.teaintro-feature-border-blue {
  border-color: #bfdbfe;
}
 
.teaintro-feature-border-green {
  border-color: #bbf7d0;
}
 
.teaintro-feature-border-purple {
  border-color: #e9d5ff;
}
 
.teaintro-feature-border-orange {
  border-color: #fed7aa;
}
 
.teaintro-feature-border-red {
  border-color: #fecaca;
}
 
.teaintro-feature-border-indigo {
  border-color: #c7d2fe;
}
 
.teaintro-feature-border-teal {
  border-color: #99f6e4;
}
 
.teaintro-feature-tip-text {
  font-size: 0.875rem;
  color: #374151;
}
 
.teaintro-cta-section {
  margin-top: 48px;
  text-align: center;
}
 
.teaintro-cta-card {
  background: linear-gradient(90deg, #3b82f6, #4f46e5);
  border-radius: 16px;
  padding: 32px;
  color: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
 
.teaintro-cta-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}
 
.teaintro-cta-description {
  margin-bottom: 24px;
  color: #bfdbfe;
}
 
.teaintro-cta-button {
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
 
.teaintro-cta-button:hover {
  background: #dbeafe;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}
 
.teaintro-icon {
  height: 24px;
  width: 24px;
}
 
/* Responsive adjustments */
@media (max-width: 768px) {
  .teaintro-hero-title {
    font-size: 2rem;
  }
  
  .teaintro-hero-description {
    font-size: 1rem;
  }
  
  .teaintro-features-title {
    font-size: 1.5rem;
  }
  
  .teaintro-about-title {
    font-size: 1.5rem;
  }
}
`;
 
// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}