from django.http import JsonResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from api.views.auth.authHelper import get_authenticated_user
from api.models import Comment
from django.contrib.auth.models import User
import json

@method_decorator(csrf_exempt, name="dispatch")
class StudentCommentView(View):
    def post(self, request, *args, **kwargs):
        try:
            user, error_response = get_authenticated_user(request)
            if error_response:
                return error_response

            data = json.loads(request.body)
            print("Received data:", data)

            type_comment = data.get("type_comment")
            content_id = data.get("content_id")
            content = data.get("content")

            if not all([type_comment, content_id, content]):
                return JsonResponse({"error": "Missing fields"}, status=400)

            comment = Comment.objects.create(
                type_comment=type_comment,
                content_id=content_id,
                content=content,
                user=user,
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
                    "username": c.user.username,
                    "content": c.content,
                    "created_at": c.created_at.strftime("%d/%m/%Y %H:%M"),
                }
                for c in comments
            ]

            return JsonResponse({"comments": data}, status=200)

        except Exception as e:
            print("Error on GET:", str(e))
            return JsonResponse({"error": str(e)}, status=500)

