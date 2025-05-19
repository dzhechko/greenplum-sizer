# Greenplum Sizer MCP Server

MCP-сервер для расчета параметров хранилища Greenplum на основе размера данных и уровня нагрузки.

## Обзор

Сервер предоставляет инструмент `calculate_storage`, который принимает два параметра:
- `size_tb` - размер хранилища в ТБ (несжатые данные)
- `load_level` - уровень нагрузки (низкая, средняя, высокая)

и возвращает рекомендуемую конфигурацию хранилища Greenplum.

## Запуск сервера

### Через Docker

```bash
# Сборка образа
docker build -t greenplum-sizer-mcp .

# Запуск контейнера
docker run -p 8002:8000 greenplum-sizer-mcp
```

### Через docker-compose

```bash
docker-compose up
```

### В основном проекте

```bash
# Из корневого каталога проекта
npm run mcp-server

# Запуск всего приложения (бэкенд, фронтенд и MCP-сервер)
npm run dev-mcp
```

## Дистанционный доступ к MCP серверу

MCP-сервер можно разместить в облаке и обращаться к нему удаленно, локальная установка не обязательна. Варианты размещения:

### Вариант 1: Развертывание в облаке

MCP-сервер можно развернуть в любом облачном провайдере (AWS, Google Cloud, Azure и т.д.) как контейнер, указав необходимые настройки сети для внешнего доступа:

```bash
# Пример запуска с разрешением внешних подключений
docker run -p 0.0.0.0:8000:8000 greenplum-sizer-mcp
```

### Вариант 2: Подключение к существующему серверу

Для подключения к уже работающему облачному MCP-серверу:

1. В настройках Cursor укажите URL удаленного сервера:
   - Имя: Greenplum Sizer MCP (Cloud)
   - Команда: curl
   - Аргументы: ["https://your-mcp-server-address.com/mcp"]

   Или напрямую через URL:
   - URL: https://your-mcp-server-address.com/mcp

2. В Python-клиенте:
```python
async with Client("https://your-mcp-server-address.com/mcp") as client:
    # Используйте клиент как обычно
    ...
```

### Безопасность удаленного доступа

При публикации MCP-сервера в облаке рекомендуется:
- Настроить HTTPS для безопасной передачи данных
- Добавить аутентификацию через заголовки HTTP
- Ограничить доступ по IP-адресам, если возможно

## Подключение к серверу из Cursor

1. Добавьте MCP-сервер в конфигурацию Cursor:
   - Откройте настройки Cursor
   - Перейдите в раздел MCP серверов
   - Добавьте новый MCP-сервер со следующими параметрами:
     - Имя: Greenplum Sizer MCP
     - Команда: docker
     - Аргументы: ["run", "--rm", "-p", "8002:8000", "greenplum-sizer-mcp"]

2. Перезапустите Cursor для применения изменений.

3. Выберите "Greenplum Sizer MCP" из списка доступных MCP-серверов в интерфейсе Cursor.

## Использование инструмента calculate_storage

### В Cursor

После подключения к MCP-серверу вы можете использовать инструмент, указав параметры:

```
@Greenplum Sizer MCP calculate_storage size_tb=100 load_level=средняя
```

Или воспользуйтесь автозаполнением в интерфейсе Cursor.

### Через Python-клиент

```python
import asyncio
from fastmcp import Client

async def main():
    async with Client("http://localhost:8002/mcp") as client:
        # Получение списка доступных инструментов
        tools = await client.list_tools()
        print(f"Available tools: {[tool.name for tool in tools]}")
        
        # Вызов инструмента calculate_storage
        result = await client.call_tool(
            "calculate_storage", 
            {"size_tb": 100, "load_level": "средняя"}
        )
        print("\nCalculation result:")
        print(result[0].text)

if __name__ == "__main__":
    asyncio.run(main())
```

## Параметры

### Входные параметры

| Параметр | Тип | Описание | Допустимые значения |
|----------|-----|----------|-------------------|
| size_tb | float | Размер хранилища в ТБ (несжатые данные) | > 0 |
| load_level | string | Уровень нагрузки | "низкая", "средняя", "высокая" |

### Выходные параметры

| Параметр | Тип | Описание |
|----------|-----|----------|
| host_type | string | Тип хоста |
| host_count | integer | Количество хостов |
| segments_per_host | integer | Количество сегментов на хост |
| total_vcpu | integer | Общее количество vCPU |
| total_segments | integer | Общее количество сегментов |
| disks_per_host_tb | float | Размер дисков на хост в ТБ |
| disk_type | string | Тип дисков |
| master_recommendation | string | Рекомендации для мастер-сервера |

## Пример ответа

```json
{
  "host_type": "VM оптимизированная (16 vCPU, 64GB RAM)",
  "host_count": 13,
  "segments_per_host": 4,
  "total_vcpu": 104,
  "total_segments": 52,
  "disks_per_host_tb": 7.69,
  "disk_type": "SSD",
  "master_recommendation": "VM мастера: 4 vCPU, 16GB RAM"
}
``` 