import React, { useEffect, useState } from "react";
import { getToken } from "../../auth/authHelper";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  MessageSquare,
  Users,
  Video,
  Clock,
  ThumbsUp,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  AreaChart,  // Thêm AreaChart
  BarChart,
  Line,
  Area,       // Thêm Area
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import './TeacherDashboard.css';
 
const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
 
  const [courseData, setCourseData] = useState({});
  const [forumData, setForumData] = useState({});
  const [monthlyStudentData, setMonthlyStudentData] = useState([]);
  const [coursePopularityData, setCoursePopularityData] = useState([]);
  const [lessonViewData, setLessonViewData] = useState([]);
  const [videoViewsData, setVideoViewsData] = useState([]);
  const [documentViewsData, setDocumentViewsData] = useState([]);
  const [topLessonsData, setTopLessonsData] = useState([]);
  const [topDocumentsData, setTopDocumentsData] = useState([]);
  const [contentEngagementData, setContentEngagementData] = useState([]);
  const [weeklyContentData, setWeeklyContentData] = useState([]);
  const [reputationData, setReputationData] = useState([]);
  const [weeklyActivityData, setWeeklyActivityData] = useState([]);
  const [responseTimeData, setResponseTimeData] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [activityData, setActivityData] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    const token = getToken();
    if (!token) {
      alert("❌ Bạn chưa đăng nhập!");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/teacher/teacher_insight/teacher_insight_courses/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();
      console.log("✅ DATA NHẬN TỪ SERVER:", result);

      if (res.ok) {
        setCourseData(result.courseData || {});
        setForumData(result.forumData || {});
        setMonthlyStudentData(result.monthlyStudentData || []);
        setCoursePopularityData(result.coursePopularityData || []);
        setLessonViewData(result.lessonViewData || []);
        setVideoViewsData(result.videoViewsData || []);
        setDocumentViewsData(result.documentViewsData || []);
        setTopLessonsData(result.topLessonsData || []);
        setTopDocumentsData(result.topDocumentsData || []);
        setContentEngagementData(result.contentEngagementData || []);
        setWeeklyContentData(result.weeklyContentData || []);
        setReputationData(result.reputationData || []);
        setWeeklyActivityData(result.weeklyActivityData || []);
        setResponseTimeData(result.responseTimeData || []);
        setPerformanceMetrics(result.performanceMetrics || []);
        setActivityData(result.activityData || []);
      } else {
        console.error("❌ Lỗi từ server:", result);
        alert("❌ Không thể lấy dữ liệu dashboard.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi fetch dữ liệu:", error);
      alert("❌ Có lỗi khi tải dữ liệu dashboard.");
    }
  };

  fetchData();
}, [navigate]);


 
  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
    <div className={`teastat-stat-card teastat-stat-card-${color}`}>
      <div className="teastat-stat-content">
        <div className="teastat-stat-info">
          <p className="teastat-stat-title">{title}</p>
          <p className="teastat-stat-value">{value}</p>
          {subtitle && <p className="teastat-stat-subtitle">{subtitle}</p>}
        </div>
        <div className={`teastat-stat-icon teastat-stat-icon-${color}`}>
          <Icon className="teastat-icon" />
        </div>
      </div>
    </div>
  );
 
  const Sidebar = () => (
    <div className="teastat-sidebar">
      <div className="teastat-sidebar-header">
        <h1 className="teastat-sidebar-title">Báo cáo Giáo viên</h1>
      </div>
      <nav className="teastat-sidebar-nav">
        <button
          onClick={() => setActiveTab('courses')}
          className={`teastat-nav-button ${activeTab === 'courses' ? 'teastat-nav-button-active' : ''}`}
        >
          <BookOpen className="teastat-nav-icon" />
          Khóa học
        </button>
        <button
          onClick={() => setActiveTab('forum')}
          className={`teastat-nav-button ${activeTab === 'forum' ? 'teastat-nav-button-active' : ''}`}
        >
          <MessageSquare className="teastat-nav-icon" />
          Hoạt động diễn đàn
        </button>
      </nav>
    </div>
  );
 
  const CoursesTab = () => (
  <div className="teastat-tab-content">
    {/* Overview Cards */}
    <div className="teastat-stats-grid">
      <StatCard
        icon={BookOpen}
        title="Tổng khóa học"
        value={courseData.totalCourses}
        subtitle={`${courseData.approvedCourses} đã duyệt`}
      />
      <StatCard
        icon={Users}
        title="Tổng học sinh"
        value={courseData.totalStudents}
        subtitle="Đã đăng ký"
      />
      <StatCard
        icon={Video}
        title="Tổng video"
        value={courseData.totalVideos}
        subtitle={`${Math.floor(courseData.totalDuration / 60)}h ${courseData.totalDuration % 60}p`}
      />
      <StatCard
        icon={TrendingUp}
        title="Tỷ lệ duyệt"
        value={`${Math.round((courseData.approvedCourses / courseData.totalCourses) * 100)}%`}
        subtitle="Nội dung được phê duyệt"
      />
    </div>
 
    {/* Course Status */}
    <div className="teastat-card">
      <h3 className="teastat-card-title">Trạng thái khóa học</h3>
      <div className="teastat-status-grid">
        <div className="teastat-status-item">
          <div className="teastat-status-icon teastat-status-icon-green">
            <CheckCircle className="teastat-icon" />
          </div>
          <p className="teastat-status-value teastat-status-value-green">{courseData.approvedCourses}</p>
          <p className="teastat-status-label">Đã duyệt</p>
        </div>
        <div className="teastat-status-item">
          <div className="teastat-status-icon teastat-status-icon-yellow">
            <Clock className="teastat-icon" />
          </div>
          <p className="teastat-status-value teastat-status-value-yellow">{courseData.pendingCourses}</p>
          <p className="teastat-status-label">Chờ duyệt</p>
        </div>
        <div className="teastat-status-item">
          <div className="teastat-status-icon teastat-status-icon-red">
            <XCircle className="teastat-icon" />
          </div>
          <p className="teastat-status-value teastat-status-value-red">{courseData.rejectedCourses}</p>
          <p className="teastat-status-label">Bị từ chối</p>
        </div>
      </div>
    </div>
 
    {/* Views Analytics - Dual Chart */}
    <div className="teastat-dual-chart-container">
      {/* Video Views */}
      <div className="teastat-card teastat-half-card">
        <h3 className="teastat-card-title">Lượt xem video bài giảng</h3>
        <div className="teastat-chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={videoViewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="teastat-chart-summary">
          Tổng: {videoViewsData.reduce((sum, item) => sum + item.views, 0)} lượt xem
        </p>
      </div>
 
      {/* Document Views */}
      <div className="teastat-card teastat-half-card">
        <h3 className="teastat-card-title">Lượt xem tài liệu</h3>
        <div className="teastat-chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={documentViewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="teastat-chart-summary">
          Tổng: {documentViewsData.reduce((sum, item) => sum + item.views, 0)} lượt xem
        </p>
      </div>
    </div>
 
    {/* Top Viewed Content */}
    <div className="teastat-dual-chart-container">
      {/* Most Viewed Lessons */}
      <div className="teastat-card teastat-half-card">
        <h3 className="teastat-card-title">Bài học được xem nhiều nhất</h3>
        <div className="teastat-ranking-list">
          {topLessonsData.map((lesson, index) => (
            <div key={index} className="teastat-ranking-item">
              <div className="teastat-ranking-position">#{index + 1}</div>
              <div className="teastat-ranking-content">
                <p className="teastat-ranking-title">{lesson.title}</p>
                <p className="teastat-ranking-subtitle">{lesson.course}</p>
              </div>
              <div className="teastat-ranking-stats">
                <span className="teastat-ranking-views">{lesson.views} lượt xem</span>
                <div className="teastat-ranking-bar">
                  <div
                    className="teastat-ranking-fill"
                    style={{ width: `${(lesson.views / Math.max(...topLessonsData.map(l => l.views))) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Most Viewed Documents */}
      <div className="teastat-card teastat-half-card">
        <h3 className="teastat-card-title">Tài liệu được xem nhiều nhất</h3>
        <div className="teastat-ranking-list">
          {topDocumentsData.map((doc, index) => (
            <div key={index} className="teastat-ranking-item">
              <div className="teastat-ranking-position">#{index + 1}</div>
              <div className="teastat-ranking-content">
                <p className="teastat-ranking-title">{doc.title}</p>
                <p className="teastat-ranking-subtitle">{doc.type}</p>
              </div>
              <div className="teastat-ranking-stats">
                <span className="teastat-ranking-views">{doc.views} lượt xem</span>
                <div className="teastat-ranking-bar">
                  <div
                    className="teastat-ranking-fill teastat-ranking-fill-green"
                    style={{ width: `${(doc.views / Math.max(...topDocumentsData.map(d => d.views))) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
 
    {/* Content Engagement Analysis */}
    <div className="teastat-card">
      <h3 className="teastat-card-title">Phân tích mức độ tương tác nội dung</h3>
      <div className="teastat-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={contentEngagementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="content" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="videoViews" fill="#3b82f6" name="Lượt xem video" />
            <Bar dataKey="documentViews" fill="#10b981" name="Lượt xem tài liệu" />
            <Bar dataKey="downloads" fill="#f59e0b" name="Lượt tải xuống" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
 
    {/* Student Registration Trend */}
    <div className="teastat-card">
      <h3 className="teastat-card-title">Xu hướng đăng ký học sinh</h3>
      <div className="teastat-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyStudentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="students" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
 
    {/* Course Popularity */}
    <div className="teastat-card">
      <h3 className="teastat-card-title">Độ phổ biến khóa học</h3>
      <div className="teastat-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={coursePopularityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#8884d8" name="Học sinh" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
 
    {/* Weekly Content Performance */}
    <div className="teastat-card">
      <h3 className="teastat-card-title">Hiệu suất nội dung theo tuần</h3>
      <div className="teastat-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyContentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="videoViews" stroke="#3b82f6" strokeWidth={2} name="Video views" />
            <Line type="monotone" dataKey="documentViews" stroke="#10b981" strokeWidth={2} name="Document views" />
            <Line type="monotone" dataKey="completionRate" stroke="#f59e0b" strokeWidth={2} name="Completion rate %" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
 
    {/* Lesson View Completion */}
    <div className="teastat-card">
      <h3 className="teastat-card-title">Tỷ lệ hoàn thành bài học</h3>
      <div className="teastat-progress-list">
        {lessonViewData.map((lesson, index) => (
          <div key={index} className="teastat-progress-item">
            <div className="teastat-progress-label">{lesson.lesson}</div>
            <div className="teastat-progress-bar-container">
              <div className="teastat-progress-bar">
                <div
                  className="teastat-progress-bar-fill"
                  style={{ width: `${(lesson.views / lesson.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="teastat-progress-text">
              {lesson.views}/{lesson.total} ({Math.round((lesson.views / lesson.total) * 100)}%)
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
 
  const ForumTab = () => (
    <div className="teastat-tab-content">
      {/* Overview Cards */}
      <div className="teastat-stats-grid">
        <StatCard
          icon={MessageSquare}
          title="Câu trả lời"
          value={forumData.totalAnswers}
          subtitle={`${forumData.acceptedAnswers} được chấp nhận`}
        />
        <StatCard
          icon={ThumbsUp}
          title="Tổng votes"
          value={forumData.totalVotes}
          subtitle="Đánh giá tích cực"
        />
        <StatCard
          icon={Award}
          title="Reputation"
          value={forumData.reputation}
          subtitle="Điểm uy tín"
        />
        <StatCard
          icon={Star}
          title="Bình luận"
          value={forumData.totalComments}
          subtitle={`${forumData.helpfulComments} hữu ích`}
        />
      </div>
 
      {/* Dual Circular Progress Charts */}
      <div className="teastat-dual-chart-container">
        {/* Answer Acceptance Rate */}
        <div className="teastat-card teastat-half-card">
          <h3 className="teastat-card-title">Tỷ lệ câu trả lời được chấp nhận</h3>
          <div className="teastat-circular-progress">
            <div className="teastat-circular-chart">
              <svg className="teastat-circular-svg" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={`${(forumData.acceptedAnswers / forumData.totalAnswers) * 100}, 100`}
                />
              </svg>
              <div className="teastat-circular-text">
                <span className="teastat-circular-percentage">
                  {Math.round((forumData.acceptedAnswers / forumData.totalAnswers) * 100)}%
                </span>
              </div>
            </div>
          </div>
          <p className="teastat-circular-description">
            {forumData.acceptedAnswers} trên {forumData.totalAnswers} câu trả lời được chấp nhận
          </p>
        </div>
 
        {/* Question Approval Rate */}
        <div className="teastat-card teastat-half-card">
          <h3 className="teastat-card-title">Tỷ lệ câu hỏi được duyệt</h3>
          <div className="teastat-circular-progress">
            <div className="teastat-circular-chart">
              <svg className="teastat-circular-svg" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray={`${(forumData.approvedQuestions / forumData.totalQuestions) * 100}, 100`}
                />
              </svg>
              <div className="teastat-circular-text">
                <span className="teastat-circular-percentage">
                  {Math.round((forumData.approvedQuestions / forumData.totalQuestions) * 100)}%
                </span>
              </div>
            </div>
          </div>
          <p className="teastat-circular-description">
            {forumData.approvedQuestions} trên {forumData.totalQuestions} câu hỏi được duyệt
          </p>
        </div>
      </div>
 
      {/* Reputation Growth */}
      <div className="teastat-card">
        <h3 className="teastat-card-title">Phát triển reputation</h3>
        <div className="teastat-chart-container">
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={reputationData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="user" />  {/* 👉 đổi từ month sang user */}
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="reputation" stroke="#10b981" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
</div>

      </div>
 
      {/* Weekly Activity Trends */}
      <div className="teastat-card">
        <h3 className="teastat-card-title">Xu hướng hoạt động hàng tuần</h3>
        <div className="teastat-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="answers"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Câu trả lời"
              />
              <Area
                type="monotone"
                dataKey="comments"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
                name="Bình luận"
              />
              <Area
                type="monotone"
                dataKey="votes"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Votes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
 
      {/* Response Time Analysis */}
      <div className="teastat-card">
        <h3 className="teastat-card-title">Phân tích thời gian phản hồi</h3>
        <div className="teastat-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeRange" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8b5cf6" name="Số lượng câu trả lời" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
 
      {/* Activity Breakdown */}
      <div className="teastat-card">
        <h3 className="teastat-card-title">Phân tích hoạt động</h3>
        <div className="teastat-activity-grid">
          <div className="teastat-pie-chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={activityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="teastat-activity-legend">
            {activityData.map((item, index) => (
              <div key={index} className="teastat-legend-item">
                <div className="teastat-legend-content">
                  <div
                    className="teastat-legend-color"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="teastat-legend-label">{item.type}</span>
                </div>
                <span className="teastat-legend-value">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* Top Performance Metrics */}
      <div className="teastat-card">
        <h3 className="teastat-card-title">Chỉ số hiệu suất hàng đầu</h3>
        <div className="teastat-performance-grid">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="teastat-performance-item">
              <div className="teastat-performance-header">
                <span className="teastat-performance-label">{metric.label}</span>
                <span className="teastat-performance-value">{metric.value}</span>
              </div>
              <div className="teastat-performance-bar">
                <div
                  className="teastat-performance-fill"
                  style={{
                    width: `${metric.percentage}%`,
                    backgroundColor: metric.color
                  }}
                ></div>
              </div>
              <span className="teastat-performance-subtitle">{metric.subtitle}</span>
            </div>
          ))}
        </div>
      </div>
 
      {/* Recent Activity */}
      <div className="teastat-card">
        <h3 className="teastat-card-title">Hoạt động gần đây</h3>
        <div className="teastat-activity-list">
          <div className="teastat-activity-item teastat-activity-item-green">
            <CheckCircle className="teastat-activity-icon" />
            <div className="teastat-activity-content">
              <p className="teastat-activity-title">Câu trả lời được chấp nhận</p>
              <p className="teastat-activity-subtitle">Bài "Giải phương trình bậc hai" - 2 giờ trước</p>
            </div>
          </div>
          <div className="teastat-activity-item teastat-activity-item-blue">
            <ThumbsUp className="teastat-activity-icon" />
            <div className="teastat-activity-content">
              <p className="teastat-activity-title">Nhận được 3 votes tích cực</p>
              <p className="teastat-activity-subtitle">Câu trả lời về "Tích phân từng phần" - 4 giờ trước</p>
            </div>
          </div>
          <div className="teastat-activity-item teastat-activity-item-purple">
            <Award className="teastat-activity-icon" />
            <div className="teastat-activity-content">
              <p className="teastat-activity-title">Đạt mốc 1200 reputation</p>
              <p className="teastat-activity-subtitle">Tăng 50 điểm trong tuần này</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
 
  return (
    <div className="teastat-dashboard">
      <Sidebar />
      <div className="teastat-main-content">
        <div className="teastat-header">
          <h2 className="teastat-main-title">
            {activeTab === 'courses' ? 'Thống kê Khóa học' : 'Hoạt động Diễn đàn'}
          </h2>
          <p className="teastat-main-subtitle">
            {activeTab === 'courses'
              ? 'Tổng quan về hiệu suất giảng dạy và tương tác học sinh'
              : 'Phân tích đóng góp và uy tín trong cộng đồng học thuật'
            }
          </p>
        </div>
 
        {activeTab === 'courses' ? <CoursesTab /> : <ForumTab />}
      </div>
    </div>
  );
};
 
export default TeacherDashboard;