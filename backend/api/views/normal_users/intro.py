from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class IntroView(APIView):
    def get(self, request):
        data = {
            "title": "Giới thiệu",
            "content": "Chúng tôi là một tổ chức giáo dục hàng đầu."
        }
        return Response(data, status=status.HTTP_200_OK)
