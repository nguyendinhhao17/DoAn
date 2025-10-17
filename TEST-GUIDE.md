# Hướng Dẫn Test Dự Án

## Chuẩn Bị Trước Khi Test

### 1. Đảm bảo MongoDB và RabbitMQ đang chạy
```bash
# Kiểm tra MongoDB
mongod --version
ps aux | grep mongod

# Kiểm tra RabbitMQ
rabbitmqctl status
```

### 2. Cài đặt tất cả dependencies
```bash
npm run setup
```

## Test Auth Service

### 1. Khởi động Auth Service
```bash
cd auth
node index.js
```

### 2. Chạy test (terminal mới)
```bash
cd auth
npm test
```

### Test cases Auth Service:
- ✓ Đăng ký người dùng mới
- ✓ Lỗi khi username đã tồn tại
- ✓ Đăng nhập thành công và nhận JWT token
- ✓ Lỗi khi username không tồn tại
- ✓ Lỗi khi mật khẩu sai

### Test thủ công với curl:

**Đăng ký:**
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

**Đăng nhập:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

**Truy cập dashboard (cần token):**
```bash
curl -X GET http://localhost:3000/dashboard \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Test Product Service

### Điều kiện tiên quyết:
1. Auth Service phải đang chạy (port 3000)
2. Product Service phải đang chạy (port 3001)
3. MongoDB phải đang chạy
4. RabbitMQ phải đang chạy
5. User test phải được tạo trước

### 1. Tạo user test (nếu chưa có)
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password"}'
```

### 2. Khởi động Product Service
```bash
cd product
node index.js
```

### 3. Chạy test (terminal mới)
```bash
cd product
npm test
```

### Test cases Product Service:
- ✓ Tạo sản phẩm mới (cần authentication)
- ✓ Lỗi khi thiếu tên sản phẩm

### Test thủ công với curl:

**Lấy token trước:**
```bash
TOKEN=$(curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password"}' | jq -r '.token')
```

**Tạo sản phẩm:**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Product Test",
    "price": 100,
    "description": "Test product description"
  }'
```

**Lấy danh sách sản phẩm:**
```bash
curl -X GET http://localhost:3001/api/products \
  -H "Authorization: Bearer $TOKEN"
```

## Test Order Service

Order Service hoạt động như consumer từ RabbitMQ, không có HTTP endpoints trực tiếp.

### Kiểm tra Order Service:

1. **Khởi động Order Service:**
```bash
cd order
node index.js
```

2. **Kiểm tra logs:**
- Xem message: "Connecting to RabbitMQ..."
- Sau 10 giây: "Connected to RabbitMQ"
- Khi có order: "Consuming ORDER service"

3. **Test integration với Product Service:**
- Khi tạo order qua Product Service, Order Service sẽ tự động nhận và xử lý message

## Test API Gateway

### 1. Khởi động API Gateway
```bash
cd api-gateway
node index.js
```

### 2. Test routing qua Gateway (port 3003):

**Auth qua Gateway:**
```bash
curl -X POST http://localhost:3003/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"gateway-test","password":"test123"}'
```

**Products qua Gateway:**
```bash
curl -X GET http://localhost:3003/products/api/products \
  -H "Authorization: Bearer $TOKEN"
```

## Chạy Tất Cả Tests

### Từ thư mục gốc:
```bash
npm test
```

Lệnh này sẽ chạy tất cả file test trong project:
- `auth/src/test/authController.test.js`
- `product/src/test/product.test.js`

## Test Flow Hoàn Chỉnh

### Scenario: Tạo user, đăng nhập, tạo product

```bash
# 1. Đăng ký user
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"fulltest","password":"pass123"}'

# 2. Đăng nhập và lấy token
TOKEN=$(curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"fulltest","password":"pass123"}' | jq -r '.token')

echo "Token: $TOKEN"

# 3. Tạo sản phẩm với token
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "MacBook Pro",
    "price": 2500,
    "description": "Latest MacBook Pro"
  }'

# 4. Lấy danh sách sản phẩm
curl -X GET http://localhost:3001/api/products \
  -H "Authorization: Bearer $TOKEN"
```

## Kiểm Tra Kết Quả Test

### Test thành công khi:
- ✓ Tất cả test cases pass (màu xanh)
- ✓ Không có error logs
- ✓ MongoDB có data tương ứng
- ✓ RabbitMQ queue hoạt động

### Kiểm tra MongoDB:
```bash
# Kết nối MongoDB
mongosh

# Kiểm tra databases
show dbs

# Kiểm tra collections
use auth
show collections
db.users.find()

use products
show collections
db.products.find()

use orders
show collections
db.orders.find()
```

### Kiểm tra RabbitMQ:
```bash
# Xem queues
rabbitmqadmin list queues

# Hoặc truy cập web interface
# http://localhost:15672 (guest/guest)
```

## Các Lỗi Thường Gặp và Cách Xử Lý

### 1. Test timeout
```
Error: Timeout of 20000ms exceeded
```
**Giải pháp:**
- Kiểm tra MongoDB và RabbitMQ đã chạy
- Tăng timeout trong test config

### 2. Connection refused
```
Error: connect ECONNREFUSED 127.0.0.1:3000
```
**Giải pháp:**
- Đảm bảo service đang chạy
- Kiểm tra port không bị chiếm

### 3. Authentication failed
```
Error: Invalid token
```
**Giải pháp:**
- Tạo user test trước
- Lấy token mới từ /login

### 4. MongoDB connection error
```
Error: MongoServerError
```
**Giải pháp:**
- Khởi động MongoDB: `mongod`
- Kiểm tra MONGODB_URI trong .env

### 5. RabbitMQ connection error
```
Error: Failed to connect to RabbitMQ
```
**Giải pháp:**
- Khởi động RabbitMQ: `rabbitmq-server`
- Kiểm tra RABBITMQ_URI trong .env

## Best Practices

1. **Chạy services theo thứ tự:**
   - MongoDB → RabbitMQ → Auth → Product → Order → API Gateway

2. **Clean data sau mỗi test:**
   - Xóa test users trong MongoDB sau khi test xong

3. **Sử dụng environment riêng cho test:**
   - Tạo database test riêng
   - Không test trên production data

4. **Chạy test isolated:**
   - Mỗi test case độc lập
   - Cleanup sau mỗi test

5. **Monitor logs:**
   - Theo dõi console logs của mỗi service
   - Check MongoDB và RabbitMQ logs
