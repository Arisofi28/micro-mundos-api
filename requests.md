# Pruebas manuales — Micro-Mundos Creativos API

Este documento contiene las pruebas manuales realizadas sobre los endpoints principales de la API.

La API se ejecuta localmente en:

```text
http://localhost:3000
```

Para iniciar el servidor:

```bash
npm run dev
```

---

## 1. GET /api/worlds

### Objetivo

Obtener todos los micro-mundos almacenados actualmente en memoria.

### Request

```bash
curl -i http://localhost:3000/api/worlds
```

### Status esperado

```text
200 OK
```

### Response de ejemplo

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Ciudad Neblina",
      "category": "ciudad",
      "energy": 85,
      "status": "activo",
      "description": "Una ciudad flotante que aparece entre las nubes.",
      "inhabitants": 1250
    }
  ]
}
```

---

## 2. GET /api/worlds/:id

### Objetivo

Obtener un micro-mundo específico utilizando su identificador.

### Request

```bash
curl -i http://localhost:3000/api/worlds/1
```

### Status esperado

```text
200 OK
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ciudad Neblina",
    "category": "ciudad",
    "energy": 85,
    "status": "activo",
    "description": "Una ciudad flotante que aparece entre las nubes.",
    "inhabitants": 1250
  }
}
```

---

## 3. GET con ID inexistente

### Request

```bash
curl -i http://localhost:3000/api/worlds/999
```

### Status esperado

```text
404 Not Found
```

### Response

```json
{
  "success": false,
  "error": "No existe un mundo con id 999."
}
```

Esta prueba demuestra el manejo centralizado de errores mediante `AppError` y `errorMiddleware`.

---

## 4. POST /api/worlds

### Objetivo

Crear un nuevo micro-mundo.

### Request

```bash
curl -i \
-X POST \
http://localhost:3000/api/worlds \
-H "Content-Type: application/json" \
-d '{
  "name": "Isla Aurora",
  "category": "oceano",
  "energy": 77,
  "status": "activo",
  "description": "Una isla que brilla al amanecer.",
  "inhabitants": 250
}'
```

### Status esperado

```text
201 Created
```

### Response de ejemplo

```json
{
  "success": true,
  "message": "Mundo creado correctamente.",
  "data": {
    "id": 4,
    "name": "Isla Aurora",
    "category": "oceano",
    "energy": 77,
    "status": "activo",
    "description": "Una isla que brilla al amanecer.",
    "inhabitants": 250
  }
}
```

El identificador es generado por el service y no debe enviarse manualmente.

---

## 5. PATCH /api/worlds/:id

### Objetivo

Actualizar parcialmente un micro-mundo existente.

### Request

```bash
curl -i \
-X PATCH \
http://localhost:3000/api/worlds/4 \
-H "Content-Type: application/json" \
-d '{
  "energy": 91,
  "status": "inestable"
}'
```

### Status esperado

```text
200 OK
```

### Response

```json
{
  "success": true,
  "message": "Mundo actualizado correctamente.",
  "data": {
    "id": 4,
    "name": "Isla Aurora",
    "category": "oceano",
    "energy": 91,
    "status": "inestable",
    "description": "Una isla que brilla al amanecer.",
    "inhabitants": 250
  }
}
```

---

## 6. PATCH vacío

### Request

```bash
curl -i \
-X PATCH \
http://localhost:3000/api/worlds/4 \
-H "Content-Type: application/json" \
-d '{}'
```

### Status esperado

```text
400 Bad Request
```

### Response

```json
{
  "success": false,
  "error": "Debes enviar al menos un campo para actualizar."
}
```

---

## 7. POST con energía inválida

### Request

```bash
curl -i \
-X POST \
http://localhost:3000/api/worlds \
-H "Content-Type: application/json" \
-d '{
  "name": "Planeta Error",
  "category": "espacio",
  "energy": 500,
  "status": "activo",
  "description": "Este mundo debe ser rechazado.",
  "inhabitants": 100
}'
```

### Status esperado

```text
400 Bad Request
```

### Response

```json
{
  "success": false,
  "error": "energy debe ser un número entre 0 y 100."
}
```

---

## 8. Campo desconocido

### Request

```bash
curl -i \
-X PATCH \
http://localhost:3000/api/worlds/1 \
-H "Content-Type: application/json" \
-d '{
  "password": "123456"
}'
```

### Status esperado

```text
400 Bad Request
```

### Response

```json
{
  "success": false,
  "error": "Campos no permitidos: password."
}
```

---

## 9. DELETE /api/worlds/:id

### Request

```bash
curl -i \
-X DELETE \
http://localhost:3000/api/worlds/4
```

### Status esperado

```text
204 No Content
```

Una eliminación correcta utiliza `204` y no envía contenido en el body.

---

## 10. Middleware Request ID

### Request

```bash
curl -i \
-H "x-request-id: prueba-ariana-001" \
http://localhost:3000/api/worlds
```

### Evidencia esperada en headers

```text
x-request-id: prueba-ariana-001
```

### Evidencia esperada en servidor

```text
[prueba-ariana-001] GET /api/worlds - 200 - 1ms
```

Esta prueba demuestra el funcionamiento conjunto de `requestIdMiddleware` y `loggerMiddleware`.

---

## 11. Ruta inexistente

### Request

```bash
curl -i http://localhost:3000/api/no-existe
```

### Status esperado

```text
404 Not Found
```

### Response

```json
{
  "success": false,
  "error": "Ruta no encontrada: GET /api/no-existe"
}
```

---

## 12. JSON inválido

### Request

```bash
curl -i \
-X POST \
http://localhost:3000/api/worlds \
-H "Content-Type: application/json" \
-d '{"name":'
```

### Status esperado

```text
400 Bad Request
```

### Response

```json
{
  "success": false,
  "error": "El JSON enviado no tiene un formato válido."
}
```

Esta prueba demuestra que los errores del parser JSON también son procesados por el middleware centralizado de errores.

---

# Conclusión de pruebas

Las pruebas manuales verifican:

- GET de colección.
- GET por identificador.
- POST.
- PATCH.
- DELETE.
- Validación de campos.
- Validación de tipos.
- Validación de estados.
- IDs inválidos o inexistentes.
- Rutas inexistentes.
- JSON inválido.
- Request ID.
- Logging.
- Manejo centralizado de errores.

Los datos son almacenados en memoria y se reinician cuando se reinicia el servidor.
