# NestJS Todo App

This is a simple Todo application built using NestJS framework.

## Installation

1. Clone this repository:

```bash
git clone git@github.com:vnkduy/nest-todo-v2.git
```

2. Navigate into the project directory:

```bash
cd nestjs-todo-v2
```

3. Install dependencies:

```bash
pnpm i
```

## Usage

1. Prepare docker and docker postgres:

[Docker postgres](https://hub.docker.com/_/postgres)

2. Starts the container:

```bash
docker compose up -d
```

3. Generate prisma client

```bash
pnpm prisma:generate
```

4. Generate and apply migrations

```bash
pnpm migrate:dev
```

5. Start app in http://localhost:3000

```bash
pnpm start:dev
```

## API Endpoints

1. Get all todos

```bash
curl --location 'http://localhost:3000/todos'
```

2. Get todo by ID

```bash
curl --location 'http://localhost:3000/todos/todoId'
```

3. Create a todo

```bash
curl --location 'http://localhost:3000/todos' \
--header 'Content-Type: application/json' \
--data '{
    "title":"todo test"
}'
```

4. Update a todo by Id

```bash
curl --location --request PATCH 'http://localhost:3000/todos/todoId' \
--header 'Content-Type: application/json' \
--data '{
    "title": "todo test",
    "completed" : true
}'
```

5. Delete a todo by ID

```bash
curl --location --request DELETE 'http://localhost:3000/todos/todoId'
```
