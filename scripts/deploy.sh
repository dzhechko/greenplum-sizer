#!/bin/bash

# Скрипт для развертывания приложения на виртуальном сервере

# Настройки сервера
SERVER_IP=${1:-"your_server_ip"}  # Можно передать IP сервера как аргумент, иначе используется значение по умолчанию
SERVER_USER=${2:-"root"}          # Пользователь для SSH-подключения
SERVER_PORT=${3:-"22"}            # SSH-порт
DEPLOY_DIR="/opt/greenplum-sizer"  # Директория на сервере для деплоя

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Проверка наличия необходимых утилит
if ! command -v ssh &> /dev/null; then
    echo -e "${RED}Ошибка: утилита ssh не найдена${NC}"
    exit 1
fi

if ! command -v scp &> /dev/null; then
    echo -e "${RED}Ошибка: утилита scp не найдена${NC}"
    exit 1
fi

echo -e "${YELLOW}Начинаем деплой приложения на сервер $SERVER_IP...${NC}"

# Подготовка директории на сервере
echo -e "${YELLOW}Подготовка директории на сервере...${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "mkdir -p $DEPLOY_DIR" || {
    echo -e "${RED}Не удалось создать директорию на сервере${NC}"
    exit 1
}

# Копирование файлов на сервер
echo -e "${YELLOW}Копирование файлов на сервер...${NC}"
scp -P $SERVER_PORT -r docker-compose.yml frontend backend $SERVER_USER@$SERVER_IP:$DEPLOY_DIR || {
    echo -e "${RED}Не удалось скопировать файлы на сервер${NC}"
    exit 1
}

# Установка Docker и Docker Compose на сервере (если необходимо)
echo -e "${YELLOW}Проверка наличия Docker и Docker Compose на сервере...${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "command -v docker >/dev/null 2>&1 || { 
    echo 'Docker не установлен. Устанавливаем Docker...'; 
    curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh && 
    systemctl enable docker && systemctl start docker; 
}" || {
    echo -e "${RED}Не удалось установить Docker на сервере${NC}"
    exit 1
}

ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "command -v docker-compose >/dev/null 2>&1 || { 
    echo 'Docker Compose не установлен. Устанавливаем Docker Compose...'; 
    curl -L \"https://github.com/docker/compose/releases/download/v2.15.0/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose && 
    chmod +x /usr/local/bin/docker-compose; 
}" || {
    echo -e "${RED}Не удалось установить Docker Compose на сервере${NC}"
    exit 1
}

# Запуск приложения на сервере
echo -e "${YELLOW}Запуск приложения на сервере...${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd $DEPLOY_DIR && docker-compose down && docker-compose up -d" || {
    echo -e "${RED}Не удалось запустить приложение на сервере${NC}"
    exit 1
}

# Проверка доступности приложения
echo -e "${YELLOW}Проверка доступности приложения...${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "curl -s -o /dev/null -w '%{http_code}' http://localhost" > /dev/null && {
    echo -e "${GREEN}Фронтенд успешно запущен и доступен по адресу http://$SERVER_IP${NC}"
} || {
    echo -e "${RED}Не удалось проверить доступность фронтенда${NC}"
}

ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "curl -s -o /dev/null -w '%{http_code}' http://localhost:8001" > /dev/null && {
    echo -e "${GREEN}Бэкенд успешно запущен и доступен по адресу http://$SERVER_IP:8001${NC}"
} || {
    echo -e "${RED}Не удалось проверить доступность бэкенда${NC}"
}

echo -e "${GREEN}Деплой завершен!${NC}"
echo -e "${GREEN}Фронтенд: http://$SERVER_IP${NC}"
echo -e "${GREEN}API бэкенда: http://$SERVER_IP:8001${NC}"

# Вывод журналов запущенных контейнеров
echo -e "${YELLOW}Вывод последних логов контейнеров:${NC}"
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd $DEPLOY_DIR && docker-compose logs --tail=20"

echo -e "${GREEN}Для остановки приложения выполните: ssh $SERVER_USER@$SERVER_IP 'cd $DEPLOY_DIR && docker-compose down'${NC}" 