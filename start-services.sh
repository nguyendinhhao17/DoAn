#!/bin/bash

echo "Starting microservices..."

cd auth && node index.js &
AUTH_PID=$!

cd ../product && node index.js &
PRODUCT_PID=$!

cd ../order && node index.js &
ORDER_PID=$!

cd ../api-gateway && node index.js &
GATEWAY_PID=$!

echo "All services started!"
echo "Auth Service PID: $AUTH_PID"
echo "Product Service PID: $PRODUCT_PID"
echo "Order Service PID: $ORDER_PID"
echo "API Gateway PID: $GATEWAY_PID"

wait
