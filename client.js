const WebSocket = require('ws');
const readline = require('readline');

class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connect() {
        console.log(`🔄 Intentando conectar a ${this.url}...`);
        
        this.ws = new WebSocket(this.url);

        this.ws.on('open', () => {
            console.log('✅ Conectado al servidor WebSocket');
            this.reconnectAttempts = 0;
        });

        this.ws.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                const readableDate = new Date(message.timestamp).toLocaleString();
                console.log('📨 Mensaje del servidor:', {
                    type: message.type,
                    content: message.message,
                    timestamp: message.timestamp,
                    date: readableDate
                });
            } catch (error) {
                console.log('📨 Mensaje del servidor (texto plano):', data.toString());
            }
        });

        this.ws.on('close', (code, reason) => {
            console.log(`❌ Conexión cerrada. Código: ${code}, Razón: ${reason || 'No especificada'}`);
            this.attemptReconnect();
        });

        this.ws.on('error', (error) => {
            console.error('🚨 Error de conexión:', error.message);
        });
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            
            console.log(`🔄 Reintentando conexión en ${delay/1000} segundos... (Intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connect();
            }, delay);
        } else {
            console.log('❌ Máximo número de reintentos alcanzado. Deteniendo cliente.');
        }
    }

    sendMessage(message) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const messageObj = {
                type: 'manual_message',
                message: message,
                timestamp: Date.now(),
                from: 'client-manual'
            };
            this.ws.send(JSON.stringify(messageObj));
            console.log(`📤 Mensaje enviado: "${message}"`);
            return true;
        } else {
            console.log('❌ No se puede enviar mensaje. Cliente no conectado.');
            return false;
        }
    }

    disconnect() {
        console.log('🛑 Desconectando cliente...');
        if (this.ws) {
            this.ws.close();
        }
    }
}

// Configuración
const SERVER_URL = 'ws://localhost:8080';

// Crear y conectar cliente
const client = new WebSocketClient(SERVER_URL);
client.connect();

// Configurar interfaz de línea de comandos
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '💬 > '
});

console.log('\n💡 Escribe mensajes y presiona Enter para enviarlos');
console.log('💡 Escribe "quit" para salir\n');

rl.on('line', (input) => {
    const message = input.trim();
    if (message.toLowerCase() === 'quit') {
        client.disconnect();
        rl.close();
        process.exit(0);
    } else if (message) {
        client.sendMessage(message);
    }
    rl.prompt();
});

rl.on('close', () => {
    client.disconnect();
    process.exit(0);
});

// Mostrar prompt inicial después de un breve delay
setTimeout(() => {
    rl.prompt();
}, 1000);

// Manejar cierre del proceso
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando cliente...');
    client.disconnect();
    rl.close();
    process.exit(0);
});