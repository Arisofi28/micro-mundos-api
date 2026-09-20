# Micro-Mundos Creativos API

API REST desarrollada con Node.js, Express y TypeScript para administrar una colección de mundos ficticios.

El proyecto corresponde al Entregable 2 de Desarrollo Web y transforma el concepto creativo del proyecto anterior en un backend organizado por capas.

La API permite crear, consultar, actualizar y eliminar micro-mundos sin utilizar todavía una base de datos. Los datos se almacenan temporalmente en memoria mediante un arreglo tipado de TypeScript.

---

## Objetivo del proyecto

El objetivo principal es demostrar la construcción de una API REST utilizando:

- Node.js como runtime.
- Express como framework HTTP.
- TypeScript para modelado y seguridad de tipos.
- Arquitectura separada en routes, controllers, services y models.
- Middleware personalizado.
- Validación de datos.
- Manejo centralizado de errores.
- CRUD completo.
- Códigos HTTP apropiados.
- Pruebas manuales documentadas.
- Flujo de trabajo con Git, ramas y Pull Requests.

---

## Premisa creativa

Micro-Mundos Creativos funciona como un archivo digital de universos imaginarios.

Cada mundo tiene un nombre, una categoría, un nivel de energía, un estado, una descripción y una cantidad de habitantes.

Algunos ejemplos incluidos inicialmente son:

- Ciudad Neblina.
- Bosque Susurro.
- Océano Prisma.

La API permite que nuevos mundos sean creados dinámicamente mediante peticiones HTTP.

A diferencia de una generación basada en índices fijos, los datos utilizados para crear un mundo provienen directamente del body enviado por el cliente y son validados antes de llegar al service.

---

## Tecnologías

El proyecto utiliza:

- Node.js.
- Express.
- TypeScript.
- tsx para ejecución en desarrollo.
- Git.
- GitHub.
- curl para pruebas manuales.

No se utiliza una base de datos en esta etapa.

---

## Arquitectura del proyecto

```text
micro-mundos-api/
│
├── src/
│   ├── controllers/
│   │   └── world.controller.ts
│   │
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   ├── requestId.middleware.ts
│   │   └── validateWorld.middleware.ts
│   │
│   ├── models/
│   │   └── world.model.ts
│   │
│   ├── routes/
│   │   └── world.routes.ts
│   │
│   ├── services/
│   │   └── world.service.ts
│   │
│   ├── utils/
│   │   └── AppError.ts
│   │
│   └── server.ts
│
├── .gitignore
├── README.md
├── requests.md
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## Responsabilidad de cada capa

### Models

`world.model.ts` contiene las estructuras y tipos del dominio.

Define:

- categorías permitidas;
- estados permitidos;
- interfaz principal del mundo;
- tipo utilizado para creación;
- tipo utilizado para actualización.

No contiene lógica HTTP ni lógica de almacenamiento.

### Services

`world.service.ts` administra los datos.

Sus responsabilidades son:

- obtener todos los mundos;
- buscar un mundo por ID;
- crear mundos;
- modificar mundos;
- eliminar mundos.

El service no conoce detalles de HTTP como `req`, `res` o códigos de estado.

### Controllers

`world.controller.ts` conecta HTTP con la lógica del service.

Recibe información de Express, llama al service correspondiente y construye la respuesta HTTP.

También transforma errores como recursos inexistentes en instancias de `AppError`.

### Routes

`world.routes.ts` define los endpoints y relaciona:

- verbos HTTP;
- rutas;
- middleware;
- controllers.

### Middlewares

Los middlewares manejan responsabilidades transversales antes o después de los controllers.

El proyecto implementa:

- identificación de requests;
- logging;
- validación;
- manejo de rutas inexistentes;
- manejo centralizado de errores.

### Utils

`AppError.ts` define una clase de error personalizada con un código HTTP asociado.

### Server

`server.ts` crea la aplicación Express, registra middlewares, rutas y finalmente inicia el servidor.

---

# Modelado del dominio con TypeScript

Uno de los objetivos del proyecto es aprovechar TypeScript para representar de manera precisa los estados válidos del dominio.

## Categorías

```ts
export const WORLD_CATEGORIES = [
  "ciudad",
  "bosque",
  "oceano",
  "espacio",
] as const;
```

`as const` indica a TypeScript que los elementos no deben interpretarse simplemente como `string`, sino como valores literales específicos.

El tipo se deriva directamente del arreglo:

```ts
export type WorldCategory =
  (typeof WORLD_CATEGORIES)[number];
```

Por lo tanto:

```ts
"ciudad"
```

es válido, mientras que:

```ts
"volcan"
```

no pertenece al dominio definido.

---

## Estados

Los estados posibles son:

```ts
export const WORLD_STATUSES = [
  "activo",
  "dormido",
  "inestable",
] as const;
```

Y su unión literal se deriva mediante:

```ts
export type WorldStatus =
  (typeof WORLD_STATUSES)[number];
```

Esto evita utilizar `string` para representar cualquier estado posible.

---

## Interface CreativeWorld

El recurso principal utiliza la siguiente estructura:

```ts
export interface CreativeWorld {
  id: number;
  name: string;
  category: WorldCategory;
  energy: number;
  status: WorldStatus;
  description: string;
  inhabitants: number;
}
```

Cada mundo posee siete campos tipados:

| Campo | Tipo | Descripción |
|---|---|---|
| id | number | Identificador único |
| name | string | Nombre del mundo |
| category | WorldCategory | Categoría válida |
| energy | number | Nivel entre 0 y 100 |
| status | WorldStatus | Estado actual |
| description | string | Descripción creativa |
| inhabitants | number | Número de habitantes |

---

## CreateWorldInput

Para crear un mundo, el cliente no debe proporcionar manualmente el ID.

Por eso se utiliza:

```ts
export type CreateWorldInput =
  Omit<CreativeWorld, "id">;
```

`Omit` reutiliza `CreativeWorld`, pero elimina la propiedad `id`.

El ID se genera automáticamente en el service.

---

## UpdateWorldInput

Una actualización PATCH no necesita modificar todos los campos.

Por eso se utiliza:

```ts
export type UpdateWorldInput =
  Partial<CreateWorldInput>;
```

`Partial` convierte todas las propiedades en opcionales.

Por ejemplo, esta petición es válida:

```json
{
  "energy": 91,
  "status": "inestable"
}
```

sin necesidad de volver a enviar nombre, categoría, descripción o habitantes.

---

# Flujo de una petición

Una petición para crear un mundo sigue este recorrido:

```text
Cliente
   ↓
POST /api/worlds
   ↓
requestIdMiddleware
   ↓
loggerMiddleware
   ↓
express.json()
   ↓
validateWorld
   ↓
world.routes.ts
   ↓
world.controller.ts
   ↓
world.service.ts
   ↓
array en memoria
   ↓
respuesta HTTP
```

Los errores producidos durante el proceso son enviados al:

```text
errorMiddleware
```

---

# Middleware personalizado

## Request ID Middleware

Cada petición recibe un identificador único.

Si el cliente envía:

```text
x-request-id
```

ese identificador se reutiliza.

Si no lo envía, Node genera un UUID mediante:

```ts
randomUUID()
```

El ID también se devuelve en los headers de respuesta.

Ejemplo:

```text
x-request-id: prueba-ariana-001
```

---

## Logger Middleware

El logger registra:

- request ID;
- método HTTP;
- endpoint;
- status code;
- duración.

Ejemplo:

```text
[prueba-ariana-001] GET /api/worlds - 200 - 2ms
```

---

## Validation Middleware

`validateWorldMiddleware` comprueba:

- que el body sea un objeto;
- campos obligatorios en POST;
- que PATCH no esté vacío;
- campos desconocidos;
- nombre no vacío;
- categoría válida;
- energía entre 0 y 100;
- estado válido;
- descripción no vacía;
- habitantes enteros y no negativos.

Una petición inválida nunca llega al service.

---

## Manejo centralizado de errores

La clase:

```ts
AppError
```

permite crear errores con código HTTP.

Ejemplo:

```ts
throw new AppError(
  404,
  "No existe un mundo con ese id."
);
```

Todos estos errores son procesados por:

```ts
errorMiddleware
```

El cliente recibe una respuesta consistente:

```json
{
  "success": false,
  "error": "Descripción del error"
}
```

También se manejan errores de JSON inválido y errores internos inesperados.

---

# API REST

Base URL:

```text
http://localhost:3000
```

## GET /

Comprueba que el servidor está activo.

### Respuesta

```text
200 OK
```

---

## GET /api/worlds

Devuelve todos los mundos.

### Respuesta

```text
200 OK
```

---

## GET /api/worlds/:id

Devuelve un mundo específico.

### Posibles respuestas

```text
200 OK
400 Bad Request
404 Not Found
```

---

## POST /api/worlds

Crea un nuevo mundo.

### Body

```json
{
  "name": "Isla Aurora",
  "category": "oceano",
  "energy": 77,
  "status": "activo",
  "description": "Una isla que brilla al amanecer.",
  "inhabitants": 250
}
```

### Posibles respuestas

```text
201 Created
400 Bad Request
```

---

## PATCH /api/worlds/:id

Actualiza parcialmente un mundo.

### Body de ejemplo

```json
{
  "energy": 91,
  "status": "inestable"
}
```

### Posibles respuestas

```text
200 OK
400 Bad Request
404 Not Found
```

---

## DELETE /api/worlds/:id

Elimina un mundo.

### Posibles respuestas

```text
204 No Content
400 Bad Request
404 Not Found
```

---

# Códigos HTTP utilizados

| Código | Significado | Uso |
|---|---|---|
| 200 | OK | GET y PATCH correctos |
| 201 | Created | Mundo creado |
| 204 | No Content | Mundo eliminado |
| 400 | Bad Request | Datos inválidos |
| 404 | Not Found | Recurso o ruta inexistente |
| 500 | Internal Server Error | Error inesperado |

---

# Instalación

## 1. Clonar repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

## 2. Entrar al proyecto

```bash
cd micro-mundos-api
```

## 3. Instalar dependencias

```bash
npm install
```

---

# Comandos disponibles

## Desarrollo

```bash
npm run dev
```

Ejecuta el servidor con `tsx` y reinicio automático al modificar archivos.

---

## Verificar TypeScript

```bash
npm run typecheck
```

Comprueba tipos sin generar archivos JavaScript.

---

## Build

```bash
npm run build
```

Compila el proyecto TypeScript y genera:

```text
dist/
```

---

## Producción

Primero:

```bash
npm run build
```

Luego:

```bash
npm start
```

Ejecuta:

```text
dist/server.js
```

---

## Verificación completa

```bash
npm run check
```

Ejecuta:

```text
typecheck
+
build
```

---

# Pruebas manuales

Las pruebas manuales completas están documentadas en:

```text
requests.md
```

Incluyen casos de:

- GET.
- GET por ID.
- POST.
- PATCH.
- DELETE.
- 400 Bad Request.
- 404 Not Found.
- JSON inválido.
- campos desconocidos.
- validación de tipos.
- Request ID.
- logger.
- manejo centralizado de errores.

---

# Persistencia de datos

Actualmente los datos están almacenados en un arreglo en memoria.

Esto significa que cualquier dato creado, actualizado o eliminado existe únicamente durante la ejecución actual del servidor.

Cuando el servidor se reinicia, los datos vuelven a su estado inicial.

Esta decisión es intencional porque el alcance de este entregable no requiere todavía una base de datos.

---

# Flujo Git y GitHub

El proyecto utiliza ramas para separar el desarrollo de nuevas funcionalidades.

Ejemplo de flujo:

```bash
git checkout -b feature/rest-api
```

Después de realizar cambios:

```bash
git add .
git commit -m "feat: implement REST API architecture"
```

La rama se publica mediante:

```bash
git push -u origin feature/rest-api
```

Posteriormente se crea un Pull Request en GitHub desde:

```text
feature/rest-api
```

hacia:

```text
main
```

Después de revisar los cambios, el Pull Request puede integrarse a `main`.

Este flujo permite conservar trazabilidad explícita del desarrollo.

---

# Buenas prácticas implementadas

El proyecto aplica:

- separación de responsabilidades;
- arquitectura por capas;
- tipado estricto;
- uniones literales;
- tipos derivados;
- utility types de TypeScript;
- validación antes del controller;
- manejo centralizado de errores;
- códigos HTTP apropiados;
- IDs automáticos;
- request IDs;
- logging;
- documentación de endpoints;
- pruebas manuales;
- `.gitignore`;
- ramas Git;
- Pull Requests.

---

# Autor

Ariana Puerta

Entregable 2 — API de Micro-Mundos Creativos
