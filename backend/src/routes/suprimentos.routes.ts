/**
 * Suprimentos Routes
 * Endpoints separados por responsabilidade + endpoint consolidado (dashboard)
 */
import { Router } from 'express';
import { SuprimentosController } from '../controllers/suprimentos.controller';

const router = Router();
const controller = new SuprimentosController();

// Dashboard consolidado (dados cruzados: pendências + estoque + pedidos)
router.get('/', controller.getDashboard);
router.get('/dashboard', controller.getDashboard);

// Endpoints individuais (cada tabela)
router.get('/pendencias', controller.getPendencias);
router.get('/estoque/:sku', controller.getEstoque);
router.get('/pedidos-compra/:sku', controller.getPedidosCompra);

// SSE Stream para tempo real
router.get('/stream', controller.getStream);

// Cache management
router.post('/cache/invalidate', controller.invalidateCache);

export default router;
