from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class AdminView(APIView):
    def get(self, request):
        data = {
            "title": "Admin",
            "content": "Bố là Admin"
        }
        return Response(data, status=status.HTTP_200_OK)
