from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from api.models import Reputation
from api.serializers import ReputationSerializer
from api.views.auth.authHelper import get_authenticated_user

class AdminReputationListView(APIView):
    def get(self, request):
        reputations = Reputation.objects.all()
        serializer = ReputationSerializer(reputations, many=True)
        return Response(serializer.data)

    def post(self, request):
        # 1. Lấy user từ JWT
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        # 2. Parse payload
        rule_key = request.data.get('rule_key')
        description = request.data.get('description')
        point_change = request.data.get('point_change')

        if not all([rule_key, description]) or point_change is None:
            return Response(
                {"error": "Thiếu thông tin rule_key, description hoặc point_change!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Tìm existing record hoặc tạo mới
        reputation, created = Reputation.objects.get_or_create(
            rule_key=rule_key,
            defaults={'description': description, 'point_change': point_change, 'user_id_last_update': user}
        )

        # Nếu đã tồn tại thì update
        if not created:
            reputation.description = description
            reputation.point_change = point_change
            reputation.user_id_last_update = user
            reputation.save()

        # 4. Serialize và trả response
        serializer = ReputationSerializer(reputation)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )