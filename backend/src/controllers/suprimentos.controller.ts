import { Request, Response } from 'express';
import { sysledService } from '../services/sysled.service';

// Basic in-memory cache
let cache: any = null;
let lastFetchTime = 0;
const CACHE_TTL = 30 * 1000; // 30 seconds

export class SuprimentosController {

    // Normal GET request
    getSuprimentos = async (req: Request, res: Response) => {
        try {
            const now = Date.now();
            if (cache && (now - lastFetchTime < CACHE_TTL)) {
                return res.json({ data: cache, source: 'cache' });
            }

            const data = await sysledService.fetchSuprimentos();
            cache = data;
            lastFetchTime = now;

            return res.json({ data, source: 'api' });
        } catch (error) {
            console.error('Controller Error:', error);
            return res.status(500).json({ error: 'Failed to fetch data' });
        }
    };

    // SSE Stream
    getStream = (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const sendData = async () => {
            try {
                const now = Date.now();
                let dataToSend = cache;

                if (!cache || (now - lastFetchTime > CACHE_TTL)) {
                    dataToSend = await sysledService.fetchSuprimentos();
                    cache = dataToSend;
                    lastFetchTime = now;
                }

                res.write(`data: ${JSON.stringify(dataToSend)}\n\n`);
            } catch (err) {
                console.error('SSE Error:', err);
                res.write(`event: error\ndata: ${JSON.stringify({ message: 'Error fetching data' })}\n\n`);
            }
        };

        // Send immediately
        sendData();

        // Poll every 30 seconds (or logic to listen to webhooks/changes)
        const intervalId = setInterval(sendData, 30000);

        req.on('close', () => {
            clearInterval(intervalId);
            res.end();
        });
    };
}
