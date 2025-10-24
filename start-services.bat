@echo off
echo Starting microservices...

start "Auth Service" cmd /k "cd auth && node index.js"
start "Product Service" cmd /k "cd product && node index.js"
start "Order Service" cmd /k "cd order && node index.js"
start "API Gateway" cmd /k "cd api-gateway && node index.js"

echo All services started in separate windows!
echo Close each window to stop the corresponding service.
pause
