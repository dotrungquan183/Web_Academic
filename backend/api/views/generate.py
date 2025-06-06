from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from decimal import Decimal
from openai import OpenAI

# Cấu hình DeepSeek client
client = OpenAI(
    api_key="sk-448fabfc586b442daee4d626f7bdf81b",
    base_url="https://api.deepseek.com"
)

@csrf_exempt
def generate_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Phương thức không được hỗ trợ. Hãy dùng POST."}, status=405)

    try:
        data = json.loads(request.body)
        input_text = data.get("input_text", "").strip()

        if not input_text:
            return JsonResponse({"error": "Thiếu nội dung câu hỏi (input_text)."}, status=400)

        # Gửi yêu cầu đến DeepSeek Chat
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {
                    "role": "system",
                    "content": "Bạn là một trợ lý giỏi, chuyên giải bài tập toán bằng tiếng Việt. Luôn giải thích chi tiết từng bước và sử dụng ngôn ngữ dễ hiểu."
                },
                {
                    "role": "user",
                    "content": f"Hãy giải bài toán sau và trình bày lời giải chi tiết bằng tiếng Việt: {input_text}"
                }
            ],
            temperature=0.7,
            max_tokens=1024
        )

        # Xử lý phản hồi
        choices = response.choices
        if choices and choices[0].message and choices[0].message.content:
            result = choices[0].message.content.strip()
        else:
            result = "⚠️ Không nhận được phản hồi từ mô hình."

        return JsonResponse({"result": result}, status=200)

    except Exception as e:
        print("💥 Lỗi xử lý:", str(e))
        return JsonResponse({"error": f"Lỗi xử lý: {str(e)}"}, status=500)
