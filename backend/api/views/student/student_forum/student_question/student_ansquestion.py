from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
import json
from api.models import Answer, Question, UserInformation, Vote
from django.contrib.auth.models import User  # Import User model từ auth để lấy username
from api.views.auth.authHelper import get_authenticated_user
from django.utils.timezone import now
import logging
import traceback
from django.db import transaction, IntegrityError
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)
@method_decorator(csrf_exempt, name='dispatch')
class StudentAnsQuestionView(View):
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            print("📥 DỮ LIỆU NHẬN VỀ:", data)
        except Exception as e:
            print("❌ JSON lỗi:", str(e))
            return JsonResponse({'error': 'Dữ liệu không hợp lệ'}, status=400)

        question_id = data.get('question_id')
        user_id = data.get('user_id')
        content = data.get('content')

        if not all([question_id, user_id, content]):
            return JsonResponse({'error': 'Thiếu dữ liệu đầu vào'}, status=400)

        try:
            question = get_object_or_404(Question, id=question_id)
            user = get_object_or_404(UserInformation, user_id=user_id)
        except Exception as e:
            print("❌ Không tìm thấy Question hoặc User:", str(e))
            return JsonResponse({'error': 'Không tìm thấy Question hoặc User'}, status=400)

        # Tạo câu trả lời
        answer = Answer.objects.create(
            question=question,
            user=user,
            content=content
        )

        return JsonResponse({'message': 'Success', 'id': answer.id}, status=201)


    def delete(self, request, answer_id=None, *args, **kwargs):
        # 1. Lấy user từ JWT
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        # 2. Kiểm tra answer_id có được truyền vào không
        if not answer_id:
            return JsonResponse({'error': 'Thiếu ID của câu trả lời'}, status=400)

        try:
            # 3. Lấy object Answer
            answer = get_object_or_404(Answer, id=answer_id)

            # 4. Kiểm tra quyền: chỉ người tạo mới được xoá
            # So sánh user.id với answer.user.user_id (do answer.user là FK đến UserInformation)
            if answer.user.user_id != user.id:  # Sử dụng user_id của UserInformation
                return JsonResponse({'error': '❌ Bạn không có quyền xoá câu trả lời này'}, status=403)

            # 5. Xoá tất cả votes liên quan đến câu trả lời này
            Vote.objects.filter(vote_for='answer', content_id=answer.id).delete()

            # 6. Xoá câu trả lời
            answer.delete()

            return JsonResponse({'message': '✅ Đã xoá câu trả lời thành công!'}, status=200)

        except Exception as e:
            print("❌ Exception khi xoá câu trả lời:")
            traceback.print_exc()
            return JsonResponse({'error': f'❌ Lỗi khi xoá: {str(e)}'}, status=500)
        
    def get(self, request, *args, **kwargs):
        question_id = request.GET.get('question_id')

        if not question_id:
            print("⚠️ Thiếu question_id trong request")
            return JsonResponse({'error': 'Thiếu question_id'}, status=400)

        try:
            answers = Answer.objects.filter(question_id=question_id).order_by('-created_at')
            print(f"✅ Tìm thấy {answers.count()} câu trả lời cho question_id {question_id}")

            user = request.user if request.user.is_authenticated else None
            answer_list = []

            for ans in answers:
                print(f"\n📌 Xử lý Answer ID: {ans.id}")
                try:
                    user_info = ans.user  # FK tới UserInformation
                    print(f"🔍 user_info: {user_info}")

                    full_name = getattr(user_info, 'full_name', None)
                    username = None
                    if user_info.user_id:
                        auth_user = User.objects.filter(id=user_info.user_id).first()
                        if auth_user:
                            username = auth_user.username

                    print(f"🧾 full_name: {full_name}")
                    print(f"🧾 username: {username}")

                    username = username or full_name or "Người dùng ẩn danh"
                except Exception as e:
                    print(f"⚠️ Lỗi khi lấy thông tin người dùng cho Answer ID {ans.id}: {e}")
                    username = "Người dùng ẩn danh"

                # 🔢 Tính tổng số like và dislike
                likes = Vote.objects.filter(vote_for='answer', content_id=ans.id, vote_type='like').count()
                dislikes = Vote.objects.filter(vote_for='answer', content_id=ans.id, vote_type='dislike').count()
                total_votes = likes - dislikes  # hoặc bạn có thể truyền cả 2 về phía frontend

                print(f"👍 Likes: {likes}, 👎 Dislikes: {dislikes}, 📊 TotalVotes: {total_votes}")

                # 👤 Kiểm tra user hiện tại đã vote gì chưa (nếu có)
                user_vote = None
                if user:
                    vote = Vote.objects.filter(user=user, vote_for='answer', content_id=ans.id).first()
                    if vote:
                        user_vote = vote.vote_type
                print(f"👤 userVote: {user_vote}")

                answer_data = {
                    'id': ans.id,
                    'username': username,
                    'content': ans.content,
                    'created_at': ans.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    'userVote': user_vote,
                    'totalVote': total_votes,
                    'like': likes,
                    'dislike': dislikes,
                    'user_id': user_info.user_id if user_info else None,
                }

                print(f"✅ Dữ liệu answer được append: {answer_data}")
                answer_list.append(answer_data)

            return JsonResponse(answer_list, safe=False, status=200)

        except Exception as e:
            print("❌ Lỗi khi lấy danh sách câu trả lời:", str(e))
            return JsonResponse({'error': 'Không thể lấy dữ liệu'}, status=500)
        
    def put(self, request, answer_id, *args, **kwargs):
        print(f"Received answer_id: {answer_id}")
        logger.info(f"Received PUT request with answer_id: {answer_id}")
        
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            # Kiểm tra và phân tích dữ liệu từ request
            data = json.loads(request.body)
            content = data.get("content")

            if not content:
                return JsonResponse({"error": "Nội dung câu trả lời không được để trống!"}, status=400)

            try:
                # Tìm câu trả lời bằng answer_id
                answer = Answer.objects.get(id=answer_id)
            except Answer.DoesNotExist:
                return JsonResponse({"error": "Câu trả lời không tồn tại!"}, status=404)

            # Kiểm tra quyền sở hữu câu trả lời
            if answer.user.user_id != user.id:  # Sửa phần này để so sánh user_id
                logger.info(f"User {user.id} tried to edit answer {answer_id} owned by {answer.user.user_id}")
                return JsonResponse({"error": "Bạn không có quyền chỉnh sửa câu trả lời của người khác!"}, status=403)

            # Cập nhật nội dung câu trả lời và thời gian tạo
            answer.content = content
            answer.created_at = now()  # Cập nhật thời gian
            answer.save()
            
            return JsonResponse({"message": "Cập nhật câu trả lời thành công!"}, status=200)

        except json.JSONDecodeError as e:
            logger.error(f"JSON Decode Error: {str(e)}")
            return JsonResponse({"error": "Dữ liệu không hợp lệ!"}, status=400)

        except Exception as e:
            # Ghi lại traceback chi tiết về lỗi
            logger.error(f"Unexpected error: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")  # Ghi lại traceback chi tiết của lỗi

            return JsonResponse({"error": "Đã xảy ra lỗi khi cập nhật câu trả lời."}, status=500)