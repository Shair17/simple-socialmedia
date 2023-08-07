# Projecto Phosial

Este es el proyecto final de estrategías algoritmicas, consta de un cliente y un servidor

## Demo Link

https://socialmediademo.vercel.app/

## Preview Demo

![screenshot](https://raw.githubusercontent.com/Shair17/simple-socialmedia/main/screenshot.png)

## Requisitos

Para poder ejecutar el proyecto son necesarios los siguientes programas:

- **NodeJS - [nodejs](https://nodejs.org/en/)** (_entorno de ejecución de Javascript_)
- **PostgreSQL - [postgresql](https://www.postgresql.org/download/)** (_Base de Datos_)

## Instalación

Para instalar los módulos necesarios en las dos carpetas primero hay que ingresar a las carpetas respectivamente con `cd client` para el cliente y `cd server` para el servidor.

### Cliente

Una vez dentro del cliente ejecutar el siguiente comando para instalar las dependencias

```sh
npm install
```

### Servidor

Una vez dentro del servidor ejecutar el siguiente comando para instalar las dependencias

```sh
npm install
```

## Configuración de variables de entorno

Para poder ejecutar todo correctamente se deben configurar ciertas variables de entorno, las cuales son necesarias para el correcto funcionamiento de toda la aplicación.

### Cliente

Para el cliente modificar el archivo `api.ts` dentro de la carpeta `/client/src/constants`. Modificar el puerto de la constante `BASE_URL`, si no se ha modificado el puerto en el servidor, entonces dejarlo tal y como está.

### Servidor

Dentro de la carpeta `/server` se encuentra un archivo `.env.example` el cual se debe renombrar a `.env` y seguir las instrucciones que están en los comentarios del mismo archivo.

## Ejecución en Modo Desarrollo

### Cliente

Una vez dentro del cliente ejecutar el siguiente comando para ejecutar el cliente

```sh
npm run dev
```

### Servidor

Una vez dentro del servidor ejecutar el siguiente comando para ejecutar el servidor

```sh
npm run dev
```

## Ejecución en Producción

Una vez dentro del cliente ejecutar el siguiente comando para ejecutar el cliente

```sh
npm run build && npm run preview
```

### Servidor

Una vez dentro del servidor ejecutar el siguiente comando para ejecutar el servidor

```sh
npm run build && npm run start
```

## Ayuda

Si tienes alguna duda o error, no dudes en abrir una [issue](https://github.com/Shair17/eaproject/issues)
