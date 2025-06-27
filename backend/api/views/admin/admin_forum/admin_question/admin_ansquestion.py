from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
import json
from api.models import Answer, Question, UserInformation, VoteForAnswer, ReputationPermission
from django.contrib.auth.models import User  # Import User model từ auth để lấy username
from api.views.auth.authHelper import get_authenticated_user
from django.utils.timezone import now
import logging
import traceback
from django.core.exceptions import PermissionDenied
from api.views.student.student_forum.student_question.student_detailquestion import check_permission_and_update_reputation
logger = logging.getLogger(__name__)
@method_decorator(csrf_exempt, name='dispatch')
class AdminAnsQuestionView(View):
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        try:
            # 📥 Parse dữ liệu JSON
            data = json.loads(request.body.decode('utf-8'))
            print("📥 DỮ LIỆU NHẬN VỀ:", data)
        except json.JSONDecodeError as e:
            print("❌ JSON lỗi:", str(e))
            return JsonResponse({'error': 'Dữ liệu không hợp lệ'}, status=400)

        # 🎯 Lấy thông tin đầu vào
        question_id = data.get('question_id')
        user_id = data.get('user_id')
        content = data.get('content')
        if not all([question_id, user_id, content]):
            return JsonResponse({'error': 'Thiếu dữ liệu đầu vào'}, status=400)

        # 🔍 Lấy Question và UserInformation
        try:
            question = get_object_or_404(Question, id=question_id)
            user_info = get_object_or_404(UserInformation, user_id=user_id)
        except Exception as e:
            print("❌ Không tìm thấy Question hoặc User:", str(e))
            return JsonResponse(
                {'error': 'Không tìm thấy Question hoặc User'},
                status=400
            )

        # ✅ Kiểm tra quyền và điểm uy tín
        try:
            check_permission_and_update_reputation(user_info, "post_answer")
        except PermissionDenied as pd:
            # Nếu không đủ quyền => trả lỗi rõ ràng
            return JsonResponse(
                {'error': str(pd)},
                status=403
            )

        # 💬 Tạo câu trả lời
        try:
            answer = Answer.objects.create(
                question=question,
                user=user_info,
                content=content
            )
        except Exception as e:
            print("❌ Lỗi tạo Answer:", str(e))
            return JsonResponse(
                {'error': 'Lỗi khi lưu câu trả lời!'},
                status=500
            )

        # 🎉 Thành công
        return JsonResponse(
            {'message': '✅ Trả lời thành công!', 'id': answer.id},
            status=201
        )

    def delete(self, request, answer_id=None, *args, **kwargs):
        # 1. Kiểm tra answer_id có được truyền vào không
        if not answer_id:
            return JsonResponse({'error': 'Thiếu ID của câu trả lời'}, status=400)

        try:
            # 2. Lấy object Answer
            answer = get_object_or_404(Answer, id=answer_id)

            # ❌ Không kiểm tra người dùng nữa (admin có thể xoá bất kỳ câu trả lời nào)

            # 3. Xoá tất cả votes liên quan đến câu trả lời này
            VoteForAnswer.objects.filter(answer=answer).delete()

            # 4. Xoá câu trả lời
            answer.delete()

            return JsonResponse(
                {'message': '✅ Đã xoá câu trả lời thành công!'}, status=200
            )

        except Exception as e:
            print("❌ Exception khi xoá câu trả lời:", e)
            traceback.print_exc()
            return JsonResponse({'error': f'❌ Lỗi khi xoá: {str(e)}'}, status=500)

        
    def get(self, request, *args, **kwargs):
        question_id = request.GET.get('question_id')
        if not question_id:
            print("⚠️ Thiếu question_id trong request")
            return JsonResponse({'error': 'Thiếu question_id'}, status=400)

        try:
            # Lấy question (có thể bỏ lọc is_approve nếu muốn lấy cả chưa duyệt)
            question = Question.objects.filter(id=question_id).first()
            if not question:
                print(f"❌ Câu hỏi {question_id} không tồn tại hoặc chưa được duyệt")
                return JsonResponse({'error': 'Câu hỏi không tồn tại hoặc chưa được duyệt'}, status=404)

            # Lấy danh sách answer (cả đã duyệt và chưa duyệt nếu cần)
            answers = Answer.objects.filter(
                question_id=question_id
            ).order_by('-created_at')
            print(f"✅ Tìm thấy {answers.count()} câu trả lời đã cho question_id {question_id}")

            user = request.user if request.user.is_authenticated else None
            answer_list = []

            for ans in answers:
                print(f"\n📌 Xử lý Answer ID: {ans.id}")
                try:
                    user_info = ans.user  # FK tới UserInformation
                    full_name = getattr(user_info, 'full_name', None)
                    username = None
                    if user_info.user_id:
                        auth_user = User.objects.filter(id=user_info.user_id).first()
                        username = auth_user.username if auth_user else None
                    username = username or full_name or "Người dùng ẩn danh"
                    print(f"🧾 username: {username}")
                except Exception as e:
                    print(f"⚠️ Lỗi khi lấy thông tin người dùng cho Answer ID {ans.id}: {e}")
                    username = "Người dùng ẩn danh"

                # 🔢 Tính tổng số like/dislike
                likes = VoteForAnswer.objects.filter(answer=ans, vote_type='like').count()
                dislikes = VoteForAnswer.objects.filter(answer=ans, vote_type='dislike').count()
                total_votes = likes - dislikes
                print(f"👍 Likes: {likes}, 👎 Dislikes: {dislikes}, 📊 TotalVotes: {total_votes}")

                # 👤 Kiểm tra user hiện tại đã vote chưa
                user_vote = None
                if user:
                    vote = VoteForAnswer.objects.filter(user=user, answer=ans).first()
                    if vote:
                        user_vote = vote.vote_type
                print(f"👤 userVote: {user_vote}")

                answer_list.append({
                    'id': ans.id,
                    'username': username,
                    'content': ans.content,
                    'created_at': ans.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    'userVote': user_vote,
                    'totalVote': total_votes,
                    'like': likes,
                    'dislike': dislikes,
                    'user_id': user_info.user_id if user_info else None,
                    'question_id': ans.question_id,
                    'is_approve': ans.is_approve  # ✅ Thêm vào đây
                })
                print(f"✅ Dữ liệu answer được append.")

            return JsonResponse({'answers': answer_list}, status=200)

        except Exception as e:
            print("❌ Lỗi khi lấy danh sách câu trả lời:", e)
            return JsonResponse({'error': 'Không thể lấy dữ liệu'}, status=500)


        
    def put(self, request, answer_id):
        logger.info(f"Received PUT request with answer_id: {answer_id}")
        
        try:
            answer = Answer.objects.get(id=answer_id)
            answer.is_approve = 1
            answer.save()

            logger.info(f"✅ Answer {answer_id} has been approved.")
            return JsonResponse({"message": "Phê duyệt câu trả lời thành công!"}, status=200)

        except Answer.DoesNotExist:
            return JsonResponse({"error": "Câu trả lời không tồn tại!"}, status=404)
        except Exception as e:
            logger.error(f"Lỗi không xác định: {str(e)}")
            logger.error(traceback.format_exc())
            return JsonResponse({"error": "Đã xảy ra lỗi khi phê duyệt câu trả lời."}, status=500)