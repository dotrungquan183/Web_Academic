import React, { useEffect, useState,  useRef } from "react";
import { useParams } from "react-router-dom";
import TeacherForumLayout from "../../Layout";
import { getToken } from "../../../../../auth/authHelper";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaFire, FaLink, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function TeacherUnanswersForumQuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [userVoteQuestion, setUserVoteQuestion] = useState(0);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(null); // ID của câu trả lời đang được chỉnh sửa
  const [editContent, setEditContent] = useState(""); // Nội dung sửa
  const token = localStorage.getItem("token");
  const answerInputRef = useRef(null);
  const [showCommentInputId, setShowCommentInputId] = useState(null);
  const [questionCommentText, setQuestionCommentText] = useState("");
  const [answerCommentText, setAnswerCommentText] = useState({});
  const [activeAnswerId, setActiveAnswerId] = useState(null);
  // Comment của câu hỏi
  const [comments, setComments] = useState([]);
  const [visibleCommentCount, setVisibleCommentCount] = useState(5);
  // Comment của câu trả lời
  const [answerComments, setAnswerComments] = useState({});
  const [visibleAnswerComments, setVisibleAnswerComments] = useState({});

  const [acceptedAnswerId, setAcceptedAnswerId] = useState(null);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [hotQuestions, setHotQuestions] = useState([]);
  
  
  useEffect(() => {
      fetch("http://localhost:8000/api/student/student_forum/student_question/student_hotquestion/")
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch hot questions");
          }
          return res.json();
        })
        .then((data) => {
          console.log("Fetched hot questions:", data);
          setHotQuestions(data);
        })
        .catch((err) => {
          console.error("Error fetching hot questions:", err);
        });
  }, []);
  

  useEffect(() => {
    console.log("Current questionId:", id);
    if (!id) return;
  
    fetch(`http://localhost:8000/api/student/student_forum/student_question/student_relatedquestion/${id}/`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch related questions");
        }
        return res.json();
      })
      .then(data => {
        console.log("Fetched related questions:", data);  // Kiểm tra xem API có trả về dữ liệu đúng không
        setRelatedQuestions(data);
      })
      .catch(err => {
        console.error("Error fetching related questions:", err);
      });
  }, [id]);  

  // Lấy thông tin người dùng từ token
  useEffect(() => {
    const token = getToken();
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.user_id);
        setUserName(user.username || "Người dùng ẩn danh");
      } catch (err) {
        console.error("❌ Invalid token");
      }
    }
  }, []);

  // Lấy dữ liệu câu hỏi và danh sách câu trả lời
  useEffect(() => {
    // Lấy câu hỏi
    fetch("http://localhost:8000/api/student/student_forum/student_question/student_showquestion/")
    .then((res) => res.json())
    .then((data) => {
      const selectedQuestion = data.find((q) => q.id.toString() === id);
      if (selectedQuestion) {
        setQuestion(selectedQuestion);
        setAcceptedAnswerId(selectedQuestion.accepted_answer_id); // 👈 Thêm dòng này
      }
    });

    // Lấy câu trả lời
    fetch(`http://localhost:8000/api/student/student_forum/student_question/student_ansquestion/?question_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const token = getToken();
        let localUserId = null;
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            localUserId = payload.user_id;
          } catch (err) {
            console.error("❌ Token decode error", err);
          }
        }

        const formattedAnswers = data.map((ans) => {
        const voteKey = `answer_vote_${ans.id}-${localUserId}`;
        const storedVote = localStorage.getItem(voteKey);
        const userVote = storedVote ? parseInt(storedVote, 10) : 0;
        return {
          id: ans.id,
          username: ans.username,
          content: ans.content,
          created_at: ans.created_at,
          userVote,
          like: ans.like, // ✅ thêm
          dislike: ans.dislike, // ✅ thêm
          totalVote: ans.totalVote, // ✅ thêm
          user_id: ans.user_id, // ✅ thêm
        };
      });


        setAnswers(formattedAnswers);
      })
      .catch((error) => {
        console.error("❌ Lỗi khi lấy dữ liệu câu trả lời:", error);
      });
  }, [id]);

  // Lấy trạng thái vote của người dùng cho câu hỏi
  useEffect(() => {
    if (userId) {
      const voteKey = `question_vote_${id}-${userId}`;
      const storedVote = localStorage.getItem(voteKey);
      setUserVoteQuestion(storedVote ? parseInt(storedVote, 10) : 0);
    }
  }, [id, userId]);
  const fetchComments = async (questionId) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/student/student_forum/student_question/student_comment/?type_comment=question&content_id=${questionId}`
      );
  
      setComments(prev => ({
        ...prev,
        [questionId]: res.data.comments
      }));
  
      setVisibleCommentCount(prev => ({
        ...prev,
        [questionId]: 5 // Khởi tạo 5 comment đầu tiên cho question đó
      }));
    } catch (error) {
      console.error("Lỗi khi lấy comment:", error);
    }
  };
  
  
// Lấy comment cho câu trả lời
const fetchAnswerComments = async (answerId) => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/student/student_forum/student_question/student_comment/?type_comment=answer&content_id=${answerId}`
    );
    setAnswerComments((prev) => ({
      ...prev,
      [answerId]: res.data.comments,
    }));
  } catch (error) {
    console.error("Lỗi khi lấy comment câu trả lời:", error);
  }
};

const handleDeleteAnswer = (answerId) => {
  const token = getToken();
  if (!token) {
    alert("❌ Bạn chưa đăng nhập!");
    return;
  }

  if (!window.confirm("💾 Lưu thay đổi?")) return;

  fetch(`http://localhost:8000/api/student/student_forum/student_question/student_ansquestion/${answerId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (res.ok) {
        alert("✅ Đã xoá câu trả lời thành công!");
      } else {
        const data = await res.json();
        if (res.status === 403) {
          alert("❌ Bạn không có quyền xoá câu trả lời này!");
        } else {
          alert(`❌ Lỗi: ${data.error || "Không thể xoá câu trả lời này."}`);
        }
      }

      // Reload trang sau khi xử lý
      window.location.reload();
    })
    .catch((error) => {
      console.error("❌ Lỗi khi xoá câu trả lời:", error);
      alert("❌ Đã xảy ra lỗi khi xoá.");
      window.location.reload();
    });
};
  
const handleDeleteQuestion = (questionId) => {
  const token = getToken();
  if (!token) {
    alert("❌ Bạn chưa đăng nhập!");
    return;
  }

  if (!window.confirm("💾 Lưu thay đổi?")) return;

  fetch(`http://localhost:8000/api/student/student_forum/student_question/student_showquestion/${questionId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (res.ok) {
        alert("✅ Đã xoá câu hỏi thành công!");
        
        // Chuyển hướng về trang câu hỏi
        window.location.href = "http://localhost:3000/studentforum/question"; // Địa chỉ trang muốn chuyển đến
      } else {
        const data = await res.json();
        if (res.status === 403) {
          alert("❌ Bạn không có quyền xoá câu hỏi này!");
        } else {
          alert(`❌ Lỗi: ${data.error || "Không thể xoá câu hỏi này."}`);
        }
      }

      // Không cần reload lại trang ở đây vì đã chuyển hướng
      //window.location.reload();
    })
    .catch((error) => {
      console.error("❌ Lỗi khi xoá câu hỏi:", error);
      alert("❌ Đã xảy ra lỗi khi xoá.");
      //window.location.reload();  // Có thể không cần thiết nữa
    });
};


  const handleOpenComment = (questionId) => {
    const isSame = showCommentInputId === questionId;
    setShowCommentInputId(isSame ? null : questionId);
    if (!isSame) {
      fetchComments(questionId);
    }
  };
  // Sử dụng useEffect để gọi handleOpenComment khi vào trang

  const handleSubmitComment = async (contentId, type) => {
    try {
      const isQuestion = type === "question";
  
      const comment = isQuestion
        ? questionCommentText.trim()
        : answerCommentText[contentId]?.trim();
  
      if (!comment) {
        alert("❗ Vui lòng nhập nội dung bình luận");
        return;
      }
  
      const token = getToken();
  
      const response = await fetch("http://127.0.0.1:8000/api/student/student_forum/student_question/student_comment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content_id: contentId,
          type_comment: type,
          content: comment,
        }),
      });
  
      if (!response.ok) {
        const errText = await response.json();
        console.error("❌ Server error:", errText);
        throw new Error("Không gửi được bình luận");
      }
  
      // 👇 Reset input nhưng KHÔNG đóng lại comment box
      if (isQuestion) {
        setQuestionCommentText("");
  
        // ✅ Fetch lại danh sách comment mới nhất
        fetchComments(contentId);
      } else {
        setAnswerCommentText((prev) => ({
          ...prev,
          [contentId]: "",
        }));
  
        // ✅ Fetch lại comment câu trả lời nếu bạn có hàm fetch riêng
        fetchAnswerComments(contentId);
      }
  
      alert("✅ Bình luận đã được gửi thành công!");
    } catch (err) {
      console.error("Lỗi gửi bình luận:", err);
      alert("⚠️ Có lỗi xảy ra khi gửi bình luận.");
    }
  };
  
  
  const handleEditCommentAnswer = (answerId, commentId) => {
    const token = getToken();
    if (!token) {
      alert("❌ Bạn chưa đăng nhập!");
      return;
    }
  
    const decoded = jwtDecode(token);
    const currentUserId = decoded.user_id || decoded.id || decoded.sub;
  
    const commentList = answerComments[answerId] || [];
    console.log("📌 Danh sách comment của answerId =", answerId);
    console.table(commentList);
  
    const comment = commentList.find((c) => Number(c.id) === Number(commentId));
    if (!comment) {
      alert("❌ Không tìm thấy bình luận!");
      console.warn("❌ Không tìm thấy commentId trong danh sách:", commentId);
      return;
    }
  
    console.log("🧩 Full comment object:", comment);
  
    // 🧠 Lấy user ID từ comment
    const commentUserId =
      typeof comment.user_id !== "undefined"
        ? comment.user_id
        : typeof comment.user === "object" && comment.user !== null
        ? comment.user.id
        : comment.user ?? null;
  
    console.log("👤 currentUserId:", currentUserId);
    console.log("✏️ commentUserId:", commentUserId);
  
    if (Number(commentUserId) !== Number(currentUserId)) {
      alert("❌ Bạn không có quyền chỉnh sửa bình luận này!");
      console.warn("🚫 Không phải chủ sở hữu của comment:", comment);
      return;
    }
  
    const newContent = prompt("📝 Nhập nội dung mới cho bình luận:", comment.content);
    if (newContent === null || newContent.trim() === "") {
      alert("❌ Nội dung không hợp lệ!");
      return;
    }
  
    handleSubmitEditCommentAnswer(commentId, newContent, answerId);
  };   
  
  
  const handleSubmitEditCommentAnswer = async (commentId, newContent, answerId) => {
    const token = getToken();
    if (!token) {
      alert("❌ Không có token xác thực");
      console.error("handleSubmitEditComment: Missing token");
      return;
    }
  
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/student/student_forum/student_question/student_comment/${commentId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newContent }),
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        alert(`❌ Lỗi: ${result.error || "Không rõ lỗi"}`);
        console.error("handleSubmitEditComment: Server returned error", {
          status: response.status,
          body: result,
        });
        return;
      }
  
      alert("✅ Bình luận đã được cập nhật!");
      console.log("handleSubmitEditComment: Cập nhật thành công", result);
  
      // ✅ Reload lại danh sách comment sau khi sửa
      await fetchAnswerComments(answerId);
    } catch (error) {
      alert("❌ Có lỗi xảy ra khi gửi request.");
      console.error("handleSubmitEditComment: Lỗi khi gọi API", error);
    }
  };  
  
  const handleDeleteCommentAnswer = (answerId, commentId) => {
    const token = getToken();
    if (!token) {
      alert("❌ Bạn chưa đăng nhập!");
      return;
    }
  
    const decoded = jwtDecode(token);
    const currentUserId = decoded.user_id || decoded.id || decoded.sub;
  
    const commentList = answerComments[answerId] || [];
    console.log("📌 Danh sách comment của answerId =", answerId);
    console.table(commentList);
  
    const comment = commentList.find((c) => Number(c.id) === Number(commentId));
    if (!comment) {
      alert("❌ Không tìm thấy bình luận!");
      console.warn("❌ Không tìm thấy commentId trong danh sách:", commentId);
      return;
    }
  
    console.log("🧩 Full comment object:", comment);
  
    // 🧠 Lấy user ID từ comment
    const commentUserId =
      typeof comment.user_id !== "undefined"
        ? comment.user_id
        : typeof comment.user === "object" && comment.user !== null
        ? comment.user.id
        : comment.user ?? null;
  
    console.log("👤 currentUserId:", currentUserId);
    console.log("✏️ commentUserId:", commentUserId);
  
    if (Number(commentUserId) !== Number(currentUserId)) {
      alert("❌ Bạn không có quyền xoá bình luận này!");
      console.warn("🚫 Không phải chủ sở hữu của comment:", comment);
      return;
    }
  
    if (window.confirm("Bạn có chắc muốn xoá bình luận này?")) {
      fetch(`http://localhost:8000/api/student/student_forum/student_question/student_comment/${commentId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            // Cập nhật lại danh sách comment nếu cần
            setAnswerComments((prev) => {
              const updated = { ...prev };
              updated[answerId] = updated[answerId].filter((c) => c.id !== commentId);
              return updated;
            });
            alert("✅ Đã xoá bình luận thành công!");
          } else {
            alert("❌ Không thể xoá bình luận này.");
          }
        })
        .catch((error) => console.error("❌ Lỗi khi xoá bình luận:", error));
    }
  };  

  const handleEditCommentQuestion = (questionId, commentId) => {
    const token = getToken();
    if (!token) {
      alert("❌ Bạn chưa đăng nhập!");
      return;
    }
  
    const decoded = jwtDecode(token);
    const currentUserId = decoded.user_id || decoded.id || decoded.sub;
  
    const rawData = comments[questionId];
  
    let commentList = [];
  
    // ✅ Nếu là 1 comment object → chuyển thành array
    if (rawData && !Array.isArray(rawData) && typeof rawData === "object") {
      commentList = [rawData];
    } else if (Array.isArray(rawData)) {
      commentList = rawData;
    }
  
    console.log("📌 Danh sách comment của questionId =", questionId);
    console.table(commentList);
  
    const comment = commentList.find((c) => Number(c.id) === Number(commentId));
    if (!comment) {
      alert("❌ Không tìm thấy bình luận!");
      console.warn("❌ Không tìm thấy commentId trong danh sách:", commentId);
      return;
    }
  
    console.log("🧩 Full comment object:", comment);
  
    const commentUserId =
      typeof comment.user_id !== "undefined"
        ? comment.user_id
        : typeof comment.user === "object" && comment.user !== null
        ? comment.user.id
        : comment.user ?? null;
  
    console.log("👤 currentUserId:", currentUserId);
    console.log("✏️ commentUserId:", commentUserId);
  
    if (Number(commentUserId) !== Number(currentUserId)) {
      alert("❌ Bạn không có quyền chỉnh sửa bình luận này!");
      console.warn("🚫 Không phải chủ sở hữu của comment:", comment);
      return;
    }
  
    const newContent = prompt("📝 Nhập nội dung mới cho bình luận:", comment.content);
    if (newContent === null || newContent.trim() === "") {
      alert("❌ Nội dung không hợp lệ!");
      return;
    }
  
    handleSubmitEditCommentQuestion(commentId, newContent, questionId);
  };  

  const handleSubmitEditCommentQuestion = async (commentId, newContent, questionId) => {
    const token = getToken();
    if (!token) {
      alert("❌ Không có token xác thực");
      console.error("handleSubmitEditCommentQuestion: Missing token");
      return;
    }
  
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/student/student_forum/student_question/student_comment/${commentId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newContent }),
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        alert(`❌ Lỗi: ${result.error || "Không rõ lỗi"}`);
        console.error("handleSubmitEditCommentQuestion: Server returned error", {
          status: response.status,
          body: result,
        });
        return;
      }
  
      alert("✅ Bình luận đã được cập nhật!");
      console.log("handleSubmitEditCommentQuestion: Cập nhật thành công", result);
  
      // ✅ Reload lại danh sách comment của câu hỏi sau khi sửa
      await fetchComments(questionId);
    } catch (error) {
      alert("❌ Có lỗi xảy ra khi gửi request.");
      console.error("handleSubmitEditCommentQuestion: Lỗi khi gọi API", error);
    }
  };
  
  const handleDeleteCommentQuestion = (questionId, commentId) => {
    const token = getToken();
    if (!token) {
      alert("❌ Bạn chưa đăng nhập!");
      return;
    }
  
    const decoded = jwtDecode(token);
    const currentUserId = decoded.user_id || decoded.id || decoded.sub;
  
    const commentList = comments[questionId] || [];
    console.log("📌 Danh sách comment của questionId =", questionId);
    console.table(commentList);
  
    const comment = commentList.find((c) => Number(c.id) === Number(commentId));
    if (!comment) {
      alert("❌ Không tìm thấy bình luận!");
      console.warn("❌ Không tìm thấy commentId trong danh sách:", commentId);
      return;
    }
  
    console.log("🧩 Full comment object:", comment);
  
    const commentUserId =
      typeof comment.user_id !== "undefined"
        ? comment.user_id
        : typeof comment.user === "object" && comment.user !== null
        ? comment.user.id
        : comment.user ?? null;
  
    console.log("👤 currentUserId:", currentUserId);
    console.log("🗑️ commentUserId:", commentUserId);
  
    if (Number(commentUserId) !== Number(currentUserId)) {
      alert("❌ Bạn không có quyền xoá bình luận này!");
      console.warn("🚫 Không phải chủ sở hữu của comment:", comment);
      return;
    }
  
    if (window.confirm("Bạn có chắc muốn xoá bình luận này?")) {
      fetch(`http://localhost:8000/api/student/student_forum/student_question/student_comment/${commentId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            // Cập nhật lại danh sách comment
            setComments((prev) => {
              const updated = { ...prev };
              updated[questionId] = updated[questionId].filter((c) => c.id !== commentId);
              return updated;
            });
            alert("✅ Đã xoá bình luận thành công!");
          } else {
            alert("❌ Không thể xoá bình luận này.");
          }
        })
        .catch((error) => console.error("❌ Lỗi khi xoá bình luận:", error));
    }
  };
  
  // Xử lý vote
  const handleVote = (action, type = "question", contentId = null) => {
    if (!userId) return;
  
    const voteKey = `${type}_vote_${contentId}-${userId}`;
    const isLike = action === "like";
  
    const currentVote =
      type === "question"
        ? userVoteQuestion
        : answers.find((a) => a.id === contentId)?.userVote || 0;
  
    let newVote = 0;
    if (currentVote === 1 && isLike) newVote = 0;
    else if (currentVote === -1 && !isLike) newVote = 0;
    else newVote = isLike ? 1 : -1;
  
    localStorage.setItem(voteKey, newVote.toString());
  
    if (type === "question") {
      setQuestion((prev) => {
        if (!prev) return prev;
  
        let updatedLike = prev.like;
        let updatedDislike = prev.dislike;
  
        if (currentVote === 1) updatedLike -= 1;
        else if (currentVote === -1) updatedDislike -= 1;
  
        if (newVote === 1) updatedLike += 1;
        else if (newVote === -1) updatedDislike += 1;
  
        return {
          ...prev,
          like: updatedLike,
          dislike: updatedDislike,
          totalVote: updatedLike - updatedDislike,
        };
      });
  
      setUserVoteQuestion(newVote);
    } else {
      setAnswers((prevAnswers) =>
        prevAnswers.map((ans) => {
          if (ans.id !== contentId) return ans;
  
          let updatedLike = ans.like;
          let updatedDislike = ans.dislike;
  
          if (currentVote === 1) updatedLike -= 1;
          else if (currentVote === -1) updatedDislike -= 1;
  
          if (newVote === 1) updatedLike += 1;
          else if (newVote === -1) updatedDislike += 1;
  
          return {
            ...ans,
            userVote: newVote,
            like: updatedLike,
            dislike: updatedDislike,
            totalVote: updatedLike - updatedDislike,
          };
        })
      );
    }
  
    const token = getToken();
    fetch("http://localhost:8000/api/student/student_forum/student_question/student_detailquestion/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        vote_type: isLike ? "like" : "dislike",
        vote_for: type,
        content_id: contentId,
      }),
    }).then(() => {
      // Sau khi gửi vote thành công, tải lại câu hỏi và câu trả lời từ server
      fetch(`http://localhost:8000/api/student/student_forum/student_question/student_showquestion/`)
        .then((res) => res.json())
        .then((data) => {
          const selectedQuestion = data.find((q) => q.id.toString() === id);
          if (selectedQuestion) {
            setQuestion(selectedQuestion);
          }
        });
  
      fetch(`http://localhost:8000/api/student/student_forum/student_question/student_ansquestion/?question_id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          const formattedAnswers = data.map((ans) => {
            const voteKey = `answer_vote_${ans.id}-${userId}`;
            const storedVote = localStorage.getItem(voteKey);
            const userVote = storedVote ? parseInt(storedVote, 10) : 0;
            return {
              id: ans.id,
              username: ans.username,
              content: ans.content,
              created_at: ans.created_at,
              userVote,
              like: ans.like,
              dislike: ans.dislike,
              totalVote: ans.totalVote,
            };
          });
          setAnswers(formattedAnswers);
        });
    }).catch((error) => console.error("❌ Error during vote:", error));
  };
  
  

  // Xử lý gửi câu trả lời
  const handlePostAnswer = async () => {
    if (!newAnswer.trim()) return;
  
    const token = getToken();
    if (!token) {
      alert("Vui lòng đăng nhập để đăng câu trả lời.");
      return;
    }
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const user_id = payload.user_id;
  
      const answerData = {
        question_id: parseInt(id),
        user_id: user_id,
        content: newAnswer.trim(),
      };
  
      const response = await fetch("http://localhost:8000/api/student/student_forum/student_question/student_ansquestion/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(answerData),
      });
  
      if (!response.ok) {
        const errText = await response.text();
        console.error("❌ Response không ok:", errText);
        throw new Error("Gửi câu trả lời thất bại.");
      }
  
      const result = await response.json();
  
      const newAns = {
        id: result.id,
        username: userName,
        content: newAnswer,
        created_at: new Date().toISOString(),
        userVote: 0,
      };
  
      const voteKey = `answer_vote_${newAns.id}-${user_id}`;
      localStorage.setItem(voteKey, "0");
  
      setAnswers((prev) => [newAns, ...prev]);
      setNewAnswer("");
      alert("Đăng câu trả lời thành công!");
      window.location.reload();
  
      // Sau khi đăng câu trả lời mới, tải lại danh sách câu trả lời
      fetch(`http://localhost:8000/api/student/student_forum/student_question/student_ansquestion/?question_id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          const formattedAnswers = data.map((ans) => {
            const voteKey = `answer_vote_${ans.id}-${userId}`;
            const storedVote = localStorage.getItem(voteKey);
            const userVote = storedVote ? parseInt(storedVote, 10) : 0;
            return {
              id: ans.id,
              username: ans.username,
              content: ans.content,
              created_at: ans.created_at,
              userVote,
              like: ans.like,
              dislike: ans.dislike,
              totalVote: ans.totalVote,
            };
          });
          setAnswers(formattedAnswers);
        });
    } catch (error) {
      console.error("❌ Lỗi khi gửi câu trả lời:", error);
      alert("Đăng câu trả lời thất bại. Vui lòng thử lại sau.");
    }
  };
  
  const handleEditAnswer = (ans) => {
    setIsEditing(ans.id); // Đánh dấu câu trả lời đang chỉnh sửa
    setEditContent(ans.content); // Cập nhật nội dung câu trả lời
    answerInputRef.current?.scrollIntoView({ behavior: "smooth" }); // Cuộn đến phần nhập liệu
  };
  
  const getTimeAgo = (isoString) => {
    const now = new Date();
    const created = new Date(isoString);
    const diffInSeconds = Math.floor((now - created) / 1000);

    if (diffInSeconds < 60) {
        return "vừa xong";
    }

    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  };


  const submitEditedAnswer = async () => {
    if (!editContent.trim()) {
      alert("Nội dung không được để trống!");
      return;
    }
  
    try {
      const question_id = parseInt(id);
      const answer_id = isEditing;
  
      const url = `http://localhost:8000/api/student/student_forum/student_question/student_ansquestion/${answer_id}/`;
      console.log("🔧 Gửi PUT đến:", url);
  
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editContent,
          question_id: question_id,
        }),
      });
  
      const resText = await res.text();
      console.log("🔍 Response từ server:", resText);
  
      let data;
      try {
        data = JSON.parse(resText);
      } catch (err) {
        console.error("❌ Không thể parse JSON:", err.message);
        alert("Phản hồi từ server không hợp lệ (không phải JSON).");
        return;
      }
  
      if (res.ok) {
        alert("✅ Cập nhật thành công!");
        const nowISOString = new Date().toISOString();
  
        const updatedAnswers = answers.map((ans) =>
          ans.id === answer_id
            ? {
                ...ans,
                content: editContent,
                created_at: nowISOString,
                timeAgo: getTimeAgo(nowISOString),
              }
            : ans
        );
  
        setAnswers(updatedAnswers);
        setIsEditing(null);
        setEditContent("");
      } else {
        alert(data.error || "❌ Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("🔥 FETCH ERROR:", err.message, err.stack);
      alert("Đã xảy ra lỗi khi cập nhật. Kiểm tra kết nối hoặc thử lại sau.");
    }
  };

  const handleMarkAsCorrect = async (questionId, answerId, questionOwnerId) => {
    const token = getToken();
  
    if (!token) {
      alert("❌ Bạn chưa đăng nhập!");
      return;
    }
  
    const decoded = jwtDecode(token);
    const currentUserId = decoded.user_id;
  
    if (currentUserId !== questionOwnerId) {
      alert("❌ Bạn không có quyền đánh dấu câu trả lời đúng!");
      return;
    }
  
    // ✅ Cập nhật trước để checkbox phản hồi ngay
    const previousAcceptedId = acceptedAnswerId;
    setAcceptedAnswerId(answerId);
  
    try {
      const getQuestionRes = await fetch(
        `http://localhost:8000/api/student/student_forum/student_question/student_askquestion/${questionId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!getQuestionRes.ok) {
        throw new Error("Không thể lấy thông tin câu hỏi.");
      }
  
      const questionData = await getQuestionRes.json();
  
      const putRes = await fetch(
        `http://localhost:8000/api/student/student_forum/student_question/student_askquestion/${questionId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: questionData.title,
            content: questionData.content,
            tags: questionData.tags,
            bounty_amount: questionData.bounty_amount,
            accepted_answer_id: answerId,
          }),
        }
      );
  
      const putResult = await putRes.json();
  
      if (putRes.ok) {
        alert("✅ Đã đánh dấu câu trả lời là đúng!");
      } else {
        // ❌ Rollback lại nếu lỗi
        setAcceptedAnswerId(previousAcceptedId);
        alert(
          `❌ Lỗi: ${putResult.error || "Không thể đánh dấu câu trả lời này."}`
        );
      }
    } catch (error) {
      console.error("❌ Lỗi khi đánh dấu câu trả lời đúng:", error);
      // ❌ Rollback lại nếu lỗi
      setAcceptedAnswerId(previousAcceptedId);
      alert("❌ Đã xảy ra lỗi.");
    }
  };
  

  const scrollToAnswerInput = () => {
    if (answerInputRef.current) {
      answerInputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  if (!question) return <p>Đang tải dữ liệu...</p>;

  console.log(relatedQuestions);

  return (
    <TeacherForumLayout>
      <div style={layoutStyle}>
      <div style={containerStyle}>
      <div style={questionContainerStyle}>
         {/* Nút xoá ở góc phải trên */}
        <button
          onClick={() => handleDeleteQuestion(question.id)}
          style={{
            position: "absolute",
            top: "35px",
            right: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            transition: "background-color 0.2s",
            fontSize: "1em",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8d7da")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          title="Xoá câu hỏi"
        >
          <FaTrash style={{ color: "#003366", fontSize: "1.5em" }} />
        </button>
        <div style={questionContentStyle}>
          <h2>{question.title}</h2>
          <div style={metaContainerStyle}>
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={() => handleVote("like", "question", question.id)}
                style={{
                  ...voteButton,
                  backgroundColor: userVoteQuestion === 1 ? "#003366" : "#eee",
                  color: userVoteQuestion === 1 ? "#fff" : "#000",
                }}
              >
                👍
              </button>
              <button
                onClick={() => handleVote("dislike", "question", question.id)}
                style={{
                  ...voteButton,
                  backgroundColor: userVoteQuestion === -1 ? "#003366" : "#eee",
                  color: userVoteQuestion === -1 ? "#fff" : "#000",
                }}
              >
                👎
              </button>
            </div>
            <span>🕒 {new Date(question.created_at).toLocaleString()}</span>
            <span>
              🔖 {question.tags?.length ? question.tags.join(", ") : "No tags"}
            </span>
          </div>

          <p>{question.content}</p>

          {/* Thông tin thêm về câu hỏi */}
          <div style={containerQuestionSelectStyle}>
            <div style={topRowStyle}>
              <div style={buttonGroupStyle}>
                <button style={actionButtonStyle}>↗️ Chia sẻ</button>
                <button
                  style={actionButtonStyle}
                  onClick={() =>
                    navigate("/teacherforum/question/askquestion", {
                      state: { question: question }, // 👈 truyền object câu hỏi
                    })
                  }
                >
                  ✏️ Chỉnh sửa
                </button>
                <button style={actionButtonStyle}>👁️ Theo dõi</button>
              </div>

              {/* 👇 Chỗ hiển thị thời gian chỉnh sửa */}
              <span>
                {question.created_at ? (
                  (() => {
                    const updatedAt = new Date(question.created_at);
                    if (isNaN(updatedAt.getTime())) return "⛔ Invalid updated_at";

                    const now = new Date();
                    const diffInSeconds = Math.floor((now - updatedAt) / 1000);
                    if (diffInSeconds < 60) return "Vừa xong";

                    const diffInMinutes = Math.floor(diffInSeconds / 60);
                    return `Đã chỉnh sửa ${diffInMinutes} phút trước`;
                  })()
                ) : (
                  "⛔ Không có updated_at"
                )}
              </span>

            </div>

            {/* Nút Bình luận */}
            <div style={commentButtonContainerStyle}>
              <button
                style={commentButtonStyle}
                onClick={() => handleOpenComment(question.id)}
              >
                💬 {showCommentInputId === question.id ? "Ẩn bình luận" : "Xem bình luận"}
              </button>
            </div>


            {showCommentInputId === question.id && (
              <div style={{ marginTop: "10px" }}>
                {/* Hiển thị các comment (giới hạn số lượng) */}
                {(comments[question.id] || []).slice(0, visibleCommentCount[question.id] || 0).map((c) => (
                  <div key={c.id} style={{ marginBottom: "10px", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ marginRight: "8px" }}>👤 {c.username}</span>
                      <span style={{ fontSize: "12px", color: "#666", marginRight: "8px" }}>⏰ {c.created_at}</span>

                      <FaEdit 
                        style={{ marginRight: "8px", cursor: "pointer" }} 
                        onClick={() => handleEditCommentQuestion(question.id, c.id)} 
                      />
                      <FaTrash 
                        style={{ cursor: "pointer", color: "#003366" }} 
                        onClick={() => handleDeleteCommentQuestion(question.id, c.id)} 
                      />
                    </div>
                    <div style={{ marginLeft: "10px" }}>{c.content}</div>
                  </div>
                ))}

                {/* Nút "Hiển thị thêm bình luận" nếu còn bình luận chưa hiển thị */}
                {comments[question.id] &&
                  visibleCommentCount[question.id] < comments[question.id].length && (
                    <button
                      style={{
                        marginBottom: "10px",
                        color: "#007bff",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontStyle: "italic"
                      }}
                      onClick={() =>
                        setVisibleCommentCount(prev => ({
                          ...prev,
                          [question.id]: (prev[question.id] || 0) + 5
                        }))
                      }
                    >
                      Hiển thị thêm bình luận...
                    </button>
                )}


                {/* Khung nhập bình luận */}
                <textarea
                  placeholder="Nhập bình luận của bạn..."
                  value={questionCommentText}
                  onChange={(e) => setQuestionCommentText(e.target.value)}
                  style={commentTextareaStyle}
                />
                <button
                  style={commentButtonSendStyle}
                  onClick={() => handleSubmitComment(question.id, "question")}
                >
                  Gửi bình luận
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      <div style={answerContainer}>
        <label style={answerCountLabel}>
          Tổng số câu trả lời: {answers.length}
        </label>

        {answers.length > 0 ? (
          <ul>
            {answers.map((ans) => (
              <li key={ans.id} style={answerItemStyle}>
                <div style={{ ...singleAnswerBox, position: "relative" }}>
                {/* Nút xoá ở góc phải trên */}
                <button
                  onClick={() => handleDeleteAnswer(ans.id)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                    transition: "background-color 0.2s",
                    fontSize: "1em",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8d7da")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  title="Xoá câu trả lời"
                >
                  <FaTrash style={{ color: "#003366", fontSize: "1.5em" }} /> {/* Thêm màu #003366 cho icon */}
                </button>
                {/* Checkbox đánh dấu là đúng */}
                <div
                style={{
                  position: "absolute",
                  top: "55px", // khoảng cách từ trên xuống dưới nút xoá
                  right: "10px",
                }}
                >
                <input
                  type="checkbox"
                  checked={acceptedAnswerId === ans.id}
                  onChange={() =>
                    handleMarkAsCorrect(question.id, ans.id, question.user_id)
                  }
                  style={{
                    width: "25px",
                    height: "25px",
                    accentColor: "#003366",
                    cursor: "pointer",
                  }}
                />
                  
                </div>
                  <p><strong>{ans.username}</strong></p>
                  <p>{ans.content}</p>

                  {/* Vote section */}
                  <div style={metaContainerStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={() => handleVote("like", "answer", ans.id)}
                        style={{
                          ...voteButton,
                          backgroundColor: ans.userVote === 1 ? "#003366" : "#eee",
                          color: ans.userVote === 1 ? "#fff" : "#000",
                        }}
                      >
                        👍
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: ans.userVote === 1 ? '#fff' : '#003366'
                        }}>
                          {ans.like}
                        </span>
                      </button>

                      <button
                        onClick={() => handleVote("dislike", "answer", ans.id)}
                        style={{
                          ...voteButton,
                          backgroundColor: ans.userVote === -1 ? "#003366" : "#eee",
                          color: ans.userVote === -1 ? "#fff" : "#000",
                        }}
                      >
                        👎
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: ans.userVote === -1 ? '#fff' : '#003366'
                        }}>
                          {ans.dislike}
                        </span>
                      </button>

                      <span>📊 <strong>Vote:</strong> {ans.totalVote}</span>
                    </div>

                    <span>🕒 {new Date(ans.created_at).toLocaleString()}</span>
                  </div>

                  {/* Các nút hành động */}
                  <div style={{ ...containerAnswerSelectStyle, marginTop: '10px' }}>
                    <div style={topRowStyle}>
                      <div style={buttonGroupStyle}>
                        <button style={actionButtonStyle}>↗️ Chia sẻ</button>
                        <button
                          style={actionButtonStyle}
                          onClick={() => {
                            try {
                              const token = getToken();
                              if (!token) {
                                alert("❌ Bạn chưa đăng nhập!");
                                return;
                              }

                              const decoded = jwtDecode(token);
                              const currentUserId = decoded.user_id || decoded.id || decoded.sub;

                              if (ans.user_id !== currentUserId) {
                                alert("❌ Bạn không có quyền chỉnh sửa câu trả lời này!");
                                return;
                              }

                              handleEditAnswer(ans);
                              scrollToAnswerInput();

                            } catch (error) {
                              console.error("Lỗi khi kiểm tra quyền chỉnh sửa:", error);
                              alert("⚠️ Có lỗi xảy ra khi kiểm tra quyền. Vui lòng thử lại.");
                            }
                          }}
                        >
                          ✏️ Chỉnh sửa
                        </button>
                        <button style={actionButtonStyle}>👁️ Theo dõi</button>
                      </div>

                      <span>
                        {(() => {
                          const secondsAgo = Math.floor((new Date() - new Date(ans.created_at)) / 1000);
                          if (secondsAgo < 60) return "Vừa xong";
                          return `Đã chỉnh sửa ${ans.timeAgo || getTimeAgo(ans.created_at)}`;
                        })()}
                      </span>
                    </div>

                    {/* Bình luận cho từng câu */}
                    <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => {
                        const isSame = activeAnswerId === ans.id;
                        setActiveAnswerId(isSame ? null : ans.id);
                        setShowCommentInputId(null); // Đóng comment câu hỏi nếu đang mở
                        if (!isSame) {
                          fetchAnswerComments(ans.id);
                          setVisibleAnswerComments({ ...visibleAnswerComments, [ans.id]: 5 });
                        }
                      }}
                      style={commentButtonStyle}
                    >
                      💬 {activeAnswerId === ans.id ? "Ẩn bình luận" : "Xem bình luận"}
                    </button>


                      {activeAnswerId === ans.id && (
                        <div style={{ marginTop: "10px" }}>
                          {/* Hiển thị các comment */}
                          {(answerComments[ans.id] || []).slice(0, visibleAnswerComments[ans.id] || 5).map((c) => (
                            <div
                              key={c.id}
                              style={{
                                marginBottom: "10px",
                                borderBottom: "1px solid #ddd",
                                paddingBottom: "5px",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                                <span style={{ marginRight: "8px" }}>👤 {c.username}</span>
                                <span style={{ fontSize: "12px", color: "#666", marginRight: "8px" }}>⏰ {c.created_at}</span>
                                
                                <FaEdit 
                                  style={{ marginRight: "8px", cursor: "pointer" }} 
                                  onClick={() => handleEditCommentAnswer(ans.id, c.id)} 
                                />
                                <FaTrash 
                                  style={{ cursor: "pointer", color: "#003366" }} 
                                  onClick={() => handleDeleteCommentAnswer(ans.id, c.id)} // Hàm xử lý xóa comment
                                />
                              </div>
                              <div style={{ marginLeft: "10px" }}>{c.content}</div>
                            </div>
                          ))}

                          {/* Nút hiển thị thêm bình luận */}
                          {answerComments[ans.id] &&
                            visibleAnswerComments[ans.id] < answerComments[ans.id].length && (
                              <button
                                style={{
                                  marginBottom: "10px",
                                  color: "#007bff",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontStyle: "italic",
                                }}
                                onClick={() =>
                                  setVisibleAnswerComments((prev) => ({
                                    ...prev,
                                    [ans.id]: prev[ans.id] + 5,
                                  }))
                                }
                              >
                                Hiển thị thêm bình luận...
                              </button>
                            )}

                          {/* Khung nhập bình luận */}
                          <textarea
                            placeholder="Nhập bình luận của bạn..."
                            value={answerCommentText[ans.id] || ""}
                            onChange={(e) =>
                              setAnswerCommentText({ ...answerCommentText, [ans.id]: e.target.value })
                            }
                            style={commentTextareaStyle}
                          />
                          <button
                            style={commentButtonSendStyle}
                            onClick={() => handleSubmitComment(ans.id, "answer")}
                          >
                            Gửi bình luận
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Chưa có câu trả lời nào.</p>
        )}

          {/* Khung nhập hoặc chỉnh sửa câu trả lời */}
          <div ref={answerInputRef} style={answerInputContainer}>
            <label htmlFor="answer" style={answerCountLabel}>
              {isEditing ? "✏️ Chỉnh sửa câu trả lời:" : "💬 Câu trả lời của bạn:"}
            </label>

            <textarea
              id="answer"
              value={isEditing ? editContent : newAnswer}
              onChange={(e) =>
                isEditing ? setEditContent(e.target.value) : setNewAnswer(e.target.value)
              }
              style={textAreaStyle}
              placeholder="Nhập câu trả lời tại đây..."
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {isEditing ? (
                <>
                  <button style={submitButtonStyle} onClick={submitEditedAnswer}>
                    ✅ Lưu chỉnh sửa
                  </button>
                  <button
                    style={{ ...submitButtonStyle, backgroundColor: "#999" }}
                    onClick={() => {
                      setIsEditing(null);
                      setEditContent("");
                    }}
                  >
                    ❌ Hủy
                  </button>
                </>
              ) : (
                <button style={submitButtonStyle} onClick={handlePostAnswer}>
                  ➕ Đăng câu trả lời
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={sidebarStyleRelatedQuestion}>
          <h3 style={{ color: "#003366", display: "flex", alignItems: "center", gap: "8px" }}>
            <FaLink />
            Câu hỏi liên quan
          </h3>
            {relatedQuestions.length > 0 ? (
              <ul style={{ listStylePosition: "inside", paddingLeft: "0", color: "#003366" }}>
                  {relatedQuestions.map((question) => (
                    <li key={question.id} style={{ marginBottom: "10px", color: "#003366" }}>
                      <Link
                        to={`/studentforum/question/${question.id}`}
                        style={{ textDecoration: "none", color: "#003366" }}
                      >
                        {question.title}
                      </Link>
                    </li>
                  ))}
              </ul>
              ) : (
                <p>Không có câu hỏi nào liên quan</p>
              )}
          </div>

          <div style={sidebarStyleHotQuestion}>
            <h3 style={{ color: "#003366", display: "flex", alignItems: "center", gap: "8px" }}>
              <FaFire />
              Quan tâm nhất
            </h3>
            <ul style={{ listStylePosition: "inside", paddingLeft: "0", color: "#003366" }}>
              {hotQuestions.map((question, index) => (
                <li key={index} style={{ marginBottom: "10px", color: "#003366" }}>
                  <Link
                    to={`/studentforum/question/${question.id}`}
                    style={{ textDecoration: "none", color: "#003366" }}
                  >
                    {question.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </TeacherForumLayout>
  );
}

// CSS styles
const containerStyle = {
  backgroundColor: "#f8f9fa",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "30px",
  marginTop: "15px",
  marginLeft: "-70px",
  width: "850px",
  color: "#003366",
};

const questionContainerStyle = {
  backgroundColor: "#ffffff",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  display: "flex",
  marginBottom: "20px",
  position: "relative",
};

const voteButton = {
  padding: "4px 8px",
  fontSize: "16px",
  border: "1px solid #99ccff",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
};

const questionContentStyle = {
  flex: 1,
};

const metaContainerStyle = {
  fontSize: "14px",
  color: "#003366",
  marginBottom: "10px",
  display: "flex",
  gap: "30px",
  alignItems: "center",
  flexWrap: "wrap",
};

const answerContainer = {
  backgroundColor: "#fff",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginBottom: "20px",
  width: "96.2%",
};

const answerCountLabel = {
  fontWeight: "bold",
  fontSize: "16px",
  marginBottom: "10px",
  display: "block",
};

const answerItemStyle = {
  marginBottom: "15px",
  listStyle: "none",
};

const singleAnswerBox = {
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "10px 100px",
  backgroundColor: "#f0f8ff",
  width: "103%",
  maxWidth: "985px",
  boxSizing: "border-box",
  marginLeft: "-4%", // DỊCH TRÁI
};


const answerInputContainer = {
  backgroundColor: "#ffffff",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  width: "94%",
  marginLeft: "9px",
};

const textAreaStyle = {
  width: "97%",
  height: "200px",
  borderRadius: "6px",
  border: "2px solid #003366",
  padding: "10px",
  fontSize: "16px",
  display: "block",     // đảm bảo là block-level
  margin: "0 auto",     // 👈 căn giữa theo chiều ngang
};

const submitButtonStyle = {
  backgroundColor: "#003366",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  display: "block",
  marginTop:"15px",
};
const containerQuestionSelectStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "16px",
  marginTop: "20px",
  backgroundColor: "#f9f9f9",
  width: "94%",
  marginLeft: "9px",
};
const containerAnswerSelectStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "16px",
  marginTop: "20px",
  backgroundColor: "#f9f9f9",
  width: "100%",
};

const topRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const buttonGroupStyle = {
  display: "flex",
  gap: "10px",
};

const actionButtonStyle = {
  backgroundColor: "#003366",
  color: "#fff",
  border: "none",
  padding: "8px 20px",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};


const commentButtonContainerStyle = {
  textAlign: "left",
  marginTop: "16px",
};

const commentButtonStyle = {
  backgroundColor: "#e0e0e0",
  color: "#003366",
  border: "1px solid #003366",
  padding: "8px 126px",
  borderRadius: "4px",
  fontWeight: "bold",
  cursor: "pointer",
  width: "375px",
};

const commentTextareaStyle = {
  width: "98%",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #003366",
  fontSize: "14px",
  resize: "vertical",
  height: "100px", // ✅ Chiều cao lớn hơn
};


const commentButtonSendStyle = {
  marginTop: "6px",
  padding: "6px 11px",
  backgroundColor: "#003366",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold",
};

const sidebarStyleRelatedQuestion = {
  backgroundColor: "#ffffff",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginTop: "15px",
  width: "260px",
  height: "fit-content",
  color: "#333333",
  marginLeft: "6px",
};

const sidebarStyleHotQuestion = {
  backgroundColor: "#ffffff",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginTop: "30px",
  width: "260px",
  height: "fit-content",
  color: "#333333",
  marginLeft: "6px",
};

const layoutStyle = {
  display: "flex",
  flexDirection: "row",
  gap: "20px",
  marginLeft: "160px",
};

export default TeacherUnanswersForumQuestionDetail;
