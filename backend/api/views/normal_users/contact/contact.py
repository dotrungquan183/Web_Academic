from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ContactView(APIView):
    def get(self, request):
        data = {
            "title": "Liên hệ",
            "content": "Bạn có thể liên hệ với chúng tôi qua số điện thoại 123-456-789."
        }
        return Response(data, status=status.HTTP_200_OK)
