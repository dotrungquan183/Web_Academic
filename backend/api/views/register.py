import json
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.conf import settings
from api.models import UserInformation
from datetime import datetime

UPLOAD_DIR = os.path.join(settings.BASE_DIR, "image")  # Thư mục lưu avatar

@csrf_exempt
def register_view(request):
    if request.method == "POST":
        try:
            if request.content_type.startswith("multipart/form-data"):
                data = request.POST
                avatar_file = request.FILES.get("avatar")  # Lấy file avatar nếu có
            else:
                return JsonResponse({"error": "Invalid Content-Type"}, status=400)

            # Danh sách các trường bắt buộc
            required_fields = ["username", "password", "full_name", "gender", "user_type", "email"]
            for field in required_fields:
                if field not in data or not data[field].strip():
                    return JsonResponse({"error": f"Thiếu hoặc để trống trường bắt buộc: {field}"}, status=400)

            # Kiểm tra username đã tồn tại chưa
            if User.objects.filter(username=data["username"]).exists():
                return JsonResponse({"error": "Tên đăng nhập đã tồn tại."}, status=400)

            # Kiểm tra email đã tồn tại chưa
            if User.objects.filter(email=data["email"]).exists():
                return JsonResponse({"error": "Email đã tồn tại."}, status=400)

            # Xử lý ngày sinh (nếu có)
            birth_date = data.get("birth_date")
            if birth_date:
                try:
                    birth_date = datetime.strptime(birth_date, "%Y-%m-%d").date()
                except ValueError:
                    return JsonResponse({"error": "Ngày sinh không hợp lệ. Định dạng đúng: YYYY-MM-DD"}, status=400)
            else:
                birth_date = None

            # Tạo user trong bảng auth_user
            try:
                full_name_parts = data["full_name"].strip().split()
                first_name = full_name_parts[0] if len(full_name_parts) > 0 else ""
                last_name = " ".join(full_name_parts[1:]) if len(full_name_parts) > 1 else ""

                auth_user = User.objects.create_user(
                    username=data["username"],
                    first_name=first_name,
                    last_name=last_name,
                    email=data["email"],
                    password=data["password"],  # Mã hóa tự động
                    is_active=True
                )
            except Exception as e:
                return JsonResponse({"error": f"Lỗi khi tạo auth_user: {str(e)}"}, status=400)

            # Tạo user trong bảng UserInformation
            user_info = UserInformation.objects.create(
                user=auth_user,  # Gán user từ auth_user
                full_name=data["full_name"],
                phone=data.get("phone"),
                birth_date=birth_date,
                gender=data["gender"],
                user_type=data["user_type"],
                address=data.get("address"),
                avatar=None  # Cập nhật sau nếu có ảnh
            )

            # Lưu avatar nếu có
            avatar_url = None
            if avatar_file:
                if not os.path.exists(UPLOAD_DIR):
                    os.makedirs(UPLOAD_DIR)  # Tạo thư mục nếu chưa có
                
                file_extension = avatar_file.name.split('.')[-1]  # Lấy phần mở rộng file
                avatar_filename = f"{user_info.user.id}.{file_extension}"  # Đặt tên file theo ID
                file_path = os.path.join(UPLOAD_DIR, avatar_filename)

                with open(file_path, 'wb') as destination:
                    for chunk in avatar_file.chunks():
                        destination.write(chunk)

                avatar_url = f"/image/{avatar_filename}"  # Đường dẫn lưu vào database
                user_info.avatar = avatar_url
                user_info.save()  # Cập nhật user với đường dẫn ảnh

            return JsonResponse({
                "message": "Đăng ký thành công!",
                "user_id": auth_user.id,
                "username": auth_user.username,
                "first_name": auth_user.first_name,
                "last_name": auth_user.last_name,
                "email": auth_user.email,
                "avatar": avatar_url
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Method Not Allowed"}, status=405)
