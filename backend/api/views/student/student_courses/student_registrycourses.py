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
        filtered_emails = []

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

                    body = ""
                    if msg.is_multipart():
                        for part in msg.walk():
                            content_type = part.get_content_type()
                            content_disposition = str(part.get("Content-Disposition"))
                            if content_type == "text/plain" and "attachment" not in content_disposition:
                                try:
                                    part_body = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                                    body += part_body
                                except:
                                    pass
                    else:
                        body = msg.get_payload(decode=True).decode('utf-8', errors='ignore')

                    # ⚠️ Chỉ lọc email từ sms-forwarder
                    if "no-reply@sms-forwarder.com" not in from_:
                        continue

                    # ✅ Kiểm tra nội dung có chứa giao dịch ViettelPay không
                    if re.search(r"TK ViettelPay.*?GD.*?VND.*?luc.*?So du.*?VND", body):
                        print(f"✅ Email hợp lệ từ: {from_}, Tiêu đề: {subject}")
                        print(f"📩 Nội dung (100 ký tự đầu): {body[:100]}")

                        filtered_emails.append({
                            "subject": subject,
                            "from": from_,
                            "body": body
                        })

        return filtered_emails

    except Exception as e:
        print(f"❌ Lỗi khi đọc email: {e}")
        return []

# ======================= KIỂM TRA THANH TOÁN =======================
def check_payment_in_email(email_data, course_id, user_id):
    print("🔍 Đang kiểm tra email để xác nhận thanh toán...")
    
    # Regex linh hoạt hơn: chấp nhận DANGKY_5_10, DANG KY 5 10, v.v.
    pattern = re.compile(r"DANG[ _]?KY[ _]?(\d+)[ _]?(\d+)", re.IGNORECASE)

    for email_item in email_data:
        body = email_item['body']

        # In nội dung body để debug nếu cần
        print("📨 Nội dung email:")
        print(body[:300])  # Giới hạn in để tránh log quá dài

        # Tìm kiếm theo pattern
        match = pattern.search(body)
        if match:
            email_course_id = match.group(1)
            email_user_id = match.group(2)

            print(f"✅ Phát hiện ID từ email: course_id={email_course_id}, user_id={email_user_id}")

            if str(course_id) == email_course_id and str(user_id) == email_user_id:
                print("🎉 Đã xác nhận thanh toán hợp lệ.")
                return True
            else:
                print("⚠️ Khớp định dạng nhưng không đúng ID khóa học hoặc người dùng.")

    print("❌ Không tìm thấy thanh toán hợp lệ trong email.")
    return False
# ===================== API ĐĂNG KÝ KHÓA HỌC =======================
class StudentRegistryCoursesView(APIView):
    def post(self, request, course_id):
        print("🚀 [POST] /registry-course")

        # Xác thực người dùng
        user, error_response = get_authenticated_user(request)
        if error_response:
            print("❌ Người dùng chưa xác thực.")
            return error_response

        # Tìm khóa học
        try:
            course = Course.objects.get(id=course_id)
            print(f"📘 Khóa học: ID={course.id}, Tiêu đề='{course.title}', Học phí={course.fee}")
        except Course.DoesNotExist:
            print("❌ Không tìm thấy khóa học.")
            return Response({'error': 'Không tìm thấy khóa học'}, status=status.HTTP_404_NOT_FOUND)

        # Nếu có học phí, kiểm tra email thanh toán
        if course.fee > 0:
            print("💰 Kiểm tra email xác nhận thanh toán...")
            email_data = read_emails_from_gmail()

            if not email_data:
                print("⚠️ Không tìm thấy email.")
                return Response({'error': 'Không có email thanh toán được tìm thấy'}, status=status.HTTP_400_BAD_REQUEST)

            if not check_payment_in_email(email_data, course_id, user.id):
                print("❌ Email không chứa thông tin thanh toán hợp lệ.")
                return Response({'error': 'Không tìm thấy thanh toán hợp lệ trong email'}, status=status.HTTP_400_BAD_REQUEST)

        # Tạo bản ghi đăng ký nếu chưa có
        registration, created = CourseRegistration.objects.get_or_create(user=user, course=course)

        if not created:
            print("ℹ️ Người dùng đã đăng ký khóa học trước đó.")
            return Response({'message': 'Bạn đã đăng ký khóa học này rồi'}, status=status.HTTP_200_OK)

        # Tăng số lượng học viên nếu là đăng ký mới
        course.student_count += 1
        course.save()
        print(f"✅ Đăng ký thành công. Tổng học viên: {course.student_count}")

        return Response({'message': 'Đăng ký khóa học thành công'}, status=status.HTTP_201_CREATED)

    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        registrations = CourseRegistration.objects.filter(user=user).values('user_id', 'course_id')
        return Response({'registrations': list(registrations)}, status=status.HTTP_200_OK)