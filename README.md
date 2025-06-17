# Mã nguồn: https://github.com/dotrungquan183/Web_Academic.git

# Hướng Dẫn Triển Khai Hệ Thống


## I. Triển khai trên máy cá nhân

### 1. Cài đặt môi trường
- **Backend**: Django (Python)
- **Frontend**: ReactJS hoặc tương đương
- **Cơ sở dữ liệu**: MySQL

### 2. Chạy Backend
```bash
cd backend
python manage.py runserver
```
Django sẽ chạy tại: `http://127.0.0.1:8000`

### 3. Chạy Frontend
```bash
cd frontend
npm start
```
Frontend hiển thị tại: `http://localhost:3000`

### 4. Cấu hình API nội bộ
Tạo hoặc chỉnh sửa file `frontend/src/config.js`:

```javascript
export const API_WIFI_URL = "http://127.0.0.1:8000";
```

---

## II. Triển khai trong mạng LAN (phòng lab, lớp học)

### 1. Chạy Backend với IP LAN
```bash
python manage.py runserver 0.0.0.0:8000
```

### 2. Tự động lấy IP máy chủ (trong `backend/settings.py`)
```python
import socket
hostname = socket.gethostname()
SERVER_LOCAL_IP = socket.gethostbyname(hostname)
BACKEND_API_BASE_URL = f"http://{SERVER_LOCAL_IP}:8000"
```

### 3. Cập nhật cấu hình frontend (`frontend/src/config.js`)
```javascript
export const API_WIFI_URL = "http://192.168.1.15:8000";
```
> Lưu ý: Thay `192.168.1.15` bằng IP thật của máy chủ trong mạng LAN

### 4. Gọi API trong frontend
```javascript
import { API_WIFI_URL } from './config';

fetch(`${API_WIFI_URL}/api/xxx`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### 5. Truy cập hệ thống từ máy khác trong mạng
Mở trình duyệt và truy cập: `http://192.168.1.15:3000`

---
