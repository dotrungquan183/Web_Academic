from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class StudentQuestionView(APIView):
    def get(self, request):
        data = {
            "title": "Diễn đàn sinh viên",
            "content": [
                "Đây là câu hỏi của sinh viên:",
                "1. Làm thế nào để tối ưu thuật toán sắp xếp?",
                "2. Có những framework nào hỗ trợ AI tốt nhất hiện nay?",
                "3. Làm sao để kết nối backend với frontend một cách hiệu quả?",
                "4. Hướng dẫn cài đặt môi trường lập trình Python trên Windows?"
            ]
        }
        return Response(data, status=status.HTTP_200_OK)
