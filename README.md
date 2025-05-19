# Greenplum Sizer

A web-based Single Page Application (SPA) for configuring Greenplum storage parameters. Users input various parameters and receive calculated storage configuration outputs.

![Greenplum](https://img.shields.io/badge/Greenplum-Storage_Sizer-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)

## Features

- Calculate optimal Greenplum configurations based on storage requirements
- Adjust parameters based on expected load levels (low, medium, high)
- Visual presentation of configuration results
- Containerized backend for easy deployment

## Project Structure

- `/backend` - FastAPI backend for calculations
- `/frontend` - React TypeScript frontend application with Material UI
- `/memory-bank` - Project documentation and planning

## Requirements

- Docker and Docker Compose for the backend
- Node.js (v18+) and npm for the frontend

## Running the Application

### Using Docker (Recommended)

The easiest way to run the entire application is with Docker Compose:

```bash
# In the root directory of the project
docker-compose up
```

This will start both the frontend and backend containers. The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8001

### Manual Setup

#### Backend

```bash
cd backend
docker-compose up
```

The backend API will be available at http://localhost:8001

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will start at http://localhost:5173 (or another available port)

## Deployment to Virtual Server

The application can be deployed to a virtual server in the cloud using the provided deployment script:

```bash
# Make the script executable if needed
chmod +x scripts/deploy.sh

# Deploy to server (replace with your server IP)
scripts/deploy.sh your_server_ip username ssh_port
```

The script will:
1. Create required directories on the server
2. Copy all necessary files
3. Install Docker and Docker Compose if not present
4. Build and run the containers
5. Verify the application is running

After deployment, the application will be available at:
- Frontend: http://your_server_ip
- Backend API: http://your_server_ip:8001

To stop the application on the server:

```bash
ssh username@your_server_ip 'cd /opt/greenplum-sizer && docker-compose down'
```

## Architecture

```
+----------------+     HTTP     +----------------+
|                | <----------> |                |
|  React Frontend|     API      | FastAPI Backend |
|  (TypeScript)  |              | (Python)       |
+----------------+              +----------------+
```

## API Endpoints

- `POST /calculate` - Calculate storage parameters based on input

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

# Калькулятор конфигурации Greenplum

Веб-приложение (SPA) для настройки параметров хранилища Greenplum. Пользователи вводят различные параметры и получают рассчитанные конфигурации хранилища.

![Greenplum](https://img.shields.io/badge/Greenplum-Storage_Sizer-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)

## Возможности

- Расчет оптимальных конфигураций Greenplum на основе требований к хранилищу
- Настройка параметров в зависимости от ожидаемого уровня нагрузки (низкий, средний, высокий)
- Визуальное представление результатов конфигурации
- Контейнеризованный бэкенд для простоты развертывания

## Структура проекта

- `/backend` - Бэкенд на FastAPI для расчетов
- `/frontend` - Фронтенд приложение на React TypeScript с Material UI
- `/memory-bank` - Документация и планирование проекта

## Требования

- Docker и Docker Compose для бэкенда
- Node.js (v18+) и npm для фронтенда

## Запуск приложения

### Использование Docker (Рекомендуется)

Самый простой способ запустить всё приложение - с помощью Docker Compose:

```bash
# В корневой директории проекта
docker-compose up
```

Это запустит контейнеры фронтенда и бэкенда. Приложение будет доступно по адресам:
- Фронтенд: http://localhost
- API бэкенда: http://localhost:8001

### Ручная настройка

#### Бэкенд

```bash
cd backend
docker-compose up
```

API бэкенда будет доступно по адресу http://localhost:8001

#### Фронтенд

```bash
cd frontend
npm install
npm run dev
```

Сервер разработки фронтенда запустится по адресу http://localhost:5173 (или на другом доступном порту)

## Развертывание на виртуальном сервере

Приложение может быть развернуто на виртуальном сервере в облаке с помощью предоставленного скрипта развертывания:

```bash
# Сделать скрипт исполняемым при необходимости
chmod +x scripts/deploy.sh

# Деплой на сервер (замените на IP вашего сервера)
scripts/deploy.sh ip_вашего_сервера имя_пользователя ssh_порт
```

Скрипт выполнит следующие действия:
1. Создаст необходимые директории на сервере
2. Скопирует все необходимые файлы
3. Установит Docker и Docker Compose, если они отсутствуют
4. Соберет и запустит контейнеры
5. Проверит работу приложения

После развертывания приложение будет доступно по адресам:
- Фронтенд: http://ip_вашего_сервера
- API бэкенда: http://ip_вашего_сервера:8001

Для остановки приложения на сервере:

```bash
ssh имя_пользователя@ip_вашего_сервера 'cd /opt/greenplum-sizer && docker-compose down'
```

## Архитектура

```
+----------------+     HTTP     +----------------+
|                | <----------> |                |
|  React Frontend|     API      | FastAPI Backend |
|  (TypeScript)  |              | (Python)       |
+----------------+              +----------------+
```

## API Endpoints

- `POST /calculate` - Рассчитать параметры хранилища на основе входных данных

## Участие в разработке

1. Сделайте форк репозитория
2. Создайте ветку для новой функциональности (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add some amazing feature'`)
4. Отправьте изменения в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## Лицензия

Этот проект лицензирован под лицензией MIT - подробности см. в файле [LICENSE](LICENSE).
