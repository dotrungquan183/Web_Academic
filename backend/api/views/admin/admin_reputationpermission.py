from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from api.models import ReputationPermission
from api.serializers import ReputationPermissionSerializer
from api.views.auth.authHelper import get_authenticated_user


class AdminReputationPermissionView(APIView):
    def get(self, request):
        # 📜 Lấy toàn bộ danh sách quyền
        permissions = ReputationPermission.objects.all()
        serializer = ReputationPermissionSerializer(permissions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # 🔐 Xác thực người dùng
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        # 📥 Parse payload
        action_key = request.data.get('action_key')
        description = request.data.get('description')
        min_reputation = request.data.get('min_reputation')

        # ✅ Kiểm tra các trường bắt buộc
        if not all([action_key, description]) or min_reputation is None:
            return Response(
                {"error": "Thiếu thông tin action_key, description hoặc min_reputation!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🧮 Tìm bản ghi đã tồn tại hoặc tạo mới
        permission, created = ReputationPermission.objects.get_or_create(
            action_key=action_key,
            defaults={
                'description': description,
                'min_reputation': min_reputation,
                'user_id_last_update': user
            }
        )

        # 📝 Nếu đã tồn tại thì update
        if not created:
            permission.description = description
            permission.min_reputation = min_reputation
            permission.user_id_last_update = user
            permission.save()

        # 🎯 Serialize và trả response
        serializer = ReputationPermissionSerializer(permission)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )
