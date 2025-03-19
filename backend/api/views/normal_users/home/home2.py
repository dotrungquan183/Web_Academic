from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class Home2View(APIView):
    def get(self, request):
        data = {
            "title": "Home 2",
            "content": "Nội dung của Home 2"
        }
        return Response(data, status=status.HTTP_200_OK)
