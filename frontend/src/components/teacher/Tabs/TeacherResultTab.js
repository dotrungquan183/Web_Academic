import React, { useState, useEffect } from 'react';
import { getToken } from "../../auth/authHelper";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';
import { Pie, Doughnut, Bar, Line, PolarArea } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  RadialLinearScale
);

const chartTitles = {
  user_activity: "Hoạt động người dùng",
  daily_views: "Lượt xem hàng ngày",
  daily_votes: "Lượt vote hàng ngày",
  vote_ratio: "Tỉ lệ vote",
  top_questions_by_views: "Top câu hỏi theo lượt xem",
  accepted_answers: "Câu trả lời được chấp nhận",
  avg_votes_per_question: "Trung bình vote mỗi câu hỏi",
  daily_questions: "Câu hỏi hàng ngày",
  tag_question_count: "Câu hỏi theo thẻ",
  bounty_distribution: "Phân bố treo giải",
  comment_type_distribution: "Phân bố loại bình luận",
  daily_answers: "Câu trả lời hàng ngày"
};

const chartTypes = {
  user_activity: 'bar',
  daily_views: 'line',
  daily_votes: 'line',
  vote_ratio: 'doughnut',
  top_questions_by_views: 'bar',
  accepted_answers: 'bar',
  avg_votes_per_question: 'bar',
  daily_questions: 'line',
  tag_question_count: 'bar',
  bounty_distribution: 'polarArea',
  comment_type_distribution: 'pie',
  daily_answers: 'line'
};

const sidebarItems = [
  { key: 'tab1', icon: '📊', label: 'Hoạt động' },
  { key: 'tab2', icon: '📈', label: 'Tương tác' },
];

// ... (các import giữ nguyên)

const ChartCard = ({ title, chart }) => (
  <div
    style={{
      width: '350px', // 👈 bằng sidebar
      margin: 16,
      padding: 16,
      backgroundColor: 'white',
      borderRadius: 12,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      height: 300,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'all 0.3s ease', // 👈 thêm smooth effect
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
      e.currentTarget.style.backgroundColor = '#f0f4ff'; // 👈 highlight màu khi hover
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      e.currentTarget.style.backgroundColor = 'white';
    }}
  >

    <h3 style={{ fontSize: 16, textAlign: 'center', marginBottom: 12 }}>{title}</h3>
    <div style={{ flex: 1, minHeight: 250 }}>{chart}</div>
  </div>
);


const renderChart = (type, data) => {
  const chartMap = {
    bar: <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />,
    line: <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />,
    doughnut: <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false }} />,
    pie: <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />,
    polarArea: <PolarArea data={data} options={{ responsive: true, maintainAspectRatio: false }} />
  };
  return chartMap[type] || null;
};

export default function TeacherDashboard() {
  const [chartDataMap, setChartDataMap] = useState({});
  const [activeTab, setActiveTab] = useState('tab1');
  const token = getToken();

  useEffect(() => {
    const charts = Object.keys(chartTitles);

    Promise.all(
      charts.map(chart =>
        fetch(`http://localhost:8000/api/teacher/teacher_insight/teacher_insight_forum/?chart=${chart}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        })
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          })
          .then(data => {
            if (Array.isArray(data) && data.length > 0) {
              const labelKey = Object.keys(data[0]).find(k =>
                typeof data[0][k] === 'string' &&
                !['value', 'count', 'total'].includes(k)
              ) || Object.keys(data[0])[0];

              const valueKey = ['value', 'count', 'total'].find(k => k in data[0]) ||
                Object.keys(data[0]).find(k => typeof data[0][k] === 'number' && k !== labelKey) ||
                'value';

              return {
                chart,
                data: {
                  labels: data.map(d => d[labelKey]),
                  datasets: [{
                    label: chartTitles[chart],
                    data: data.map(d => Number(d[valueKey]) || 0),
                    backgroundColor: [
                      '#60a5fa', '#facc15', '#34d399', '#f87171', '#a78bfa',
                      '#fb923c', '#2dd4bf', '#818cf8', '#f472b6', '#22d3ee'
                    ],
                    borderWidth: 1,
                    fill: false,
                    borderColor: '#2563eb',
                    tension: 0.4,
                  }]
                }
              };
            } else {
              return null;
            }
          })
          .catch(() => null)
      )
    ).then(results => {
      const newChartDataMap = {};
      results.forEach(r => {
        if (r) newChartDataMap[r.chart] = r.data;
      });
      setChartDataMap(newChartDataMap);
    });
  }, [token]);

  const chartsTab1 = [
    'user_activity',
    'daily_views',
    'daily_votes',
    'vote_ratio',
    'top_questions_by_views',
    'accepted_answers'
  ];

  const chartsTab2 = [
    'avg_votes_per_question',
    'daily_questions',
    'tag_question_count',
    'bounty_distribution',
    'comment_type_distribution',
    'daily_answers'
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', marginTop: '-15px' }}>
      {/* Sidebar */}
      <div style={{
        width: 425,
        backgroundColor: 'rgba(0, 51, 102, 0.95)',  // Màu nền mới
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',  // Căn giữa nội dung ngang
        paddingTop: 20,
        paddingBottom: 20,
      }}>
        <h2 style={{ marginBottom: 20, fontWeight: 'bold' }}>Dashboard</h2>
        {sidebarItems.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            onMouseEnter={(e) => {
              if (activeTab !== key) e.currentTarget.style.backgroundColor = '#1e3a8a'; // hover màu
            }}
            onMouseLeave={(e) => {
              if (activeTab !== key) e.currentTarget.style.backgroundColor = 'transparent';
            }}
            style={{
              width: 210,
              backgroundColor: activeTab === key ? '#256ee3' : 'transparent',
              color: 'white',
              border: 'none',
              padding: '12px 0',
              marginBottom: 12,
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 8,
              fontWeight: activeTab === key ? 'bold' : 'normal',
              userSelect: 'none',
              transition: 'background-color 0.3s ease', // thêm mượt
            }}
            title={label}
          >
            <span>{icon}</span> <span>{label}</span>
          </button>

        ))}
      </div>


      {/* Content area */}
      <div style={{
        flexGrow: 1,
        padding: 20,
        overflowY: 'auto',
        backgroundColor: 'rgba(243, 244, 246, 0.85)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
      }}>
        {(activeTab === 'tab1' ? chartsTab1 : chartsTab2).map(chart =>
          chartDataMap[chart] ? (
            <ChartCard
              key={chart}
              title={chartTitles[chart]}
              chart={renderChart(chartTypes[chart], chartDataMap[chart])}
            />
          ) : (
            <div
              key={chart}
              style={{
                width: '100%',
                margin: 16,
                padding: 16,
                backgroundColor: '#003366',
                borderRadius: 12,
                textAlign: 'center',
                color: '#999',
                height: 320,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Đang tải {chartTitles[chart]}...
            </div>
          )
        )}
      </div>
    </div>
  );
}
