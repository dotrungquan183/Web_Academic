from rest_framework.views import APIView
from rest_framework.response import Response
from api.models import Reputation
from api.serializers import ReputationSerializer

class AdminReputationListView(APIView):
    def get(self, request):
        reputations = Reputation.objects.all()
        serializer = ReputationSerializer(reputations, many=True)
        return Response(serializer.data)
