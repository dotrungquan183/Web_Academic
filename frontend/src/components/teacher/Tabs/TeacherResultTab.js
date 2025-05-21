import React, { useState, useEffect } from 'react';
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
import { FaChartPie, FaUsers, FaChartBar, FaQuestion, FaClipboardList, FaGift, FaRegTimesCircle } from 'react-icons/fa';

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

// Component: Card thống kê trên đầu
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    margin: '0 12px',
    minWidth: '200px',
    flex: 1,
  }}>
    <Icon size={32} color={color} style={{ marginRight: '16px' }} />
    <div>
      <div style={{ fontSize: '14px', color: '#6b7280' }}>{label}</div>
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{value}</div>
    </div>
  </div>
);

// Component: Chart Card
const ChartCard = ({ title, chart }) => (
  <div style={{
    flex: '1 1 calc(33.33% - 24px)',
    margin: '12px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    minWidth: '280px',
  }}>
    <h3 style={{ fontSize: '16px', textAlign: 'center', marginBottom: '12px' }}>{title}</h3>
    <div style={{ height: '250px' }}>
      {chart}
    </div>
  </div>
);

// Component: Sidebar
const Sidebar = ({ onSelect }) => (
  <div style={{
    width: '60px',
    backgroundColor: '#003366',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
    color: 'white'
  }}>
    <FaChartPie size={24} style={{ margin: '20px 0', cursor: 'pointer' }} onClick={() => onSelect('dashboard')} />
    <FaUsers size={24} style={{ margin: '20px 0', cursor: 'pointer' }} onClick={() => onSelect('users')} />
    <FaChartBar size={24} style={{ margin: '20px 0', cursor: 'pointer' }} onClick={() => onSelect('categories')} />
    <FaQuestion size={24} style={{ margin: '20px 0', cursor: 'pointer' }} onClick={() => onSelect('questions')} />
  </div>
);

// Component chính
function TeacherDashboard() {
  const [bountyData, setBountyData] = useState(null);
  const [dummyData, setDummyData] = useState({});
  const [selectedView, setSelectedView] = useState('dashboard');
  const [bountied, setBountied] = useState(0);
  const [nonBountied, setNonBountied] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8000/api/student/student_forum/student_question/student_showquestion/')
      .then((res) => res.json())
      .then((questions) => {
        const bountyCount = questions.filter(q => q.bounty_amount > 0).length;
        const nonBountyCount = questions.length - bountyCount;

        setBountied(bountyCount);
        setNonBountied(nonBountyCount);

        setBountyData({
          labels: ['Treo giải', 'Không treo giải'],
          datasets: [{
            data: [bountyCount, nonBountyCount],
            backgroundColor: ['#facc15', '#60a5fa'],
            borderWidth: 1,
          }],
        });

        setDummyData({
          answered: {
            labels: ['Đã trả lời', 'Chưa trả lời'],
            datasets: [{ data: [40, 20], backgroundColor: ['#4ade80', '#f87171'] }]
          },
          categories: {
            labels: ['Toán', 'Lý', 'Hóa', 'Văn', 'Anh'],
            datasets: [{ label: 'Câu hỏi', data: [10, 20, 15, 8, 12], backgroundColor: '#60a5fa' }]
          },
          topUsers: {
            labels: ['Quân', 'Linh', 'Tú', 'Minh', 'Lan'],
            datasets: [{ label: 'Số câu hỏi', data: [12, 9, 7, 6, 5], backgroundColor: '#facc15' }]
          },
          questionsOverTime: {
            labels: ['T2', 'T3', 'T4', 'T5', 'T6'],
            datasets: [{
              label: 'Số câu hỏi',
              data: [5, 8, 6, 10, 7],
              borderColor: '#10b981',
              backgroundColor: '#d1fae5',
              tension: 0.4
            }]
          },
          bountyDist: {
            labels: ['0-50', '50-100', '100-150', '150+'],
            datasets: [{ label: 'Giải thưởng', data: [8, 12, 5, 3], backgroundColor: ['#a5f3fc', '#38bdf8', '#0ea5e9', '#0369a1'] }]
          },
          extra: {
            labels: ['A', 'B', 'C'],
            datasets: [{ label: 'Extra', data: [5, 10, 15], backgroundColor: ['#a78bfa', '#f472b6', '#34d399'] }]
          }
        });
      });
  }, []);

  const renderCharts = () => (
    <>
      {bountyData && <ChartCard title="Treo giải vs Không treo" chart={<Pie data={bountyData} />} />}
      {dummyData.answered && <ChartCard title="Tỉ lệ câu hỏi trả lời" chart={<Doughnut data={dummyData.answered} />} />}
      {dummyData.categories && <ChartCard title="Câu hỏi theo chuyên mục" chart={<Bar data={dummyData.categories} />} />}
      {dummyData.topUsers && <ChartCard title="Top 5 người hỏi" chart={<Bar data={dummyData.topUsers} options={{ indexAxis: 'y' }} />} />}
      {dummyData.questionsOverTime && <ChartCard title="Biến động câu hỏi" chart={<Line data={dummyData.questionsOverTime} />} />}
      {dummyData.bountyDist && <ChartCard title="Phân bố giải thưởng" chart={<PolarArea data={dummyData.bountyDist} />} />}
    </>
  );

  const renderView = () => {
    switch (selectedView) {
      case 'dashboard':
        return renderCharts();
      case 'users':
      case 'categories':
      case 'questions':
        return (
          <>
            <ChartCard title="Extra 1" chart={<Pie data={dummyData.extra} />} />
            <ChartCard title="Extra 2" chart={<Doughnut data={dummyData.answered} />} />
            <ChartCard title="Extra 3" chart={<Line data={dummyData.questionsOverTime} />} />
            <ChartCard title="Extra 4" chart={<PolarArea data={dummyData.bountyDist} />} />
            <ChartCard title="Extra 5" chart={<Bar data={dummyData.topUsers} />} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Sidebar onSelect={setSelectedView} />
      <div style={{ flex: 1 }}>
        <div style={{ 
          backgroundColor: '#003366', 
          color: 'white', 
          padding: '20px', 
          fontSize: '20px', 
          fontWeight: "bold", 
          textAlign: 'center' 
        }}>
          Dashboard dành cho khóa học giáo viên
        </div>
        {/* Cards thống kê */}
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px', backgroundColor: '#e5e7eb', flexWrap: 'wrap' }}>
          <StatCard icon={FaClipboardList} label="Tổng câu hỏi" value={bountied + nonBountied} color="#2563eb" />
          <StatCard icon={FaGift} label="Có treo giải" value={bountied} color="#facc15" />
          <StatCard icon={FaRegTimesCircle} label="Không treo giải" value={nonBountied} color="#60a5fa" />
        </div>

        {/* Charts */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '20px' }}>
          {renderView()}
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;
