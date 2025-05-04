import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function TeacherResultTab() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/student/student_forum/student_question/student_showquestion/')
      .then((response) => response.json())
      .then((questions) => {
        // Tính toán số câu hỏi có và không treo giải
        const bountied = questions.filter(q => q.bounty_amount > 0).length;
        const nonBountied = questions.length - bountied;

        setChartData({
          labels: ['Treo giải', 'Không treo giải'],
          datasets: [{
            data: [bountied, nonBountied],
            backgroundColor: ['#facc15', '#60a5fa'],
            borderWidth: 1
          }]
        });
      })
      .catch((error) => console.error('Lỗi khi lấy dữ liệu:', error));
  }, []);

  return (
    <div>
      <h2>Kết quả giảng viên</h2>
      {chartData ? (
        <div style={{ width: '400px', margin: 'auto' }}>
          <Pie data={chartData} />
        </div>
      ) : (
        <p>Đang tải biểu đồ...</p>
      )}
    </div>
  );
}

export default TeacherResultTab;
