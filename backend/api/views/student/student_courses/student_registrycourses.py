import imaplib
import email
from email.header import decode_header
import re
import time
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
        print("\U0001F4E5 Bắt đầu đọc email...")
        mail = imaplib.IMAP4_SSL('imap.gmail.com')
        mail.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        mail.select('inbox')
 
        status, messages = mail.search(None, 'UNSEEN')
        if status != "OK":
            print("⚠️ Không có email chưa đọc.")
            return []
 
        email_ids = messages[0].split()
        print(f"\U0001F4E7 Tìm thấy {len(email_ids)} email chưa đọc.")
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
 
                    if "no-reply@sms-forwarder.com" not in from_:
                        continue
 
                    if re.search(r"TK ViettelPay.*?GD.*?VND.*?luc.*?So du.*?VND", body):
                        print(f"✅ Email hợp lệ từ: {from_}, Tiêu đề: {subject}")
                        print(f"\U0001F4E9 Nội dung (100 ký tự đầu): {body[:100]}")
 
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
def check_payment_in_email(email_data, course_id, user_id, expected_fee):
    print("\U0001F50D Đang kiểm tra email để xác nhận thanh toán...")
 
    pattern = re.compile(r"DANG[ _]?KY[ _]?(\d+)[ _]?(\d+)", re.IGNORECASE)
    amount_pattern = re.compile(r"GD.*?([0-9\.]+)\s*VND", re.IGNORECASE)
 
    total_amount = 0
    found = False
 
    for email_item in email_data:
        body = email_item['body']
        print("\U0001F4E8 Nội dung email:")
        print(body[:300])
 
        match = pattern.search(body)
        amount_match = amount_pattern.search(body)
 
        if match and amount_match:
            email_course_id = match.group(1)
            email_user_id = match.group(2)
 
            if str(course_id) == email_course_id and str(user_id) == email_user_id:
                try:
                    amount_str = amount_match.group(1).replace('.', '')
                    amount = int(amount_str)
                    total_amount += amount
                    found = True
                    print(f"✅ Cộng dồn: {amount} VND, Tổng hiện tại: {total_amount} VND")
                except ValueError:
                    print("❌ Không thể phân tích số tiền từ email.")
 
    if not found:
        print("❌ Không tìm thấy mã thanh toán phù hợp.")
        return False, "Không tìm thấy mã thanh toán phù hợp"
 
    if total_amount >= expected_fee:
        print("\U0001F389 Đã xác nhận thanh toán hợp lệ.")
        return True, None
 
    print("⏳ Số tiền chưa đủ, chờ 2 phút để kiểm tra lại...")
    time.sleep(0.5)
    email_data_retry = read_emails_from_gmail()
 
    # Kiểm tra lại sau khi chờ 2 phút
    total_amount_retry = total_amount
    found_retry = found
 
    for email_item in email_data_retry:
        body = email_item['body']
        match = pattern.search(body)
        amount_match = amount_pattern.search(body)
 
        if match and amount_match:
            email_course_id = match.group(1)
            email_user_id = match.group(2)
 
            if str(course_id) == email_course_id and str(user_id) == email_user_id:
                try:
                    amount_str = amount_match.group(1).replace('.', '')
                    amount = int(amount_str)
                    total_amount_retry += amount
                    found_retry = True
                    print(f"✅ (Lần 2) Cộng dồn: {amount} VND, Tổng hiện tại: {total_amount_retry} VND")
                except ValueError:
                    pass
 
    if found_retry and total_amount_retry >= expected_fee:
        print("\U0001F389 Đã xác nhận thanh toán hợp lệ sau lần kiểm tra thứ 2.")
        return True, None
 
    print("❌ Sau 2 phút, vẫn không đủ tiền hoặc không tìm thấy mã thanh toán phù hợp.")
    return False, "Số tiền chưa đủ hoặc không tìm thấy mã sau lần kiểm tra thứ hai"
 
# ===================== API ĐĂNG KÝ KHÓA HỌC =======================
class StudentRegistryCoursesView(APIView):
    def post(self, request, course_id):
        print("🚀 [POST] /registry-course")
 
        user, error_response = get_authenticated_user(request)
        if error_response:
            print("❌ Người dùng chưa xác thực.")
            return error_response
 
        try:
            course = Course.objects.get(id=course_id)
            print(f"\U0001F4D8 Khóa học: ID={course.id}, Tiêu đề='{course.title}', Học phí={course.fee}")
        except Course.DoesNotExist:
            print("❌ Không tìm thấy khóa học.")
            return Response({'error': 'Không tìm thấy khóa học'}, status=status.HTTP_404_NOT_FOUND)
 
        if course.fee > 0:
            print("\U0001F4B0 Kiểm tra email xác nhận thanh toán...")
            email_data = read_emails_from_gmail()
 
            if not email_data:
                print("⚠️ Không tìm thấy email.")
                return Response({'error': 'Không có email thanh toán được tìm thấy'}, status=status.HTTP_400_BAD_REQUEST)
 
            is_paid, reason = check_payment_in_email(email_data, course_id, user.id, course.fee)
            if not is_paid:
                print(f"❌ Email không hợp lệ: {reason}")
                return Response({'error': 'Số tiền chưa đủ. Vui lòng liên hệ admin để được hoàn tiền hoặc hỗ trợ.'}, status=status.HTTP_400_BAD_REQUEST)
 
        registration, created = CourseRegistration.objects.get_or_create(user=user, course=course)
 
        if not created:
            print("ℹ️ Người dùng đã đăng ký khóa học trước đó.")
            return Response({'message': 'Bạn đã đăng ký khóa học này rồi'}, status=status.HTTP_200_OK)
 
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