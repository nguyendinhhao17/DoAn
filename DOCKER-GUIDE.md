# Hướng Dẫn Chạy Dự Án Với Docker Trên Windows

## Yêu Cầu

1. **Docker Desktop for Windows**
   - Tải về: https://www.docker.com/products/docker-desktop
   - Cài đặt và khởi động Docker Desktop
   - Đảm bảo WSL 2 đã được kích hoạt

2. **Git (Optional)**
   - Để clone repository

## Bước 1: Cài Đặt Docker Desktop

### Windows 10/11:

1. Tải Docker Desktop từ: https://www.docker.com/products/docker-desktop
2. Chạy file cài đặt
3. Làm theo hướng dẫn cài đặt
4. Khởi động lại máy tính nếu được yêu cầu
5. Mở Docker Desktop và đợi nó khởi động hoàn toàn
6. Kiểm tra Docker đã cài đặt thành công:

```bash
docker --version
docker-compose --version
```

## Bước 2: Chuẩn Bị Dự Án

### Nếu bạn có dự án từ GitHub:

```bash
git clone <repository-url>
cd <project-folder>
```

### Nếu bạn đã có dự án:

```bash
cd path/to/your/project
```

## Bước 3: Chạy Dự Án Với Docker

### Cách 1: Sử dụng File .bat (Đơn Giản Nhất)

**Start Services:**
- Double-click file `docker-start.bat`
- Hoặc mở Command Prompt và chạy:
```batch
docker-start.bat
```

**Stop Services:**
- Double-click file `docker-stop.bat`
- Hoặc mở Command Prompt và chạy:
```batch
docker-stop.bat
```

### Cách 2: Sử dụng Command Line

**Mở PowerShell hoặc Command Prompt:**

**Build và start tất cả services:**
```bash
docker-compose up --build
```

**Chạy ở chế độ background (detached mode):**
```bash
docker-compose up -d
```

**Xem logs:**
```bash
docker-compose logs -f
```

**Stop services:**
```bash
docker-compose down
```

**Stop và xóa volumes:**
```bash
docker-compose down -v
```

## Bước 4: Kiểm Tra Services Đang Chạy

### Kiểm tra containers:

```bash
docker ps
```

Bạn sẽ thấy 4 containers:
- `ecommerce-auth` (Port 3000)
- `ecommerce-product` (Port 3001)
- `ecommerce-order` (Port 3002)
- `ecommerce-gateway` (Port 3003)

### Kiểm tra logs của từng service:

```bash
docker-compose logs auth
docker-compose logs product
docker-compose logs order
docker-compose logs api-gateway
```

### Kiểm tra logs realtime:

```bash
docker-compose logs -f auth
```

## Bước 5: Test API Với POSTMAN

Sau khi tất cả containers đang chạy, bạn có thể test API như bình thường.

**Lưu ý:** Sử dụng `localhost` thay vì tên container khi test từ máy host.

### 1. Đăng ký người dùng

```
POST http://localhost:3000/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### 2. Đăng nhập

```
POST http://localhost:3000/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

Copy token từ response!

### 3. Tạo sản phẩm

```
POST http://localhost:3001/api/products
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone model",
  "price": 999
}
```

### 4. Xem danh sách sản phẩm

```
GET http://localhost:3001/api/products
Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Xem sản phẩm theo ID

```
GET http://localhost:3001/api/products/{product_id}
Authorization: Bearer YOUR_TOKEN_HERE
```

### 6. Đặt hàng

```
POST http://localhost:3001/api/products/buy
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "ids": ["product_id_1", "product_id_2"]
}
```

### 7. Xem đơn hàng

```
GET http://localhost:3002/api/orders
```

## Các Lệnh Docker Hữu Ích

### Xem tất cả containers (bao gồm đã dừng):

```bash
docker ps -a
```

### Restart một service cụ thể:

```bash
docker-compose restart auth
```

### Rebuild một service cụ thể:

```bash
docker-compose up -d --build auth
```

### Xem resource usage:

```bash
docker stats
```

### Vào shell của một container:

```bash
docker exec -it ecommerce-auth sh
```

### Xóa tất cả containers đã dừng:

```bash
docker container prune
```

### Xóa tất cả images không sử dụng:

```bash
docker image prune -a
```

## Troubleshooting

### Lỗi "Port already in use"

**Kiểm tra port đang được sử dụng:**

Windows:
```bash
netstat -ano | findstr :3000
```

**Stop process đang dùng port:**
```bash
taskkill /PID <PID> /F
```

### Lỗi "Docker daemon not running"

1. Mở Docker Desktop
2. Đợi nó khởi động hoàn toàn
3. Thử lại lệnh

### Lỗi build image

**Xóa cache và rebuild:**
```bash
docker-compose build --no-cache
docker-compose up
```

### Container khởi động nhưng bị crash

**Xem logs chi tiết:**
```bash
docker-compose logs auth
```

### Không connect được Supabase

1. Kiểm tra file `.env` có đúng thông tin
2. Kiểm tra internet connection
3. Kiểm tra Supabase URL có đúng không

### Reset hoàn toàn dự án

```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Lưu Ý Quan Trọng

1. **Docker Desktop phải đang chạy** trước khi execute bất kỳ lệnh docker nào

2. **Port conflicts:** Đảm bảo các port 3000, 3001, 3002, 3003 không bị sử dụng bởi ứng dụng khác

3. **File .env:** Các biến môi trường được định nghĩa trong `docker-compose.yml`, không cần file `.env` riêng cho Docker

4. **Network:** Tất cả services chạy trong cùng một Docker network (`ecommerce-network`), cho phép chúng giao tiếp với nhau

5. **Data persistence:** Dữ liệu được lưu trong Supabase (PostgreSQL cloud), không cần volume cho database

## Chứng Minh Với POSTMAN Đang Gọi Đến Docker

Khi test với POSTMAN để chứng minh services đang chạy trên Docker:

1. **Start services với Docker:**
   ```bash
   docker-compose up -d
   ```

2. **Kiểm tra containers đang chạy:**
   ```bash
   docker ps
   ```
   Screenshot này để chứng minh!

3. **Xem logs realtime:**
   ```bash
   docker-compose logs -f
   ```

4. **Test với POSTMAN:**
   - Mỗi request sẽ hiển thị log trong terminal
   - Logs sẽ show từ container tương ứng
   - Chứng minh request đang được xử lý bởi Docker containers

5. **Ví dụ log khi POST /register:**
   ```
   ecommerce-auth | POST /register 201 - 156.789 ms
   ```

## Câu Hỏi Thường Gặp

**Q: Có cần cài Node.js không?**
A: Không! Docker sẽ lo tất cả. Chỉ cần Docker Desktop.

**Q: Có cần chạy npm install không?**
A: Không! Docker sẽ tự động install dependencies trong containers.

**Q: Làm sao biết services đã sẵn sàng?**
A: Chạy `docker-compose logs` và xem các dòng:
- "Server started on port 3000"
- "Product Service started on port 3001"
- "Order Service started on port 3002"
- "API Gateway listening on port 3003"

**Q: Có thể code trong khi Docker đang chạy không?**
A: Được, nhưng cần rebuild image sau khi thay đổi code:
```bash
docker-compose up -d --build
```

**Q: Làm sao xem code trong container?**
A: Vào shell của container:
```bash
docker exec -it ecommerce-auth sh
ls -la
cat index.js
```

## Tối Ưu Workflow

### Development Workflow:

1. Code changes trong VSCode
2. Rebuild service cụ thể:
   ```bash
   docker-compose up -d --build auth
   ```
3. Test với POSTMAN
4. Xem logs nếu có lỗi:
   ```bash
   docker-compose logs -f auth
   ```

### Production-like Testing:

```bash
docker-compose up --build
```

Chạy tất cả services cùng lúc để test integration.
