from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import AutoApproveSetting
from api.views.auth.authHelper import get_authenticated_user
import logging
from rest_framework.permissions import AllowAny

logger = logging.getLogger(__name__)

class AdminAutoApproveSettingView(APIView):
    permission_classes = [AllowAny]  # Nếu không cần xác thực

    def post(self, request):
        logger.info(f"Request data: {request.data}")

        config_data = request.data.get('autoApprove')
        if not isinstance(config_data, dict):
            return Response(
                {"error": "Dữ liệu không hợp lệ"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Duyệt qua từng loại (question, answer, comment, courses)
            for type_name, config in config_data.items():
                setting, _ = AutoApproveSetting.objects.get_or_create(type=type_name)
                setting.enabled = config.get('enabled', False)
                setting.from_date = config.get('from') or None
                setting.to_date = config.get('to') or None
                setting.save()
                logger.info(f"Cập nhật AutoApproveSetting {type_name}: {config}")

            return Response(
                {"message": "Lưu cấu hình auto-approve thành công"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.error(f"Lỗi khi lưu config auto-approve: {e}")
            return Response(
                {"error": "Server error"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

