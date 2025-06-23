# WebSocket App - Node.js

Una aplicación simple de WebSockets que incluye servidor y cliente con envío manual de mensajes y broadcast entre múltiples clientes.

## 🚀 Instalación

1. **Instalar dependencias:**

```bash
npm install
```

## 📋 Uso

### Opción 1: Ejecutar servidor y cliente por separado

1. **Iniciar el servidor:**

```bash
npm run server
# o
node server.js
```

2. **En otra terminal, iniciar el cliente:**

```bash
npm run client
# o
node client.js
```

### Opción 2: Ejecutar ambos al mismo tiempo

```bash
npm run dev
```

## 🔧 Funcionalidades

### Servidor (server.js)

* ✅ Escucha en `ws://localhost:8080`
* ✅ Muestra mensajes recibidos en consola con timestamp UTC
* ✅ Reenvía mensajes a todos los **otros** clientes conectados (broadcast)
* ✅ Maneja múltiples conexiones simultáneas
* ✅ Muestra estadísticas de conexiones cada 30 segundos
* ✅ No reenvía mensajes al cliente que los envió originalmente

### Cliente (client.js)

* ✅ Se conecta automáticamente al servidor
* ✅ Permite enviar mensajes manuales desde la terminal
* ✅ Recibe mensajes broadcast de otros clientes
* ✅ Reconexión automática si se pierde la conexión
* ✅ Escribe "quit" para salir
* ✅ Muestra timestamps UTC y fecha legible

## 🧪 Pruebas con Postman

### Configurar Postman para WebSockets:

1. **Crear nueva solicitud WebSocket:**

   * Tipo: WebSocket Request
   * URL: `ws://localhost:8080`
2. **Conectar:**

   * Click en "Connect"
   * Deberías ver el mensaje de bienvenida
3. **Enviar mensajes:**

   ```json
   {
     "type": "test_message",
     "message": "Hola desde Postman!"
   }
   ```

   O simplemente texto plano:

   ```
   Mensaje de prueba desde Postman
   ```
4. **Ver respuestas:**

   * Los mensajes aparecerán en la consola del servidor
   * También se reenviarán a todos los otros clientes conectados

## 🕒 Timestamps UTC

La aplicación utiliza timestamps UTC (epoch time en milisegundos desde 1970):

### Formato:

```javascript
timestamp: 1718636245123  // Milisegundos desde 1 enero 1970
```

### En el cliente verás:

```
📨 Mensaje del servidor: {
  type: 'broadcast',
  content: 'Hola mundo!',
  timestamp: 1718636245123,
  date: '17/6/2025, 15:30:45'
}
```

## ⚙️ Configuración

### Cambiar puerto del servidor:

En `server.js`, modificar:

```javascript
const wss = new WebSocket.Server({ port: 8080 }); // Cambiar puerto aquí
```

### Cambiar URL del servidor en cliente:

En `client.js`, modificar:

```javascript
const SERVER_URL = 'ws://localhost:8080'; // Cambiar URL aquí
```

## 📊 Logs del servidor

El servidor muestra información detallada:

* ✅ Nuevas conexiones con IP del cliente
* 📨 Mensajes recibidos con timestamp UTC
* ❌ Desconexiones
* 🚨 Errores
* 📊 Estadísticas cada 30 segundos

### Ejemplo de logs:

```
🚀 Servidor WebSocket iniciado en ws://localhost:8080
✅ Nueva conexión desde: ::1
📨 Mensaje recibido: {
  from: '::1',
  type: 'manual_message',
  content: 'Hola mundo!',
  timestamp: 1718636245123
}
```

## 🧪 Probando Broadcast

### Para probar el broadcast entre múltiples clientes:

1. **Ejecutar el servidor:**

```bash
node server.js
```

2. **Abrir múltiples terminales y ejecutar clientes:**

```bash
# Terminal 1
node client.js

# Terminal 2
node client.js

# Terminal 3 (opcional)
node client.js
```

3. **Escribir en cualquier cliente:**

```
💬 > Hola desde cliente 1!
📤 Mensaje enviado: "Hola desde cliente 1!"
```

4. **Los otros clientes recibirán:**

```
📨 Mensaje del servidor: {
  type: 'broadcast',
  content: 'Hola desde cliente 1!',
  timestamp: 1718636245123,
  date: '17/6/2025, 15:30:45'
}
```

## 🛠️ Solución de problemas

### Error "EADDRINUSE":

* El puerto 8080 ya está en uso
* Cambiar puerto en server.js o cerrar la aplicación que lo usa

### Cliente no se conecta:

* Verificar que el servidor esté ejecutándose
* Revisar que la URL sea correcta (`ws://localhost:8080`)

### Mensajes no aparecen:

* Verificar formato JSON si usas Postman
* Revisar consola del servidor para errores

### No recibo broadcasts:

* Asegurarnos de tener múltiples clientes conectados
* El cliente que envía el mensaje NO recibe su propio broadcast
* Solo los otros clientes reciben el mensaje

## 📝 Ejemplos de mensajes

### JSON estructurado:

```json
{
  "type": "chat",
  "message": "Hola mundo!",
  "timestamp": 1718636245123
}
```

### Texto plano:

```
Este es un mensaje simple
```

### Respuesta del servidor:

```json
{
  "type": "broadcast",
  "from": "::1",
  "message": "Este es un mensaje simple",
  "timestamp": 1718636245123
}
```

## 🎯 Casos de uso

* **Chat en tiempo real** entre múltiples usuarios
* **Notificaciones** push entre aplicaciones
* **Sincronización** de datos en tiempo real
* **Monitoreo** de eventos del sistema
* **Testing** de APIs WebSocket

La aplicación maneja tanto mensajes JSON estructurados como texto plano automáticamente
