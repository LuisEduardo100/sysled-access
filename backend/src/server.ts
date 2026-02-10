import app from './app';
import { env } from './config/env';
import { createServer } from 'http';
import { Server } from 'socket.io';

const server = createServer(app);

// Optional: specific Socket.IO setup if needed later, currently using SSE for prompt requirements
// const io = new Server(server, { cors: { origin: env.ALLOWED_ORIGINS.split(',') } });

server.listen(Number(env.PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});
