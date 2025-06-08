import json
from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from api.views.auth.authHelper import get_authenticated_user
from api.models import Question, QuestionTag, QuestionTagMap, Answer, UserInformation
from django.utils.timezone import now

@method_decorator(csrf_exempt, name="dispatch")
class StudentAskQuestionView(View):
    def post(self, request, *args, **kwargs):
        # Lấy thông tin người dùng từ request
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            # Lấy dữ liệu từ body request
            data = json.loads(request.body)
            title = data.get("title")
            description = data.get("content")  # frontend dùng "content" thay vì "description"
            tags = data.get("tags")
            bounty_amount = data.get("bounty_amount", 0)

            # Kiểm tra các trường dữ liệu bắt buộc
            if not title or not description or not tags or not isinstance(tags, list) or len([t for t in tags if isinstance(t, str) and t.strip()]) == 0:
                return JsonResponse({"error": "Không đủ thông tin!"}, status=400)

            # Lấy user_info để trừ điểm nếu có bounty
            try:
                user_info = UserInformation.objects.get(user=user)
            except UserInformation.DoesNotExist:
                return JsonResponse({"error": "Không tìm thấy thông tin người dùng!"}, status=404)

            # Nếu bounty_amount > 0, kiểm tra reputation đủ không
            bounty_amount = int(bounty_amount)
            if bounty_amount > 0:
                if user_info.reputation < bounty_amount:
                    return JsonResponse({"error": "Không đủ điểm để đặt bounty!"}, status=400)
                user_info.reputation -= bounty_amount
                user_info.save()

            # Tạo câu hỏi mới trong cơ sở dữ liệu
            question = Question.objects.create(
                user=user,
                title=title,
                content=description,
                bounty_amount=bounty_amount,
            )

            # Xử lý tags (nếu có)
            tag_names = set(tag.strip() for tag in tags if tag.strip())  # Loại bỏ tag trống
            for tag_name in tag_names:
                tag, _ = QuestionTag.objects.get_or_create(tag_name=tag_name)
                QuestionTagMap.objects.create(question=question, tag=tag)

            # Trả về thông báo thành công
            return JsonResponse({"message": "Câu hỏi đã được đăng!"}, status=201)

        except json.JSONDecodeError:
            # Xử lý lỗi khi dữ liệu JSON không hợp lệ
            return JsonResponse({"error": "Dữ liệu không hợp lệ!"}, status=400)
        except Exception as e:
            # Xử lý lỗi chung
            return JsonResponse({"error": str(e)}, status=500)

    def put(self, request, question_id, *args, **kwargs):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            data = json.loads(request.body)
            title = data.get("title")
            content = data.get("content") or data.get("description")
            tags = data.get("tags")
            bounty_amount = data.get("bounty_amount", 0)
            accepted_answer_id = data.get("accepted_answer_id")

            if not title or not content or not tags:
                return JsonResponse({"error": "Vui lòng điền đầy đủ thông tin!"}, status=400)

            try:
                question = Question.objects.get(id=question_id)
            except Question.DoesNotExist:
                return JsonResponse({"error": "Câu hỏi không tồn tại!"}, status=404)

            if question.user != user:
                return JsonResponse({"error": "Bạn không có quyền chỉnh sửa câu hỏi của người khác!"}, status=403)

            # Nếu có accepted_answer_id thì kiểm tra
            if accepted_answer_id:
                try:
                    answer = Answer.objects.get(id=accepted_answer_id, question=question)
                    
                    # Nếu trước đó chưa có hoặc accepted answer thay đổi
                    if question.accepted_answer_id != accepted_answer_id:
                        question.accepted_answer_id = accepted_answer_id
                        
                        # ✅ Tăng reputation cho người trả lời
                        answer_author_info = answer.user
                        answer_author_info.reputation += 15
                        answer_author_info.save()
                except Answer.DoesNotExist:
                    return JsonResponse(
                        {"error": "Câu trả lời không hợp lệ hoặc không thuộc câu hỏi này!"},
                        status=400
                    )

            # Cập nhật các trường còn lại
            question.title = title
            question.content = content
            question.bounty_amount = bounty_amount
            question.created_at = now()
            question.save()

            # Cập nhật tags
            QuestionTagMap.objects.filter(question=question).delete()

            tag_names = set(tag.strip() for tag in tags) if isinstance(tags, list) else set(
                tag.strip() for tag in tags.split(",") if tag.strip()
            )
            for tag_name in tag_names:
                tag, _ = QuestionTag.objects.get_or_create(tag_name=tag_name)
                QuestionTagMap.objects.create(question=question, tag=tag)

            return JsonResponse({"message": "Cập nhật câu hỏi thành công!"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Dữ liệu không hợp lệ!"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def get(self, request, question_id, *args, **kwargs):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            question = Question.objects.get(id=question_id)

            # Kiểm tra quyền người dùng nếu cần:
            if question.user != user:
                return JsonResponse({"error": "Bạn không có quyền xem câu hỏi này!"}, status=403)

            # Lấy tags của câu hỏi
            tags = list(
                QuestionTagMap.objects.filter(question=question)
                .values_list('tag__tag_name', flat=True)
            )

            return JsonResponse({
                "id": question.id,
                "title": question.title,
                "content": question.content,
                "bounty_amount": float(question.bounty_amount or 0),
                "accepted_answer_id": question.accepted_answer_id,
                "created_at": question.created_at.isoformat(),
                "tags": tags,
                "user_id": question.user.id,  # 👈 Thêm dòng này
            }, status=200)

        except Question.DoesNotExist:
            return JsonResponse({"error": "Câu hỏi không tồn tại!"}, status=404)
