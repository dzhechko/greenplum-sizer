#!/bin/bash

# Получаем IP-адрес сервера
SERVER_IP=$(hostname -I | awk '{print $1}')
if [ -z "$SERVER_IP" ]; then
    SERVER_IP="localhost"
fi

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "Docker не установлен. Пожалуйста, установите Docker."
    exit 1
fi

# Проверка наличия Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose не установлен. Пожалуйста, установите Docker Compose."
    exit 1
fi

echo "Запуск сборки и запуска контейнеров..."
docker-compose build

echo "Запуск приложения..."
docker-compose up -d

echo "Проверка доступности frontend (http://$SERVER_IP)..."
curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP || {
    echo "Не удалось подключиться к frontend. Проверьте логи: docker-compose logs frontend"
}

echo "Проверка доступности backend (http://$SERVER_IP:8001)..."
curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:8001 || {
    echo "Не удалось подключиться к backend. Проверьте логи: docker-compose logs backend"
}

echo ""
echo "Тесты завершены. Приложение запущено."
echo "Frontend: http://$SERVER_IP"
echo "Backend API: http://$SERVER_IP:8001"
echo ""
echo "Для остановки используйте: docker-compose down"

# Проверка открытых портов
echo ""
echo "Проверка открытых портов:"
if command -v ss &> /dev/null; then
    ss -tuln | grep -E ':(80|8001)'
elif command -v netstat &> /dev/null; then
    netstat -tuln | grep -E ':(80|8001)'
else
    echo "Не удалось проверить открытые порты. Утилиты ss и netstat не найдены."
fi 