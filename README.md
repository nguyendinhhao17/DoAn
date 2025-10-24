# E-Commerce Microservices Project

Dự án hệ thống Microservices cho E-Commerce với Auth, Product và Order services.

## Kiến Trúc Hệ Thống

### 1. Hệ thống giải quyết vấn đề gì?
Hệ thống quản lý người dùng, sản phẩm và đơn hàng theo kiến trúc microservices, cho phép mở rộng và bảo trì dễ dàng.

### 2. Hệ thống có bao nhiêu dịch vụ?
- **Auth Service** (Port 3000): Xác thực và quản lý người dùng
- **Product Service** (Port 3001): Quản lý sản phẩm
- **Order Service** (Port 3002): Quản lý đơn hàng
- **API Gateway** (Port 3003): Điều hướng requests đến các services

### 3. Ý nghĩa từng dịch vụ

**Auth Service:**
- Đăng ký người dùng mới
- Đăng nhập và tạo JWT token
- Xác thực người dùng

**Product Service:**
- Tạo sản phẩm mới
- Xem danh sách sản phẩm
- Xem chi tiết sản phẩm theo ID
- Tạo đơn hàng (mua sản phẩm)

**Order Service:**
- Xem danh sách đơn hàng
- Xem chi tiết đơn hàng theo ID

**API Gateway:**
- Route requests từ client đến các services tương ứng
- Đơn giản hóa việc gọi API

### 4. Các mẫu thiết kế được sử dụng

- **Microservices Pattern**: Chia hệ thống thành các services độc lập
- **API Gateway Pattern**: Centralized entry point cho tất cả requests
- **Repository Pattern**: Tách biệt logic truy cập dữ liệu
- **Service Layer Pattern**: Tách biệt business logic
- **JWT Authentication**: Xác thực stateless với token

### 5. Các dịch vụ giao tiếp như thế nào?

- **Client → API Gateway**: HTTP/REST API
- **API Gateway → Services**: HTTP Proxy
- **Services → Database**: Supabase PostgreSQL (thay vì MongoDB)
- **Authentication**: JWT token trong Authorization header

## Công Nghệ Sử Dụng

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **API Testing**: Postman

## Yêu Cầu Hệ Thống

- Node.js (v14 trở lên)
- npm
- Supabase account (đã được cấu hình sẵn)

## Cài Đặt

### 1. Clone repository và cài đặt dependencies

```bash
# Cài đặt dependencies gốc
npm install

# Cài đặt cho từng service
cd auth && npm install && cd ..
cd product && npm install && cd ..
cd order && npm install && cd ..
cd api-gateway && npm install && cd ..
```

### 2. Kiểm tra file .env

Mỗi service đã có file `.env` với cấu hình Supabase:
- `auth/.env`
- `product/.env`
- `order/.env`

## Chạy Dự Án

### Chạy từng service (Khuyến nghị - mở 4 terminal):

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

Sau khi chạy thành công, bạn sẽ thấy:
- Auth Service: `Server started on port 3000`
- Product Service: `Product Service started on port 3001`
- Order Service: `Order Service started on port 3002`
- API Gateway: `API Gateway listening on port 3003`

## Test với POSTMAN

### 1. Đăng ký người dùng (Register)

```
POST http://localhost:3000/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "uuid",
  "username": "testuser",
  "created_at": "timestamp"
}
```

### 2. Đăng nhập (Login)

```
POST http://localhost:3000/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Lưu lại token này để sử dụng cho các requests tiếp theo!**

### 3. Tạo sản phẩm mới

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

**Response:**
```json
{
  "id": "uuid",
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone model",
  "price": 999,
  "created_at": "timestamp"
}
```

### 4. Xem danh sách sản phẩm

```
GET http://localhost:3001/api/products
Authorization: Bearer YOUR_TOKEN_HERE
```

### 5. Xem sản phẩm theo ID (MỤC 8 - Endpoint mới)

```
GET http://localhost:3001/api/products/{product_id}
Authorization: Bearer YOUR_TOKEN_HERE
```

**Ví dụ:**
```
GET http://localhost:3001/api/products/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer YOUR_TOKEN_HERE
```

### 6. Tạo đơn hàng (Buy)

```
POST http://localhost:3001/api/products/buy
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "ids": ["product_id_1", "product_id_2"]
}
```

**Response:**
```json
{
  "id": "order_uuid",
  "user_id": "user_uuid",
  "username": "testuser",
  "products": [...],
  "total_price": 1998,
  "status": "completed",
  "created_at": "timestamp"
}
```

### 7. Xem danh sách đơn hàng

```
GET http://localhost:3002/api/orders
```

### Test qua API Gateway (Port 3003)

Tất cả các endpoints trên cũng có thể truy cập qua API Gateway:

```
POST http://localhost:3003/auth/register
POST http://localhost:3003/auth/login
GET  http://localhost:3003/products/api/products
POST http://localhost:3003/products/api/products
GET  http://localhost:3003/products/api/products/{id}
POST http://localhost:3003/products/api/products/buy
GET  http://localhost:3003/orders/api/orders
```

## Code Mục 8: Thêm Endpoint GET Product By ID

Đây là code cần viết trong vòng 2 phút theo yêu cầu sát hạch:

### File: product/src/controllers/productController.js

Thêm method:
```javascript
async getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await this.productsService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
```

### File: product/src/routes/productRoutes.js

Thêm route:
```javascript
router.get("/:id", isAuthenticated, productController.getProductById.bind(productController));
```

## Cấu Trúc Thư Mục

```
project/
├── auth/                   # Auth Service
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.js
│   │   │   └── supabase.js
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   └── services/
│   ├── .env
│   ├── index.js
│   └── package.json
├── product/                # Product Service
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.js
│   │   │   └── supabase.js
│   │   ├── controllers/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── .env
│   ├── index.js
│   └── package.json
├── order/                  # Order Service
│   ├── src/
│   │   ├── config/
│   │   │   ├── config.js
│   │   │   └── supabase.js
│   │   └── app.js
│   ├── .env
│   ├── index.js
│   └── package.json
├── api-gateway/            # API Gateway
│   ├── index.js
│   └── package.json
└── README.md
```

## Troubleshooting

### Lỗi "Unauthorized"
- Kiểm tra token đã được lấy từ /login
- Đảm bảo header Authorization: Bearer {token}

### Lỗi "Product not found"
- Kiểm tra ID sản phẩm có tồn tại
- Tạo sản phẩm mới trước khi query

### Port đã được sử dụng
```bash
# Tìm process đang dùng port
lsof -i :3000  # thay 3000 bằng port cần check

# Kill process
kill -9 <PID>
```

## CI/CD với GitHub Actions và Docker

Dự án hỗ trợ CI/CD với GitHub Actions (Mục 9-10 trong phiếu sát hạch).

File `.github/workflows/docker-ci.yml` đã được tạo sẵn để:
1. Build Docker images cho tất cả services
2. Test với Docker Compose
3. Verify tất cả services hoạt động

### Setup GitHub Secrets:

Vào Settings > Secrets and variables > Actions, thêm:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Mỗi lần push code lên GitHub, workflow sẽ tự động:
1. Build Docker images
2. Start services với Docker Compose
3. Kiểm tra logs
4. Stop services

## Ưu Điểm So Với Bản Cũ

✅ **Không cần MongoDB** - Dùng Supabase có sẵn
✅ **Không cần RabbitMQ** - Đơn giản hóa communication
✅ **Hỗ trợ Docker** - Chạy dễ dàng trên Windows
✅ **Có endpoint GET /api/products/:id** - Đáp ứng mục 8
✅ **CI/CD với Docker** - GitHub Actions tích hợp Docker
✅ **Chạy được ngay** - Không cần cài đặt phức tạp

## Tài Liệu Bổ Sung

- [DOCKER-GUIDE.md](./DOCKER-GUIDE.md) - Hướng dẫn chi tiết chạy với Docker trên Windows
- [SETUP-GUIDE.md](./SETUP-GUIDE.md) - Hướng dẫn setup thông thường
- [TEST-GUIDE.md](./TEST-GUIDE.md) - Hướng dẫn test với POSTMAN

## Tác Giả

Dự án microservices cho môn học Enterprise Application Development
