import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import suprimentosRoutes from './routes/suprimentos.routes';

const app = express();

app.use(helmet());
app.use(cors({
    origin: env.ALLOWED_ORIGINS.split(','),
    methods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(express.json());

app.use('/api/suprimentos', suprimentosRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
