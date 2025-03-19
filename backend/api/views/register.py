import json
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from api.models import UserInformation
from django.conf import settings

UPLOAD_DIR = os.path.join(settings.BASE_DIR, "image")  # Thư mục lưu ảnh

@csrf_exempt
def register_view(request):
    if request.method == "POST":
        try:
            if request.content_type.startswith("multipart/form-data"):
                data = request.POST
                avatar_file = request.FILES.get("avatar")  # Lấy file ảnh nếu có
            else:
                return JsonResponse({"error": "Invalid Content-Type"}, status=400)

            required_fields = ["full_name", "phone", "gender", "user_type", "address"]
            for field in required_fields:
                if field not in data:
                    return JsonResponse({"error": f"Thiếu trường bắt buộc: {field}"}, status=400)

            # Tạo user
            user = UserInformation.objects.create(
                full_name=data["full_name"],
                phone=data["phone"],
                birth_date=data.get("birth_date"),
                gender=data["gender"],
                user_type=data["user_type"],
                address=data["address"],
                password=data["password"],
            )

            # Lưu avatar nếu có
            avatar_url = None
            if avatar_file:
                if not os.path.exists(UPLOAD_DIR):
                    os.makedirs(UPLOAD_DIR)  # Tạo thư mục nếu chưa có
                
                file_extension = avatar_file.name.split('.')[-1]  # Lấy phần mở rộng file
                avatar_filename = f"{user.id}.{file_extension}"  # Đặt tên file theo id
                file_path = os.path.join(UPLOAD_DIR, avatar_filename)

                with open(file_path, 'wb') as destination:
                    for chunk in avatar_file.chunks():
                        destination.write(chunk)

                avatar_url = f"/image/{avatar_filename}"  # Đường dẫn lưu vào database
                user.avatar = avatar_url
                user.save()  # Cập nhật user với đường dẫn ảnh

            return JsonResponse({"message": "Đăng ký thành công!", "user_id": user.id, "avatar": avatar_url}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Method Not Allowed"}, status=405)
