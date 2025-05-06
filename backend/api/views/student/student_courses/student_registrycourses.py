import imaplib
import email
from email.header import decode_header
import re
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from api.models import Course, CourseRegistration
from api.views.auth.authHelper import get_authenticated_user
from rest_framework import status

# ============================ ĐỌC EMAIL ============================
def read_emails_from_gmail():
    try:
        print("📥 Bắt đầu đọc email...")
        mail = imaplib.IMAP4_SSL('imap.gmail.com')
        mail.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        mail.select('inbox')

        status, messages = mail.search(None, 'UNSEEN')
        if status != "OK":
            print("⚠️ Không có email chưa đọc.")
            return []

        email_ids = messages[0].split()
        print(f"📧 Tìm thấy {len(email_ids)} email chưa đọc.")
        email_data = []

        for email_id in email_ids:
            status, msg_data = mail.fetch(email_id, '(RFC822)')
            if status != "OK":
                print(f"⚠️ Không thể fetch email ID {email_id}")
                continue

            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])

                    subject, encoding = decode_header(msg["Subject"])[0]
                    if isinstance(subject, bytes):
                        subject = subject.decode(encoding if encoding else 'utf-8')

                    from_ = msg.get("From")
                    from_name, from_email = decode_header(from_)[0]
                    if isinstance(from_name, bytes):
                        from_name = from_name.decode(encoding if encoding else 'utf-8')

                    body = msg.get_payload(decode=True).decode('utf-8', errors='ignore')

                    print(f"📨 Email từ: {from_email}, Tiêu đề: {subject}")
                    print(f"📝 Nội dung (100 ký tự đầu): {body[:100]}")

                    email_data.append({
                        "subject": subject,
                        "from": from_email,
                        "body": body
                    })

        return email_data

    except Exception as e:
        print(f"❌ Lỗi khi đọc email: {e}")
        return []

# ======================= KIỂM TRA THANH TOÁN =======================
def check_payment_in_email(email_data, course_id, user_id):
    print("🔍 Đang kiểm tra email để xác nhận thanh toán...")
    pattern = re.compile(r"DANG[ _]KY[ _](\d+)[ _](\d+)", re.IGNORECASE)

    for email in email_data:
        body = email['body']
        match = pattern.search(body)

        if match:
            email_course_id = match.group(1)
            email_user_id = match.group(2)
            print(f"✅ Phát hiện: course_id={email_course_id}, user_id={email_user_id}")

            if str(course_id) == email_course_id and str(user_id) == email_user_id:
                print("🎉 Đã xác nhận thanh toán hợp lệ.")
                return True

    print("❌ Không tìm thấy thanh toán hợp lệ trong email.")
    return False

# ===================== API ĐĂNG KÝ KHÓA HỌC =======================
class StudentRegistryCoursesView(APIView):
    def post(self, request, course_id):
        print("🚀 API POST /registry-course được gọi.")
        
        user, error_response = get_authenticated_user(request)
        if error_response:
            print("❌ Người dùng chưa xác thực.")
            return error_response

        try:
            course = Course.objects.get(id=course_id)
            print(f"📘 Tìm thấy khóa học ID: {course_id} - '{course.title}', học phí: {course.fee}")
        except Course.DoesNotExist:
            print("❌ Không tìm thấy khóa học.")
            return Response({'lỗi': 'Không tìm thấy khóa học'}, status=status.HTTP_404_NOT_FOUND)

        if course.fee != 0:
            print("💰 Kiểm tra thanh toán qua email...")
            email_data = read_emails_from_gmail()

            if not email_data:
                print("⚠️ Không lấy được email nào.")
                return Response({'lỗi': 'Chưa nhận được thanh toán hợp lệ (không có email)'}, status=status.HTTP_400_BAD_REQUEST)

            if not check_payment_in_email(email_data, course_id, user.id):
                return Response({'lỗi': 'Chưa nhận được thanh toán hợp lệ'}, status=status.HTTP_400_BAD_REQUEST)

        # Đăng ký nếu chưa có
        registration, created = CourseRegistration.objects.get_or_create(user=user, course=course)

        if not created:
            print("ℹ️ Người dùng đã đăng ký khóa học trước đó.")
            return Response({'thông báo': 'Bạn đã đăng ký khóa học này trước đó'}, status=status.HTTP_200_OK)

        # Tăng số lượng học viên nếu đăng ký mới
        course.student_count += 1
        course.save()
        print(f"✅ Đăng ký thành công. Tổng học viên mới: {course.student_count}")

        return Response({'thông báo': 'Đăng ký khóa học thành công'}, status=status.HTTP_201_CREATED)

    def get(self, request):
        # Kiểm tra xác thực người dùng
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        # Lấy danh sách đăng ký
        registrations = CourseRegistration.objects.filter(user=user).values('user_id', 'course_id')

        return Response({'registrations': list(registrations)}, status=status.HTTP_200_OK)