const WebSocket = require('ws');

// Crear servidor WebSocket en el puerto 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('🚀 Servidor WebSocket iniciado en ws://localhost:8080');

// Manejar conexiones
wss.on('connection', (ws, req) => {
    const clientIP = req.socket.remoteAddress;
    console.log(`✅ Nueva conexión desde: ${clientIP}`);
    
    // Enviar mensaje de bienvenida
    ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Conectado al servidor WebSocket',
        timestamp: Date.now()
    }));

    // Manejar mensajes recibidos
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('📨 Mensaje recibido:', {
                from: clientIP,
                type: message.type || 'unknown',
                content: message.message || message,
                timestamp: Date.now()
            });

            // Reenviar mensaje a todos los OTROS clientes conectados (broadcast)
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'broadcast',
                        from: clientIP,
                        message: message.message || message,
                        timestamp: Date.now()
                    }));
                }
            });

        } catch (error) {
            console.log('📨 Mensaje recibido (texto plano):', {
                from: clientIP,
                content: data.toString(),
                timestamp: Date.now()
            });

            // Reenviar mensaje de texto plano a otros clientes
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'broadcast',
                        from: clientIP,
                        message: data.toString(),
                        timestamp: Date.now()
                    }));
                }
            });
        }
    });

    // Manejar desconexión
    ws.on('close', () => {
        console.log(`❌ Cliente desconectado: ${clientIP}`);
    });

    // Manejar errores
    ws.on('error', (error) => {
        console.error(`🚨 Error en conexión ${clientIP}:`, error.message);
    });
});

// Manejar errores del servidor
wss.on('error', (error) => {
    console.error('🚨 Error del servidor WebSocket:', error);
});

// Mostrar estadísticas cada 30 segundos
setInterval(() => {
    console.log(`📊 Clientes conectados: ${wss.clients.size}`);
}, 30000);

// Manejar cierre del servidor
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    wss.clients.forEach((ws) => {
        ws.close();
    });
    wss.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
});