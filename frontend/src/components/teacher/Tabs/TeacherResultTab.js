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
  RadialLinearScale
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

const ChartCard = ({ title, chart }) => (
  <div style={{
    flex: '1 1 20%',
    margin: '12px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    minWidth: '280px',
  }}>
    <h3 style={{ fontSize: '18px', textAlign: 'center', marginBottom: '16px' }}>{title}</h3>
    {chart}
  </div>
);

function TeacherDashboard() {
  const [bountyData, setBountyData] = useState(null);
  const [dummyData, setDummyData] = useState({}); // Dữ liệu mẫu cho các biểu đồ còn lại

  useEffect(() => {
    fetch('http://localhost:8000/api/student/student_forum/student_question/student_showquestion/')
      .then((response) => response.json())
      .then((questions) => {
        // Biểu đồ 1: Câu hỏi có/không treo giải
        const bountied = questions.filter(q => q.bounty_amount > 0).length;
        const nonBountied = questions.length - bountied;

        setBountyData({
          labels: ['Treo giải', 'Không treo giải'],
          datasets: [{
            data: [bountied, nonBountied],
            backgroundColor: ['#facc15', '#60a5fa'],
            borderWidth: 1
          }]
        });

        // Dummy: bạn nên thay bằng dữ liệu thật
        setDummyData({
          answered: {
            labels: ['Đã trả lời', 'Chưa trả lời'],
            datasets: [{
              data: [40, 20],
              backgroundColor: ['#4ade80', '#f87171']
            }]
          },
          categories: {
            labels: ['Toán', 'Lý', 'Hóa', 'Văn', 'Anh'],
            datasets: [{
              label: 'Câu hỏi',
              data: [10, 20, 15, 8, 12],
              backgroundColor: '#60a5fa'
            }]
          },
          topUsers: {
            labels: ['Quân', 'Linh', 'Tú', 'Minh', 'Lan'],
            datasets: [{
              label: 'Số câu hỏi',
              data: [12, 9, 7, 6, 5],
              backgroundColor: '#facc15'
            }]
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
            datasets: [{
              label: 'Giải thưởng',
              data: [8, 12, 5, 3],
              backgroundColor: ['#a5f3fc', '#38bdf8', '#0ea5e9', '#0369a1']
            }]
          }
        });
      })
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));
  }, []);

  return (
    <div style={{
      background: '#f3f4f6',
      minHeight: '100vh',
      padding: '30px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {bountyData && <ChartCard title="Treo giải vs Không treo" chart={<Pie data={bountyData} />} />}
        {dummyData.answered && <ChartCard title="Tỉ lệ câu hỏi trả lời" chart={<Doughnut data={dummyData.answered} />} />}
        {dummyData.categories && <ChartCard title="Câu hỏi theo chuyên mục" chart={<Bar data={dummyData.categories} />} />}
        {dummyData.topUsers && <ChartCard title="Top 5 người hỏi" chart={<Bar data={dummyData.topUsers} options={{ indexAxis: 'y' }} />} />}
        {dummyData.questionsOverTime && <ChartCard title="Biến động câu hỏi" chart={<Line data={dummyData.questionsOverTime} />} />}
        {dummyData.bountyDist && <ChartCard title="Phân bố giải thưởng" chart={<PolarArea data={dummyData.bountyDist} />} />}
      </div>
    </div>
  );
}
export default TeacherDashboard;
