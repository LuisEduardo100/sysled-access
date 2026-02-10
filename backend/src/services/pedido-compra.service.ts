/**
 * PedidoCompraService
 * SRP: Lógica de negócio para pedidos de compra (indexação, dedup, totais)
 */
import { pedidoCompraRepository } from '../repositories/pedido-compra.repository';
import { PedidoCompraItem } from '../types/pedido-compra.types';
import { PedidoCompraResumo } from '../types/pendencia.types';

export class PedidoCompraService {
    /**
     * Busca todos os pedidos de compra
     */
    async getAll(): Promise<PedidoCompraItem[]> {
        return pedidoCompraRepository.findAll();
    }

    /**
     * Busca pedidos de compra por SKU
     */
    async getBySku(sku: string): Promise<PedidoCompraItem[]> {
        return pedidoCompraRepository.findBySku(sku);
    }

    /**
     * Indexa pedidos por SKU em um Map, deduplicando por idPedidoCompra
     */
    static indexarPorSku(pedidos: PedidoCompraItem[]): Map<string, PedidoCompraItem[]> {
        const map = new Map<string, PedidoCompraItem[]>();

        // Deduplicate by unique key (idPedidoCompra + id)
        const uniquePedidos = new Map<string, PedidoCompraItem>();
        for (const p of pedidos) {
            const key = `${p.idPedidoCompra}-${p.id}`;
            uniquePedidos.set(key, p);
        }

        for (const pedido of uniquePedidos.values()) {
            const sku = String(pedido.codigo_sku);
            if (!sku || sku === 'undefined' || sku === 'null') continue;

            if (!map.has(sku)) map.set(sku, []);
            map.get(sku)!.push(pedido);
        }

        return map;
    }

    /**
     * Calcula total de quantidade em pedidos de compra
     */
    static calcularTotalQuantidade(pedidos: PedidoCompraItem[]): number {
        return pedidos.reduce((acc, p) => acc + (Number(p.quantidade) || 0), 0);
    }

    /**
     * Converte pedidos de compra para formato resumido (para resposta ao frontend)
     */
    static toResumo(pedidos: PedidoCompraItem[]): PedidoCompraResumo[] {
        return pedidos.map((p) => ({
            idPedidoCompra: p.idPedidoCompra,
            itemStatus: p.itemStatus,
            quantidade: p.quantidade,
            preco: p.precoCompra,
            fornecedorRazao: p.fornecedorRazao,
            dataPrevisao: p.dataPrevisao,
            dataFaturamento: p.dataFaturamento,
        }));
    }
}

export const pedidoCompraService = new PedidoCompraService();
