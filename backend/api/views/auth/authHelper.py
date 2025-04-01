from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication

def get_authenticated_user(request):
    """
    Hàm này lấy user từ JWT token trong request headers.
    Trả về tuple (user, error_response).
    Nếu user hợp lệ, error_response = None.
    Nếu lỗi, user = None và error_response chứa JSON response.
    """
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, JsonResponse({"error": "Thiếu token xác thực!"}, status=401)

    try:
        token = auth_header.split(' ')[1]  # Lấy token từ header
        jwt_authenticator = JWTAuthentication()
        user, auth_token = jwt_authenticator.authenticate(request)

        if not user or not user.is_authenticated:
            return None, JsonResponse({"error": "Token không hợp lệ hoặc hết hạn!"}, status=401)

        return user, None  # Trả về user hợp lệ
    except Exception as e:
        return None, JsonResponse({"error": str(e)}, status=500)
