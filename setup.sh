#!/bin/bash

echo "Installing dependencies for all services..."

echo "Installing root dependencies..."
npm install

echo "Installing Auth service dependencies..."
cd auth && npm install && cd ..

echo "Installing Product service dependencies..."
cd product && npm install && cd ..

echo "Installing Order service dependencies..."
cd order && npm install && cd ..

echo "Installing API Gateway dependencies..."
cd api-gateway && npm install && cd ..

echo "All dependencies installed!"
