from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class MediaCoverageView(APIView):
    def get(self, request):
        data = {
            "title": "Báo chí nói về chúng tôi",
            "content": "Chúng tôi đã được báo chí đánh giá cao về chất lượng giảng dạy."
        }
        return Response(data, status=status.HTTP_200_OK)
