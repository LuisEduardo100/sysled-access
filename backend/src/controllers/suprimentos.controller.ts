/**
 * SuprimentosController — Thin Controller
 * SRP: Apenas tratamento HTTP, delega lógica ao Facade e Services
 */
import { Request, Response } from 'express';
import { suprimentosFacade } from '../services/suprimentos.facade';
import { estoqueService, EstoqueService } from '../services/estoque.service';
import { pedidoCompraService } from '../services/pedido-compra.service';
import { pendenciaService } from '../services/pendencia.service';

export class SuprimentosController {
    /**
     * GET /api/suprimentos/dashboard
     * Retorna dados cruzados (pendências + estoque + pedidos de compra)
     */
    getDashboard = async (_req: Request, res: Response) => {
        try {
            const data = await suprimentosFacade.getDashboard();
            return res.json({ data, total: data.length, source: 'facade' });
        } catch (error: any) {
            console.error('[Controller] getDashboard error:', error.message);
            return res.status(500).json({ error: 'Falha ao buscar dados do dashboard' });
        }
    };

    /**
     * GET /api/suprimentos/pendencias
     * Retorna pendências raw (sem cruzamento)
     */
    getPendencias = async (_req: Request, res: Response) => {
        try {
            const data = await pendenciaService.getAll();
            return res.json({ data, total: data.length });
        } catch (error: any) {
            console.error('[Controller] getPendencias error:', error.message);
            return res.status(500).json({ error: 'Falha ao buscar pendências' });
        }
    };

    /**
     * GET /api/suprimentos/estoque/:sku
     * Retorna estoque para um SKU específico
     */
    getEstoque = async (req: Request, res: Response) => {
        try {
            const { sku } = req.params;
            if (!sku) {
                return res.status(400).json({ error: 'SKU é obrigatório' });
            }

            const data = await estoqueService.getBySku(sku);
            const quantidadeDisponivel = EstoqueService.extrairQuantidadeDisponivel(data);

            return res.json({
                codigo_sku: sku,
                quantidadeDisponivel,
                raw: data,
            });
        } catch (error: any) {
            console.error('[Controller] getEstoque error:', error.message);
            return res.status(500).json({ error: 'Falha ao buscar estoque' });
        }
    };

    /**
     * GET /api/suprimentos/pedidos-compra/:sku
     * Retorna pedidos de compra para um SKU específico
     */
    getPedidosCompra = async (req: Request, res: Response) => {
        try {
            const { sku } = req.params;
            if (!sku) {
                return res.status(400).json({ error: 'SKU é obrigatório' });
            }

            const data = await pedidoCompraService.getBySku(sku);
            return res.json({ data, total: data.length, codigo_sku: sku });
        } catch (error: any) {
            console.error('[Controller] getPedidosCompra error:', error.message);
            return res.status(500).json({ error: 'Falha ao buscar pedidos de compra' });
        }
    };

    /**
     * GET /api/suprimentos/stream
     * SSE Stream para dados em tempo real
     */
    getStream = (_req: Request, res: Response) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const sendData = async () => {
            try {
                const data = await suprimentosFacade.getDashboard();
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            } catch (err) {
                console.error('[Controller] SSE Error:', err);
                res.write(`event: error\ndata: ${JSON.stringify({ message: 'Error fetching data' })}\n\n`);
            }
        };

        // Send immediately
        sendData();

        // Poll every 30 seconds
        const intervalId = setInterval(sendData, 30000);

        _req.on('close', () => {
            clearInterval(intervalId);
            res.end();
        });
    };

    /**
     * POST /api/suprimentos/cache/invalidate
     * Invalida cache manualmente
     */
    invalidateCache = (_req: Request, res: Response) => {
        suprimentosFacade.invalidateCache();
        return res.json({ message: 'Cache invalidado com sucesso' });
    };
}
