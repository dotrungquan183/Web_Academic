from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
import json
from api.models import Answer, Question, UserInformation, Vote
from django.contrib.auth.models import User  # Import User model từ auth để lấy username

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
                }

                print(f"✅ Dữ liệu answer được append: {answer_data}")
                answer_list.append(answer_data)

            return JsonResponse(answer_list, safe=False, status=200)

        except Exception as e:
            print("❌ Lỗi khi lấy danh sách câu trả lời:", str(e))
            return JsonResponse({'error': 'Không thể lấy dữ liệu'}, status=500)
