[exercise page](https://github.com/avito-tech/tech-internship/blob/main/Tech%20Internships/Frontend/Frontend-trainee-assignment-autumn-2024/Frontend-trainee-assignment-autumn-2024.md)

## Installation

Перед запуском любой среды необходимо установить дополнения:

```
npm install
```

## Start client (PORT 3000)

```
npm start
```

## Start json-server (PORT 8000)

```
npm run server
```

## Start upload server (PORT 8001)

Этот сервер нужен чтобы вы могли загрузить собсвенную фотографию на json-server

```
ts-node server.ts
```

или

```
tsc
node ./dist/server.js
```

## Testing

```
npm test
```

Клиент написан на React Typescript, с использованием axios, для тестов использовался jest, библиотека компонентов: material UI.

В качестве сервера используется json-server

Для загрузки картинок используется отдельный сервер.
Старые фото не удаляются!
