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

### Backend

```bash
cd backend
docker-compose up
```

The backend API will be available at http://localhost:8001

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will start at http://localhost:5173 (or another available port)

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

### Бэкенд

```bash
cd backend
docker-compose up
```

API бэкенда будет доступно по адресу http://localhost:8001

### Фронтенд

```bash
cd frontend
npm install
npm run dev
```

Сервер разработки фронтенда запустится по адресу http://localhost:5173 (или на другом доступном порту)

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
