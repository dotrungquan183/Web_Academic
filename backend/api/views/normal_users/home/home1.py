from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class Home1View(APIView):
    def get(self, request):
        data = {
            "title": "Home 1",
            "content": "Nội dung của Home 1"
        }
        return Response(data, status=status.HTTP_200_OK)
