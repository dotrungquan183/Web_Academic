import React from "react";
import {
  MessageCircle,
  Heart,
  ArrowRight,
  Flame
} from "lucide-react";
import "./TrendingDiscussions.css";

const TrendingDiscussions = () => {
  const discussions = [
    {
      id: 1,
      author: {
        name: "phuongkhong1706",
        avatar: "http://localhost:8000/image/1.png",
        time: "2 giờ trước trước",
      },
      title: "Ứng dụng đạo hàm giải toán kinh tế",
      content:
        "Một trang trại rau sạch ở Đà Lạt mỗi ngày thu hoạch được 1 tấn rau. Mỗi ngày, nếu giá bán rau là 30000 đồng/kg thì bán hết rau, nếu giá bán rau tăng...",
      tags: ["đạo hàm", "toán kinh tế"],
      stats: { comments: 36, likes: 50 },
      isHot: true,
    },
    {
      id: 2,
      author: {
        name: "tranvananee",
        avatar:
          "http://localhost:8000/image/3.jpeg",
        time: "Hôm qua",
      },
      title: "Ứng dụng tích phân giải toán chuyển động",
      content:
        "Một viên đạn được bắn thẳng đứng lên trên từ độ cao 2m với vận tốc tại thời điểm t cho bởi công thức v(t) = 100 - 9,8t (m/s), (t = 0 là thời điểm viên đạn...",
      tags: ["tích phân", "toán chuyển động"],
      stats: { comments: 25, likes: 46 },
      isHot: true,
    },
    {
      id: 3,
      author: {
        name: "trungquan183",
        avatar:
          "http://localhost:8000/image/2.jpeg",
        time: "3 ngày trước",
      },
      title: "Ứng dụng đạo hàm",
      content:
        "Trong trung tâm thương mại Lotte thành phố Vinh, có một nhà hàng bán buffet hải sản. Khi nhà hàng bán với giá 200 ngàn đồng một suất thì mỗi ngày...",

      tags: ["đạo hàm", "toán kinh tế"],
      stats: { comments: 32, likes: 35 },
      isHot: true,
    },
  ];

  return (
    <section className="trending-section">
      <div className="trending-container">
        {/* Header */}
        <div className="trending-header">
          <div className="trending-title">
            <div className="trending-icon">
              <Flame size={20} className="icon-white" />
            </div>
            <h2>Bài viết mới</h2>
          </div>
          <button className="view-all-btn">
            Xem thêm
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Cards */}
        <div className="trending-grid">
          {discussions.map((d) => (
            <div key={d.id} className="discussion-card">
              <div className="author-info">
                <img src={d.author.avatar} alt={d.author.name} />
                <div>
                  <h3>{d.author.name}</h3>
                  <p>{d.author.time}</p>
                </div>
              </div>
              <h4 className="discussion-title">{d.title}</h4>
              <p className="discussion-content">{d.content}</p>
              <div className="discussion-tags">
                {d.tags.map((tag, idx) => (
                  <span key={idx} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="discussion-footer">
                <div className="stats">
                  <span><MessageCircle size={16} /> {d.stats.comments}</span>
                  <span><Heart size={16} /> {d.stats.likes}</span>
                </div>
                {d.isHot && (
                  <span className="hot-topic">
                    <Flame size={14} /> Câu hỏi nổi bật
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingDiscussions;
