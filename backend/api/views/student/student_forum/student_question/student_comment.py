from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from api.views.auth.authHelper import get_authenticated_user
from api.models import CommentForQuestion, CommentForAnswer
import json
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from django.utils.timezone import now
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
@method_decorator(csrf_exempt, name="dispatch")
class StudentCommentView(View):
    def _get_model_and_fk(self, type_comment):
        """
        Helper lấy model và tên foreign key dựa trên type_comment
        """
        if type_comment == "question":
            return CommentForQuestion, "question_id"
        elif type_comment == "answer":
            return CommentForAnswer, "answer_id"
        return None, None

    def post(self, request, *args, **kwargs):
        try:
            user, error_response = get_authenticated_user(request)
            if error_response:
                return error_response

            type_comment = request.POST.get("type_comment")
            content_id = request.POST.get("content_id")
            content = request.POST.get("content")
            uploaded_file = request.FILES.get("comments")

            if not all([type_comment, content_id, content]):
                return JsonResponse({"error": "Missing fields"}, status=400)

            CommentModel, fk_name = self._get_model_and_fk(type_comment)
            if not CommentModel:
                return JsonResponse({"error": "Invalid type_comment"}, status=400)

            with transaction.atomic():
                comment = CommentModel.objects.create(
                    **{fk_name: int(content_id)},  # gán content_id vào question_id hoặc answer_id
                    content=content,
                    user=user,
                    file=uploaded_file if uploaded_file else None,
                    created_at=now(),
                )

                # Gửi qua WebSocket
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    "comments",
                    {
                        "type": "send.comment",
                        "data": {
                            "id": comment.id,
                            "type_comment": type_comment,
                            "content_id": int(content_id),
                            "content": content,
                            "username": user.username,
                            "created_at": comment.created_at.strftime("%d/%m/%Y %H:%M"),
                            "has_file": bool(uploaded_file),
                            "file_url": comment.file.url if uploaded_file else None,
                        },
                    },
                )

            return JsonResponse(
                {"message": "Comment created successfully", "comment_id": comment.id},
                status=201,
            )

        except Exception as e:
            print("Error occurred:", str(e))
            return JsonResponse({"error": str(e)}, status=500)

    def get(self, request, *args, **kwargs):
        try:
            type_comment = request.GET.get("type_comment")
            content_id = request.GET.get("content_id")

            if not all([type_comment, content_id]):
                return JsonResponse({"error": "Missing query params"}, status=400)

            CommentModel, fk_name = self._get_model_and_fk(type_comment)
            if not CommentModel:
                return JsonResponse({"error": "Invalid type_comment"}, status=400)

            # ✅ Chỉ lấy comment đã được duyệt (is_approve = 1)
            comments = CommentModel.objects.filter(
                **{fk_name: content_id},
                is_approve=1
            ).select_related("user").order_by("-created_at")

            data = [
                {
                    "id": c.id,
                    "user_id": c.user.id,
                    "username": c.user.username,
                    "content": c.content,
                    "created_at": c.created_at.strftime("%d/%m/%Y %H:%M"),
                    "file_url": c.file.url if c.file else None,
                    "file_name": c.file.name.split("/")[-1] if c.file else None,
                }
                for c in comments
            ]
            return JsonResponse({"comments": data}, status=200)

        except Exception as e:
            print("Error on GET:", str(e))
            return JsonResponse({"error": str(e)}, status=500)


    def put(self, request, comment_id=None, *args, **kwargs):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            data = json.loads(request.body)
            new_content = data.get("content")
            type_comment = data.get("type_comment")

            if not new_content or not type_comment:
                return JsonResponse({"error": "Missing content or type_comment"}, status=400)

            CommentModel, fk_name = self._get_model_and_fk(type_comment)
            if not CommentModel:
                return JsonResponse({"error": "Invalid type_comment"}, status=400)

            comment = CommentModel.objects.get(id=comment_id)

            if comment.user.id != user.id:
                return JsonResponse({"error": "You are not the owner of this comment."}, status=403)

            comment.content = new_content
            comment.created_at = now()  # Cập nhật thời gian
            comment.save()

            return JsonResponse({"message": "Comment updated successfully."}, status=200)

        except ObjectDoesNotExist:
            return JsonResponse({"error": "Comment not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def delete(self, request, comment_id, *args, **kwargs):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        try:
            type_comment = request.GET.get("type_comment")
            if not type_comment:
                return JsonResponse({"error": "Missing type_comment"}, status=400)

            CommentModel, fk_name = self._get_model_and_fk(type_comment)
            if not CommentModel:
                return JsonResponse({"error": "Invalid type_comment"}, status=400)

            comment = CommentModel.objects.get(id=comment_id)

            if comment.user.id != user.id:
                return JsonResponse({"error": "You are not the owner of this comment."}, status=403)

            comment.delete()
            return JsonResponse({"message": "Comment deleted successfully."}, status=200)

        except ObjectDoesNotExist:
            return JsonResponse({"error": "Comment not found."}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)