@echo off
echo Installing dependencies for all services...

echo Installing root dependencies...
call npm install

echo Installing Auth service dependencies...
cd auth
call npm install
cd ..

echo Installing Product service dependencies...
cd product
call npm install
cd ..

echo Installing Order service dependencies...
cd order
call npm install
cd ..

echo Installing API Gateway dependencies...
cd api-gateway
call npm install
cd ..

echo All dependencies installed!
pause
