from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from api.models import Course
from api.serializers import CourseSerializer
from django.shortcuts import get_object_or_404

class AdminDetailCoursesView(APIView):
    def get(self, request, pk):
        # ✅ Chỉ lấy khóa học đã được phê duyệt
        course = get_object_or_404(Course, pk=pk, is_approve=0)

        # ✅ Serialize và trả về dữ liệu
        serializer = CourseSerializer(course)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        # Tìm khóa học theo ID, nếu không có sẽ trả 404
        course = get_object_or_404(Course, pk=pk)
        
        # Xóa khóa học
        course.delete()
        
        return Response(
            {"message": f"✅ Khóa học với id {pk} đã được xóa thành công."},
            status=status.HTTP_204_NO_CONTENT
        )