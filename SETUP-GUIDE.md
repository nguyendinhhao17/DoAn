# Hướng Dẫn Cài Đặt và Chạy Dự Án Microservices

## Yêu Cầu Hệ Thống

- Node.js (v14 trở lên)
- MongoDB
- RabbitMQ (cho message broker)
- npm hoặc yarn

## Cấu Trúc Dự Án

Dự án bao gồm 4 services:
- **auth**: Service xác thực người dùng (port 3000)
- **product**: Service quản lý sản phẩm (port 3001)
- **order**: Service quản lý đơn hàng (port 3002)
- **api-gateway**: API Gateway (port 3003)

## Bước 1: Cài Đặt Dependencies

### Cách 1: Sử dụng script tự động
```bash
npm run setup
```

### Cách 2: Cài đặt từng service
```bash
# Cài đặt dependencies gốc
npm install

# Cài đặt từng service
cd auth && npm install && cd ..
cd product && npm install && cd ..
cd order && npm install && cd ..
cd api-gateway && npm install && cd ..
```

## Bước 2: Cấu Hình Environment Variables

### Auth Service (.env)
File: `auth/.env`
```
MONGODB_AUTH_URI=mongodb://localhost:27017/auth
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

### Product Service (.env)
File: `product/.env`
```
MONGODB_PRODUCT_URI=mongodb://localhost:27017/products
RABBITMQ_URI=amqp://localhost:5672
PORT=3001
LOGIN_TEST_USER=testuser
LOGIN_TEST_PASSWORD=password
```

### Order Service (.env)
File: `order/.env`
```
MONGODB_ORDER_URI=mongodb://localhost:27017/orders
RABBITMQ_URI=amqp://localhost:5672
PORT=3002
```

## Bước 3: Khởi Động MongoDB và RabbitMQ

### MongoDB
```bash
# Khởi động MongoDB
mongod
```

### RabbitMQ
```bash
# Khởi động RabbitMQ (nếu đã cài đặt)
rabbitmq-server
```

**Lưu ý**: Nếu chưa cài MongoDB và RabbitMQ:
- MongoDB: https://www.mongodb.com/docs/manual/installation/
- RabbitMQ: https://www.rabbitmq.com/download.html

## Bước 4: Khởi Động Services

### Cách 1: Chạy từng service riêng lẻ (khuyến nghị để debug)

Mở 4 terminal riêng:

**Terminal 1 - Auth Service:**
```bash
cd auth
node index.js
```

**Terminal 2 - Product Service:**
```bash
cd product
node index.js
```

**Terminal 3 - Order Service:**
```bash
cd order
node index.js
```

**Terminal 4 - API Gateway:**
```bash
cd api-gateway
node index.js
```

### Cách 2: Sử dụng script tự động (chạy background)
```bash
npm run start:all
```

## Bước 5: Kiểm Tra Services Đang Chạy

Sau khi khởi động, bạn sẽ thấy các thông báo:
- Auth Service: `Server started on port 3000`
- Product Service: `Server started on port 3001`
- Order Service: `Server started on port 3002`
- API Gateway: `API Gateway listening on port 3003`

## Endpoints API

### Auth Service (port 3000)
- `POST /register` - Đăng ký người dùng mới
  ```json
  {
    "username": "testuser",
    "password": "password"
  }
  ```

- `POST /login` - Đăng nhập
  ```json
  {
    "username": "testuser",
    "password": "password"
  }
  ```

- `GET /dashboard` - Truy cập dashboard (cần token)
  Header: `Authorization: Bearer <token>`

### Product Service (port 3001)
- `POST /api/products` - Tạo sản phẩm mới (cần authentication)
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm

### Order Service (port 3002)
Service này consumer messages từ RabbitMQ queue

### API Gateway (port 3003)
- `/auth/*` - Route đến Auth Service
- `/products/*` - Route đến Product Service
- `/orders/*` - Route đến Order Service

## Testing

### Chạy tất cả tests
```bash
npm test
```

### Chạy test cho Auth Service
```bash
npm run test:auth
```

### Chạy test cho Product Service
```bash
npm run test:product
```

### Chạy test riêng lẻ
```bash
# Auth Service
cd auth
npm test

# Product Service
cd product
npm test
```

## Lưu Ý Quan Trọng

1. **MongoDB và RabbitMQ phải chạy trước** khi khởi động các services
2. **Auth Service phải chạy trước** khi test Product Service (vì Product test cần token từ Auth)
3. Để test Product Service, cần tạo user test trước:
   ```bash
   # Đăng ký user test
   curl -X POST http://localhost:3000/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"password"}'
   ```

## Troubleshooting

### Lỗi kết nối MongoDB
- Kiểm tra MongoDB đã chạy: `ps aux | grep mongod`
- Kiểm tra connection string trong file .env

### Lỗi kết nối RabbitMQ
- Kiểm tra RabbitMQ đã chạy: `rabbitmqctl status`
- Kiểm tra RABBITMQ_URI trong file .env

### Port đã được sử dụng
```bash
# Tìm process đang dùng port
lsof -i :3000  # thay 3000 bằng port cần check

# Kill process
kill -9 <PID>
```

### Test thất bại
- Đảm bảo tất cả services đang chạy
- Kiểm tra MongoDB và RabbitMQ hoạt động
- Tạo user test trước khi chạy Product test
