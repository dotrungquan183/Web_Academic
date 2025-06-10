import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import TeacherForumLayout from "../../Layout";
import { getToken } from "../../../../../auth/authHelper";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaFire, FaLink, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { renderWithLatex } from "../../../../../teacher/Tabs/TeacherForumTab/LatexInputKaTeX";
import EmojiPicker from 'emoji-picker-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';

function AdminForumQuestionDetail() {
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
  const [questionCommentText, setQuestionCommentText] = useState({});
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

  const [showEmojiPickerForAnswer, setShowEmojiPickerForAnswer] = useState(false);
  const [showEmojiPickerForQuestion, setShowEmojiPickerForQuestion] = useState(false);
  const fileInputForQuestionRef = useRef(null);
  const [selectedFilesForQuestion, setSelectedFilesForQuestion] = useState({});
  const [selectedFileNameForQuestion, setSelectedFileNameForQuestion] = useState(null);

  const fileInputForAnswerRef = useRef(null);
  const [selectedFilesForAnswer, setSelectedFilesForAnswer] = useState({});
  const [selectedFileNameForAnswer, setSelectedFileNameForAnswer] = useState(null);
  const emojiPickerQuestionRef = useRef(null);
  const emojiPickerAnswerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerAnswerRef.current &&
        !emojiPickerAnswerRef.current.contains(event.target)
      ) {
        setShowEmojiPickerForAnswer(false);
      }
    }

    if (showEmojiPickerForAnswer) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPickerForAnswer]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerQuestionRef.current &&
        !emojiPickerQuestionRef.current.contains(event.target)
      ) {
        setShowEmojiPickerForQuestion(false);
      }
    }

    if (showEmojiPickerForQuestion) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup khi component unmount hoặc showEmojiPickerForQuestion thay đổi
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPickerForQuestion]);
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
          setAcceptedAnswerId(selectedQuestion.accepted_answer_id);
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

        const formattedAnswers = data.answers.map((ans) => {
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
            question_id: ans.question_id, // ✅ thêm
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

      //console.log("Dữ liệu comment trả về:", res.data); // 👉 LOG ở đây

      setAnswerComments((prev) => ({
        ...prev,
        [answerId]: res.data.comments,
      }));
    } catch (error) {
      console.error("Lỗi khi lấy comment câu trả lời:", error);
    }
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
        ? questionCommentText[contentId]?.trim()
        : answerCommentText[contentId]?.trim();

      if (!comment) {
        alert("❗ Vui lòng nhập nội dung bình luận");
        return;
      }

      const token = getToken();

      // Tạo FormData
      const formData = new FormData();
      formData.append("content_id", contentId);
      formData.append("type_comment", type);
      formData.append("content", comment);

      // ✅ Gắn file nếu có
      const file = isQuestion
        ? selectedFilesForQuestion[contentId]
        : selectedFilesForAnswer[contentId];

      if (file) {
        formData.append("comments", file); // khớp với field trong Django model
      }

      const response = await fetch("http://127.0.0.1:8000/api/student/student_forum/student_question/student_comment/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // KHÔNG set Content-Type khi dùng FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.json();
        console.error("❌ Server error:", errText);
        throw new Error("Không gửi được bình luận");
      }

      // ✅ Reset nội dung và fetch lại comment
      if (isQuestion) {
        setQuestionCommentText((prev) => ({
          ...prev,
          [contentId]: ""
        }));
        fetchComments(contentId);

        setSelectedFilesForQuestion(null);
      } else {
        setAnswerCommentText((prev) => ({
          ...prev,
          [contentId]: "",
        }));
        fetchAnswerComments(contentId);

        setSelectedFilesForAnswer((prev) => ({
          ...prev,
          [contentId]: null,
        }));
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
          console.log("📥 Raw API data:", data); // 🧪 Log tại đây
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
              user_id: ans.user_id,
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

    const units = [
      { label: "năm", seconds: 31536000 },
      { label: "tháng", seconds: 2592000 },
      { label: "ngày", seconds: 86400 },
      { label: "giờ", seconds: 3600 },
      { label: "phút", seconds: 60 },
    ];

    let remainingSeconds = diffInSeconds;
    const parts = [];

    for (const unit of units) {
      const value = Math.floor(remainingSeconds / unit.seconds);
      if (value > 0) {
        parts.push(`${value} ${unit.label}`);
        remainingSeconds -= value * unit.seconds;
      }
      if (parts.length === 2) break; // chỉ lấy tối đa 2 đơn vị
    }

    return parts.join(" ") + " trước";
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

    if (parseInt(currentUserId) !== parseInt(questionOwnerId)) {
      alert("❌ Bạn không có quyền đánh dấu câu trả lời đúng!");
      return;
    }

    const previousAcceptedId = acceptedAnswerId;
    setAcceptedAnswerId(answerId); // ✅ Hiển thị tức thì

    try {
      // ✅ Nếu bạn đã có dữ liệu câu hỏi rồi, bỏ đoạn GET này đi!
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
            accepted_answer_id: answerId, // 👈 Thay đổi quan trọng
          }),
        }
      );

      const putResult = await putRes.json();

      if (putRes.ok) {
        alert("✅ Đã đánh dấu câu trả lời là đúng!");
      } else {
        setAcceptedAnswerId(previousAcceptedId);
        alert(`❌ Lỗi: ${putResult.error || "Không thể đánh dấu câu trả lời này."}`);
      }
    } catch (error) {
      console.error("❌ Lỗi khi đánh dấu câu trả lời đúng:", error);
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
            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                display: "flex",
                gap: "10px",
                zIndex: 2,
              }}
              onClick={(e) => e.stopPropagation()} // Ngăn không navigate khi click icon
            >
              <button
                title="Phê duyệt"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d4edda")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <FaCheckCircle size={25} color="#48b169" />
              </button>

              <button
                title="Từ chối"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8d7da")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <FaTimesCircle size={25} color="red" />
              </button>
            </div>
            <div style={questionContentStyle}>
              <div
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  overflow: "auto",
                  margin: "8px 0",
                  padding: "8px",
                  paddingRight: "40px",  // Thêm padding bên phải để chừa chỗ icon
                  background: "transparent",
                  border: "none",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "block",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                    lineBreak: "anywhere",
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      display: "block",
                      fontSize: "18px",
                      fontWeight: "bold",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      overflowWrap: "break-word",
                    }}
                  >
                    {renderWithLatex(question.title)}
                  </h2>
                </div>
              </div>


              <div style={{ ...metaContainerStyle, paddingLeft: "8px" }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    disabled={parseInt(question?.user_id) === parseInt(userId)}
                    onClick={() => handleVote("like", "question", question.id)}
                    style={{
                      ...voteButton,
                      cursor: question?.user_id === userId ? "not-allowed" : "pointer",
                      backgroundColor: userVoteQuestion === 1 ? "#003366" : "#eee",
                      color: userVoteQuestion === 1 ? "#fff" : "#000",
                    }}
                  >
                    👍
                  </button>
                  <button
                    disabled={parseInt(question?.user_id) === parseInt(userId)}
                    onClick={() => handleVote("dislike", "question", question.id)}
                    style={{
                      ...voteButton,
                      cursor: question?.user_id === userId ? "not-allowed" : "pointer",
                      backgroundColor: userVoteQuestion === -1 ? "#003366" : "#eee",
                      color: userVoteQuestion === -1 ? "#fff" : "#000",
                    }}
                  >
                    👎
                  </button>
                </div>
                <span>🕒 {new Date(question.created_at).toLocaleString()}</span>
                <span>
                  🔖 {question.tags?.length ? question.tags.join(", ") : "Không có thẻ"}
                </span>
              </div>

              <p style={{ paddingLeft: "8px" }}>
                {renderWithLatex(question.content)}
              </p>

              {/* Thông tin thêm về câu hỏi */}
              <div style={containerQuestionSelectStyle}>
                <div style={topRowStyle}>
                  <div style={buttonGroupStyle}>
                    <button style={actionButtonStyle}>
                      <FontAwesomeIcon icon={faShare} style={{ fontSize: "1.1em" }} />
                    </button>
                    <button
                      style={actionButtonStyle}
                      onClick={() =>
                        navigate("/adminforum/question/askquestion", {
                          state: { question: question },
                        })
                      }
                    >
                      <FontAwesomeIcon icon={faEdit} style={{ fontSize: "1.1em" }} />
                    </button>
                    <button style={actionButtonStyle}>
                      <FontAwesomeIcon icon={faEye} style={{ fontSize: "1.1em" }} />
                    </button>
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

                        const units = [
                          { label: "năm", seconds: 31536000 },
                          { label: "tháng", seconds: 2592000 },
                          { label: "ngày", seconds: 86400 },
                          { label: "giờ", seconds: 3600 },
                          { label: "phút", seconds: 60 },
                        ];

                        let remaining = diffInSeconds;
                        const parts = [];

                        for (const unit of units) {
                          const value = Math.floor(remaining / unit.seconds);
                          if (value > 0) {
                            parts.push(`${value} ${unit.label}`);
                            remaining -= value * unit.seconds;
                          }
                          if (parts.length === 2) break;
                        }

                        return `Đã chỉnh sửa ${parts.join(" ")} trước`;
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

                          <FaCheckCircle 
                            style={{ marginRight: "8px", cursor: "pointer" , color:"green"}}
                            onClick={() => handleEditCommentQuestion(question.id, c.id)}
                          />
                          <FaTimesCircle 
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={() => handleDeleteCommentQuestion(question.id, c.id)}
                          />
                        </div>

                        {/* Sử dụng renderWithLatex để hiển thị nội dung comment có công thức */}
                        <div style={{ marginLeft: "10px" }}>
                          {renderWithLatex(c.content)}
                          {c.file_url && (() => {
                            const ext = c.file_name?.split('.').pop().toLowerCase();
                            const fullFileUrl = c.file_url.startsWith("http") ? c.file_url : `http://127.0.0.1:8000${c.file_url}`;

                            if (["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(ext)) {
                              return <img src={fullFileUrl} alt="comment file" style={{ maxWidth: "100%", marginTop: "10px" }} />;
                            }
                            if (["mp4", "webm", "ogg"].includes(ext)) {
                              return (
                                <video controls style={{ maxWidth: "100%", marginTop: "10px" }}>
                                  <source src={fullFileUrl} type={`video/${ext}`} />
                                  Your browser does not support the video tag.
                                </video>
                              );
                            }
                            return (
                              <a href={fullFileUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: "10px" }}>
                                Xem trước
                              </a>
                            );
                          })()}
                        </div>
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
                    <div>
                      {/* Khung nhập bình luận + tiện ích (90/10) */}
                      <div
                        style={{
                          background: "#fff",
                          border: "1px solid #000",
                          borderRadius: "4px",
                          height: "200px",
                          display: "flex",
                          flexDirection: "column",
                          padding: "10px",
                          marginBottom: "10px",
                        }}
                      >
                        {/* Textarea chiếm 90% */}
                        <textarea
                          placeholder="Nhập bình luận của bạn..."
                          value={questionCommentText[question.id] || ""}
                          onChange={(e) =>
                            setQuestionCommentText((prev) => ({
                              ...prev,
                              [question.id]: e.target.value,
                            }))
                          }
                          style={{
                            flex: 9,
                            resize: "none",
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            fontSize: "14px",
                            fontFamily: "inherit",
                          }}
                        />


                        {/* Tiện ích chiếm 10% */}
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            borderTop: "1px solid #ccc",
                            paddingTop: "5px",
                          }}
                        >
                          <input
                            type="file"
                            ref={fileInputForQuestionRef}
                            style={{ display: "none" }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                alert(`Đã chọn file: ${file.name}`);
                              }
                            }}
                          />

                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <input
                              type="file"
                              ref={fileInputForQuestionRef}
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setSelectedFilesForQuestion((prev) => ({
                                    ...prev,
                                    [question.id]: file, // ⬅️ Lưu file theo contentId
                                  }));
                                  setSelectedFileNameForQuestion((prev) => ({
                                    ...prev,
                                    [question.id]: file.name, // ⬅️ Lưu tên hiển thị
                                  }));
                                }
                              }}
                            />

                            <span
                              title="Thêm file"
                              style={{ cursor: "pointer" }}
                              onClick={() => fileInputForQuestionRef.current.click()}
                            >
                              📎
                            </span>

                            {/* 👉 Hiển thị tên file sau khi chọn */}
                            {selectedFileNameForQuestion && selectedFileNameForQuestion[question.id] && (
                              <span style={{ fontStyle: "italic", color: "gray" }}>
                                {selectedFileNameForQuestion[question.id]}
                              </span>
                            )}

                          </div>


                          <span
                            title="Thêm emoji"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowEmojiPickerForQuestion(!showEmojiPickerForQuestion)}
                          >
                            😊
                          </span>

                          {showEmojiPickerForQuestion && (
                            <div
                              ref={emojiPickerQuestionRef}
                              style={{ position: "absolute", zIndex: 1000 }}
                            >
                              <EmojiPicker
                                onEmojiClick={(emojiData) => {
                                  setQuestionCommentText((prev) => ({
                                    ...prev,
                                    [question.id]: (prev[question.id] || "") + emojiData.emoji,
                                  }));
                                  setShowEmojiPickerForQuestion(false);
                                }}
                              />
                            </div>
                          )}

                        </div>
                      </div>

                      {/* Khung preview hiển thị nội dung bình luận */}
                      <div
                        style={{
                          background: "#f8f8f8",
                          padding: "10px",
                          minHeight: "40px",
                          border: "1px solid #000",
                          borderRadius: "4px",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {renderWithLatex(questionCommentText[question.id] || "")}
                      </div>
                    </div>

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
                      {String(userId) === String(ans.user_id) && (
                        <div
  style={{
    position: "absolute",
    top: "8px",
    right: "8px",
    display: "flex",
    gap: "10px",
    zIndex: 2,
  }}
  onClick={(e) => e.stopPropagation()} // Ngăn không navigate khi click icon
>
  <button
    title="Phê duyệt"
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px",
      transition: "background-color 0.2s",
    }}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#d4edda")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
  >
    <FaCheckCircle size={25} color="#48b169" />
  </button>

  <button
    title="Từ chối"
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px",
      transition: "background-color 0.2s",
    }}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f8d7da")}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
  >
    <FaTimesCircle size={25} color="red" />
  </button>
</div>
                      )}

                      {/* Checkbox đánh dấu là đúng */}
                      {parseInt(userId) === parseInt(question.user_id) && (
                        <div
                          style={{
                            position: "absolute",
                            top: "55px", // khoảng cách từ trên xuống dưới nút xoá
                            right: "10px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={parseInt(acceptedAnswerId) === parseInt(ans.id)}
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
                      )}

                      <p><strong>{ans.username}</strong></p>
                      <div
                        style={{
                          marginTop: "-5px",
                          marginBottom: "8px",
                          padding: "10px",
                          backgroundColor: "#f9f9f9",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          overflowX: "auto",          // Cuộn ngang nếu nội dung dài
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                          minWidth: "106%",
                          maxWidth: "110%",
                          boxSizing: "border-box",
                        }}
                      >
                        {renderWithLatex(ans.content)}
                      </div>
                      {/* Vote section */}
                      <div style={metaContainerStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            onClick={() => handleVote("like", "answer", ans.id)}
                            disabled={ans?.user_id === userId}
                            style={{
                              ...voteButton,
                              cursor: ans?.user_id === userId ? "not-allowed" : "pointer",
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
                            disabled={ans?.user_id === userId}
                            onClick={() => handleVote("dislike", "answer", ans.id)}
                            style={{
                              ...voteButton,
                              cursor: ans?.user_id === userId ? "not-allowed" : "pointer",
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
                            <button style={actionButtonStyle}>
                              <FontAwesomeIcon icon={faShare} style={{ fontSize: "1.1em" }} />
                            </button>

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
                              <FontAwesomeIcon icon={faEdit} style={{ fontSize: "1.1em" }} />
                            </button>

                            <button style={actionButtonStyle}>
                              <FontAwesomeIcon icon={faEye} style={{ fontSize: "1.1em" }} />
                            </button>
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

                                    <FaCheckCircle 
                                      style={{ marginRight: "8px", cursor: "pointer", color: "green" }}
                                      onClick={() => handleEditCommentAnswer(ans.id, c.id)}
                                    />
                                    <FaTimesCircle 
                                      style={{ cursor: "pointer", color: "red" }}
                                      onClick={() => handleDeleteCommentAnswer(ans.id, c.id)}
                                    />
                                  </div>
                                  <div
                                    style={{
                                      marginLeft: "10px",
                                      maxWidth: "100%",
                                      overflowX: "auto",
                                      overflowY: "auto",
                                      maxHeight: "300px",
                                      wordBreak: "break-word",
                                      whiteSpace: "normal",
                                      lineBreak: "anywhere",
                                    }}
                                  >
                                    {renderWithLatex(c.content)}

                                    {c.file_url && (() => {
                                      const ext = c.file_name?.split('.').pop().toLowerCase();
                                      const fullFileUrl = c.file_url.startsWith("http") ? c.file_url : `http://127.0.0.1:8000${c.file_url}`;

                                      if (["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(ext)) {
                                        return <img src={fullFileUrl} alt="comment file" style={{ maxWidth: "100%", marginTop: "10px" }} />;
                                      }
                                      if (["mp4", "webm", "ogg"].includes(ext)) {
                                        return (
                                          <video controls style={{ maxWidth: "100%", marginTop: "10px" }}>
                                            <source src={fullFileUrl} type={`video/${ext}`} />
                                            Your browser does not support the video tag.
                                          </video>
                                        );
                                      }
                                      return (
                                        <a href={fullFileUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: "10px" }}>
                                          Xem trước
                                        </a>
                                      );
                                    })()}
                                  </div>
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
                              <div>
                                {/* Khung preview chia 90% nội dung - 10% tiện ích */}
                                <div>
                                  {/* Khung nhập bình luận với tiện ích (90/10) */}
                                  <div
                                    style={{
                                      marginTop: "10px",
                                      background: "#fff",
                                      border: "1px solid #000",
                                      borderRadius: "4px",
                                      height: "200px", // Tổng chiều cao khung nhập
                                      display: "flex",
                                      flexDirection: "column",
                                      padding: "10px",
                                    }}
                                  >
                                    {/* Ô nhập bình luận (chiếm 90%) */}
                                    <textarea
                                      placeholder="Nhập bình luận của bạn..."
                                      value={answerCommentText[ans.id] || ""}
                                      onChange={(e) =>
                                        setAnswerCommentText({ ...answerCommentText, [ans.id]: e.target.value })
                                      }
                                      style={{
                                        flex: 9,
                                        resize: "none",
                                        border: "none",
                                        outline: "none",
                                        background: "transparent",
                                        fontSize: "14px",
                                        fontFamily: "inherit",
                                      }}
                                    />

                                    {/* Tiện ích (chiếm 10%) */}
                                    <div
                                      style={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        borderTop: "1px solid #ccc",
                                        paddingTop: "5px",
                                      }}
                                    >
                                      <input
                                        type="file"
                                        ref={fileInputForAnswerRef}
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            alert(`Đã chọn file: ${file.name}`);
                                          }
                                        }}
                                      />

                                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <input
                                          type="file"
                                          ref={fileInputForAnswerRef}
                                          style={{ display: "none" }}
                                          onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                              setSelectedFilesForAnswer((prev) => ({
                                                ...prev,
                                                [ans.id]: file, // ⬅️ Lưu file theo contentId
                                              }));
                                              setSelectedFileNameForAnswer((prev) => ({
                                                ...prev,
                                                [ans.id]: file.name, // ⬅️ Lưu tên hiển thị
                                              }));
                                            }
                                          }}
                                        />

                                        <span
                                          title="Thêm file"
                                          style={{ cursor: "pointer" }}
                                          onClick={() => fileInputForAnswerRef.current.click()}
                                        >
                                          📎
                                        </span>

                                        {/* 👉 Hiển thị tên file sau khi chọn */}
                                        {selectedFileNameForAnswer && selectedFileNameForAnswer[ans.id] && (
                                          <span style={{ fontStyle: "italic", color: "gray" }}>
                                            {selectedFileNameForAnswer[ans.id]}
                                          </span>
                                        )}

                                      </div>


                                      <span
                                        title="Thêm emoji"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setShowEmojiPickerForAnswer(!showEmojiPickerForAnswer)}
                                      >
                                        😊
                                      </span>

                                      {showEmojiPickerForAnswer && (
                                        <div
                                          ref={emojiPickerAnswerRef}
                                          style={{ position: "absolute", zIndex: 1000 }}
                                        >
                                          <EmojiPicker
                                            onEmojiClick={(emojiData) => {
                                              setAnswerCommentText((prev) => ({
                                                ...prev,
                                                [ans.id]: (prev[ans.id] || "") + emojiData.emoji,
                                              }));
                                              setShowEmojiPickerForAnswer(false);
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Khung render preview */}
                                  <div
                                    style={{
                                      marginTop: "10px",
                                      background: "#f8f8f8",
                                      padding: "10px",
                                      minHeight: "40px",
                                      maxHeight: "200px",
                                      border: "1px solid #000",
                                      borderRadius: "4px",
                                      overflowY: "auto",
                                      wordBreak: "break-word",
                                      overflowWrap: "break-word",
                                      whiteSpace: "pre-wrap",
                                    }}
                                  >
                                    {renderWithLatex(answerCommentText[ans.id] || "")}
                                  </div>
                                </div>

                              </div>


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

              <div>
                <textarea
                  id="answer"
                  value={isEditing ? editContent : newAnswer}
                  onChange={(e) =>
                    isEditing ? setEditContent(e.target.value) : setNewAnswer(e.target.value)
                  }
                  style={textAreaStyle}
                  placeholder="Nhập câu trả lời tại đây..."
                />

                {/* Preview nội dung có công thức LaTeX */}
                <div
                  style={{
                    marginTop: "10px",
                    background: "#f8f8f8",
                    padding: "10px",
                    minHeight: "40px",
                    border: "1px solid #eee",
                    borderRadius: "4px",
                    overflowX: "auto",              // Cho phép cuộn ngang nếu cần
                    wordWrap: "break-word",         // Ngắt từ dài
                    whiteSpace: "normal",           // Cho phép xuống dòng
                    maxWidth: "100%",               // Không cho vượt chiều rộng
                    boxSizing: "border-box"
                  }}
                >
                  {renderWithLatex(isEditing ? editContent : newAnswer)}
                </div>
              </div>

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
  minWidth: 0,               // 🔑 NGĂN FLEXBOX giãn tràn
  maxWidth: "100%",          // Không vượt quá vùng cha
  overflow: "auto",          // Cho phép cuộn nếu dài
  wordBreak: "break-word",   // Ngắt từ nếu dài
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
  marginTop: "15px",
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
  gap: "4px",            // Khoảng cách nhỏ giữa các nút
  borderRadius: "8px",   // Bo góc tổng thể
  background: "#f9f9f9", // Màu nền giống Facebook
  padding: "4px",
  alignItems: "center",
  marginLeft: "-4px", // 👉 Dịch sang trái
};

const actionButtonStyle = {
  backgroundColor: "#f9f9f9",
  color: "#003366",
  border: "1px solid #003366",
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
  width: "100%",
};

// const commentTextareaStyleForAnswer = {
//   width: "97%",
//   padding: "8px",
//   borderRadius: "6px",
//   border: "1px solid #003366",
//   fontSize: "14px",
//   resize: "vertical",
//   height: "100px",
// };

// const commentTextareaStyleForQuestion = {
//   width: "97.5%",
//   padding: "8px",
//   borderRadius: "6px",
//   border: "1px solid #003366",
//   fontSize: "14px",
//   resize: "vertical",
//   height: "100px",
// };

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

export default AdminForumQuestionDetail;
