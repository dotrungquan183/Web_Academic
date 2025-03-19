from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ParentsCornerView(APIView):
    def get(self, request):
        data = {
            "title": "Góc phụ huynh",
            "content": "Cảm ơn các phụ huynh đã tin tưởng và đồng hành cùng chúng tôi."
        }
        return Response(data, status=status.HTTP_200_OK)
