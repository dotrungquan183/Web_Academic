import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudentForumLayout from "../../Layout";
import { getToken } from '../../../../../auth/authHelper';

function StudentForumQuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [votes, setVotes] = useState(0); // Lưu trữ vote của câu hỏi
  const [votes_ans, setVotes_ans] = useState(0); // Lưu trữ vote của câu trả lời
  const [answers, setAnswers] = useState([]);
  const [userVoteQuestion, setUserVoteQuestion] = useState(null); // Lưu trạng thái vote của user cho câu hỏi
  const [userVoteAnswer, setUserVoteAnswer] = useState(null); // Lưu trạng thái vote của user cho câu trả lời

  useEffect(() => {
    // Lấy câu hỏi
    fetch(`http://localhost:8000/api/student/student_forum/student_question/student_showquestion/`)
      .then((res) => res.json())
      .then((data) => {
        const selectedQuestion = data.find((q) => q.id.toString() === id);
        if (selectedQuestion) {
          setQuestion(selectedQuestion);
          setUserVoteQuestion(selectedQuestion.user_vote);
        }
      });

    // Lấy câu trả lời
    fetch(`http://localhost:8000/api/student/student_forum/student_question/${id}/answers/`)
      .then((res) => res.json())
      .then((data) => {
        setAnswers(data);
        if (data.length > 0) {
          setUserVoteAnswer(data[0].user_vote);
        }
      });

    // Lấy số lượng votes của câu hỏi
    fetch(`http://localhost:8000/api/student/student_forum/student_question/student_detailquestion/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.total_vote_score !== undefined) {
          setVotes(data.total_vote_score); // Cập nhật tổng số vote hiện tại
        }
      });
  }, [id]);

  if (!question) return <p>Đang tải dữ liệu...</p>;

  const handleVote = (type, action) => {
    let updatedVotes = 0;
  
    // Kiểm tra nếu đã vote lên hoặc vote xuống rồi thì cập nhật lại
    if (type === "question") {
      if (action === "up" && userVoteQuestion !== 1) {
        // Nếu chưa vote lên thì tăng lên
        if (userVoteQuestion === -1) {
          // Nếu trước đó vote xuống, thì phải quay lại mức n trước rồi mới tăng lên n + 1
          updatedVotes = votes + 1; // Giảm xuống n rồi tăng lên n + 1
          setVotes(updatedVotes);
          setUserVoteQuestion(0); // Đặt lại trạng thái về chưa vote (n)
        } else {
          updatedVotes = votes + (userVoteQuestion === 2 ? 2 : 1); // Nếu chưa vote thì cộng 1, nếu đã vote lên 2 lần thì cộng 2
          setVotes(updatedVotes);
          setUserVoteQuestion(1); // Lưu trạng thái vote của người dùng
        }
      } else if (action === "down" && userVoteQuestion !== -1) {
        // Nếu chưa giảm xuống 1 lần, giảm xuống trước rồi mới giảm xuống n - 1
        if (userVoteQuestion === 1) {
          updatedVotes = votes - 1; // Giảm xuống mức n trước khi giảm tiếp
          setVotes(updatedVotes); // Cập nhật ngay lập tức khi giảm xuống n
          setUserVoteQuestion(0); // Đặt lại trạng thái vote về 0 (chưa vote)
        } else if (userVoteQuestion === 0) {
          updatedVotes = votes - 1; // Giảm một lần nữa
          setVotes(updatedVotes);
          setUserVoteQuestion(-1); // Lưu trạng thái vote là "down"
        }
      }
    } else if (type === "answer") {
      if (action === "up" && userVoteAnswer !== 1) {
        // Nếu chưa vote lên thì tăng lên
        if (userVoteAnswer === -1) {
          // Nếu trước đó vote xuống, thì phải quay lại mức n trước rồi mới tăng lên n + 1
          updatedVotes = votes_ans + 1; // Giảm xuống n rồi tăng lên n + 1
          setVotes_ans(updatedVotes);
          setUserVoteAnswer(0); // Đặt lại trạng thái về chưa vote (n)
        } else {
          updatedVotes = votes_ans + (userVoteAnswer === 2 ? 2 : 1); // Nếu chưa vote thì cộng 1, nếu đã vote lên 2 lần thì cộng 2
          setVotes_ans(updatedVotes);
          setUserVoteAnswer(1); // Lưu trạng thái vote của người dùng
        }
      } else if (action === "down" && userVoteAnswer !== -1) {
        // Nếu chưa giảm xuống 1 lần, giảm xuống trước rồi mới giảm xuống n - 1
        if (userVoteAnswer === 1) {
          updatedVotes = votes_ans - 1; // Giảm xuống mức n trước khi giảm tiếp
          setVotes_ans(updatedVotes); // Cập nhật ngay lập tức khi giảm xuống n
          setUserVoteAnswer(0); // Đặt lại trạng thái vote về 0 (chưa vote)
        } else if (userVoteAnswer === 0) {
          updatedVotes = votes_ans - 1; // Giảm một lần nữa
          setVotes_ans(updatedVotes);
          setUserVoteAnswer(-1); // Lưu trạng thái vote là "down"
        }
      }
    }
  
    const voteType = action === "up" ? "like" : "dislike";
    const contentType = type === "question" ? "question" : "answer";
    const contentId = type === "question" ? question.id : answers[0]?.id;
  
    const voteData = {
      vote_type: voteType,
      vote_for: contentType,
      content_id: contentId,
    };
  
    const token = getToken();
  
    fetch('http://localhost:8000/api/student/student_forum/student_question/student_detailquestion/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(voteData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Cập nhật lại vote sau khi đã gửi thành công
          if (type === "question") {
            setVotes(updatedVotes);
          } else if (type === "answer") {
            setVotes_ans(updatedVotes);
          }
        } else {
          console.error("Vote failed:", data);
        }
      })
      .catch((error) => console.error("Error during vote:", error));
  };
  

  return (
    <StudentForumLayout>
      <div style={containerStyle}>
        {/* Chi tiết câu hỏi */}
        <div style={questionContainerStyle}>
          <div style={voteContainer}>
            <button
              style={voteButton}
              onClick={() => handleVote("question", "up")}
              disabled={userVoteQuestion === 1} // Nếu đã vote lên, không thể tăng thêm
            >
              ⬆
            </button>
            <span style={voteCount}>{votes}</span>
            <button
              style={voteButton}
              onClick={() => handleVote("question", "down")}
              disabled={userVoteQuestion === -1} // Nếu đã vote xuống, không thể giảm thêm
            >
              ⬇
            </button>
          </div>

          <div style={questionContentStyle}>
            <h2>{question.title}</h2>
            <div style={metaContainerStyle}>
              <span>🕒 {new Date(question.created_at).toLocaleString()}</span>
              <span>
                🔖{" "}
                {question.tags && question.tags.length > 0
                  ? question.tags.join(", ")
                  : "No tags"}
              </span>
            </div>
            <p>{question.content}</p>
          </div>
        </div>

        {/* Khung câu trả lời */}
        <div style={answerContainer}>
          <label style={answerCountLabel}>Tổng số câu trả lời: {answers.length}</label>
          {answers.length > 0 ? (
            <ul>
              {answers.map((ans) => (
                <li key={ans.id} style={answerItemStyle}>
                  <div style={voteContainer}>
                    <button
                      style={voteButton}
                      onClick={() => handleVote("answer", "up")}
                      disabled={userVoteAnswer === 1} // Nếu đã vote lên cho câu trả lời, không cho phép tăng thêm
                    >
                      ⬆
                    </button>
                    <span style={voteCount}>{votes_ans}</span>
                    <button
                      style={voteButton}
                      onClick={() => handleVote("answer", "down")}
                      disabled={userVoteAnswer === -1} // Nếu đã vote xuống cho câu trả lời, không cho phép giảm thêm
                    >
                      ⬇
                    </button>
                  </div>
                  <div style={answerContentStyle}>
                    <p>{ans.content}</p>
                    <span>🕒 {new Date(ans.created_at).toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p> </p>
          )}
        </div>
      </div>
    </StudentForumLayout>
  );
}


const containerStyle = {
  backgroundColor: "#f8f9fa",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "30px",
  marginTop: "15px",
  marginLeft: "160px",
  width: "1020px",
};

const questionContainerStyle = {
  backgroundColor: "#ffffff",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
};

const voteContainer = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginRight: "20px",
};

const voteButton = {
  fontSize: "40px",
  cursor: "pointer",
  border: "none",
  background: "none",
  color: "#003366",
};

const voteCount = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#003366",
};

const questionContentStyle = {
  flex: 1,
  fontSize: "16px",
  color: "#003366",
};

const answerContainer = {
  backgroundColor: "#ffffff",
  padding: "20px 40px 30px 0px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const metaContainerStyle = {
  display: "flex",
  justifyContent: "flex-begin",
  fontSize: "16px", // Giảm font size
  marginBottom: "10px",
  gap: "15px",
};

const answerCountLabel = { fontSize: "16px", fontWeight: "bold", marginBottom: "15px", color: "#003366", marginLeft: "40px" };
const answerItemStyle = { display: "flex", marginBottom: "15px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px" };
const answerContentStyle = { flex: 1 };

export default StudentForumQuestionDetail;
