from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from api.views.auth.authHelper import get_authenticated_user
from api.models import Comment
from django.contrib.auth.models import User
from django.utils import timezone
import json
from django.utils.timezone import now
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
@method_decorator(csrf_exempt, name="dispatch")
class StudentCommentView(View):
    def post(self, request, *args, **kwargs):
        try:
            user, error_response = get_authenticated_user(request)
            if error_response:
                return error_response

            type_comment = request.POST.get("type_comment")
            content_id = request.POST.get("content_id")
            content = request.POST.get("content")
            uploaded_file = request.FILES.get("comments")  # file đính kèm

            if not all([type_comment, content_id, content]):
                return JsonResponse({"error": "Missing fields"}, status=400)

            comment = Comment.objects.create(
                type_comment=type_comment,
                content_id=int(content_id),
                content=content,
                user=user,
                file=uploaded_file if uploaded_file else None,
                created_at=now(),
            )

            # ✅ Gửi comment mới qua WebSocket
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
                        "username": user.username,  # ✅ dùng đúng key "username"
                        "created_at": comment.created_at.strftime("%d/%m/%Y %H:%M"),  # ✅ format đẹp
                        "has_file": bool(uploaded_file),
                        "file_url": comment.file.url if uploaded_file else None,
                    }
                }
            )

            return JsonResponse({
                "message": "Comment created successfully",
                "comment_id": comment.id
            }, status=201)

        except Exception as e:
            print("Error occurred:", str(e))
            return JsonResponse({"error": str(e)}, status=500)


    def get(self, request, *args, **kwargs):
        try:
            type_comment = request.GET.get("type_comment")
            content_id = request.GET.get("content_id")

            if not all([type_comment, content_id]):
                return JsonResponse({"error": "Missing query params"}, status=400)

            comments = Comment.objects.filter(
                type_comment=type_comment,
                content_id=content_id
            ).select_related("user").order_by("-created_at")

            data = [
                {
                    "id": c.id,
                    "user_id": c.user.id,
                    "username": c.user.username,
                    "content": c.content,
                    "created_at": c.created_at.strftime("%d/%m/%Y %H:%M"),
                    "file_url": c.file.url if c.file else None,  # Thêm URL file (nếu có)
                    "file_name": c.file.name.split('/')[-1] if c.file else None,
                }
                for c in comments
            ]

            return JsonResponse({"comments": data}, status=200)

        except Exception as e:
            print("Error on GET:", str(e))
            return JsonResponse({"error": str(e)}, status=500)


    def put(self, request, comment_id=None, *args, **kwargs):
        # Giả sử get_authenticated_user trả về một tuple gồm user và error_response
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response  # Trả về phản hồi lỗi nếu có

        try:
            # Phân tích dữ liệu JSON từ request body
            data = json.loads(request.body)
            new_content = data.get("content")
            if not new_content:
                return JsonResponse({"error": "Missing 'content'"}, status=400)

            # Lấy comment từ database
            comment = Comment.objects.get(id=comment_id)

            # Kiểm tra quyền sở hữu bình luận
            if comment.user.id != user.id:  # So sánh ID người dùng
                return JsonResponse({"error": "You are not the owner of this comment."}, status=403)

            # Cập nhật nội dung bình luận và trường created_at thành thời gian hiện tại
            comment.content = new_content
            comment.created_at = timezone.now()  # Cập nhật created_at với thời gian hiện tại
            comment.save()

            return JsonResponse({"message": "Comment updated successfully."}, status=200)

        except Comment.DoesNotExist:
            return JsonResponse({"error": "Comment not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)

        except Exception as e:
            # Nếu có lỗi bất thường nào khác
            return JsonResponse({"error": str(e)}, status=500)
        
    def delete(self, request, comment_id, *args, **kwargs):
        # Lấy thông tin người dùng đã xác thực
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response  # Trả về phản hồi lỗi nếu có

        try:
            # Tìm bình luận theo comment_id
            comment = Comment.objects.get(id=comment_id)

            # Kiểm tra quyền sở hữu bình luận
            if comment.user.id != user.id:  # So sánh ID người dùng
                return JsonResponse({"error": "You are not the owner of this comment."}, status=403)

            # Xóa bình luận
            comment.delete()

            return JsonResponse({"message": "Comment deleted successfully."}, status=200)

        except Comment.DoesNotExist:
            return JsonResponse({"error": "Comment not found."}, status=404)

        except Exception as e:
            # Nếu có lỗi bất thường nào khác
            return JsonResponse({"error": str(e)}, status=500)