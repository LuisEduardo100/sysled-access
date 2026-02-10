/**
 * PedidoCompraRepository
 * SRP: Responsabilidade única de buscar pedidos de compra da API Sysled
 * GOF Repository Pattern: abstrai acesso a dados externos
 */
import { apiClient } from '../config/api-client';
import { PedidoCompraItem } from '../types/pedido-compra.types';

export class PedidoCompraRepository {
    async findAll(): Promise<PedidoCompraItem[]> {
        try {
            const response = await apiClient.get<PedidoCompraItem[]>('', {
                params: { v_suprimentos_pedido_compra_itens: 'null' },
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('[PedidoCompraRepository] Error fetching pedidos de compra:', error);
            throw error;
        }
    }

    async findBySku(sku: string): Promise<PedidoCompraItem[]> {
        try {
            const response = await apiClient.get<PedidoCompraItem[]>('', {
                params: {
                    v_suprimentos_pedido_compra_itens: 'null',
                    codigoSku: sku,
                },
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error(`[PedidoCompraRepository] Error fetching pedidos for SKU ${sku}:`, error);
            return [];
        }
    }
}

export const pedidoCompraRepository = new PedidoCompraRepository();
