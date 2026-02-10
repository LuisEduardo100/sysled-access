/**
 * SuprimentosFacade
 * GOF Facade Pattern: orquestra o cruzamento de dados entre
 * Pendências + Estoque + Pedidos de Compra
 * 
 * Único ponto de merge — consolida dados de 3 endpoints via codigo_sku
 */
import { pendenciaService, PendenciaService } from './pendencia.service';
import { estoqueService } from './estoque.service';
import { pedidoCompraService, PedidoCompraService } from './pedido-compra.service';
import { cacheManager } from '../config/cache-manager';
import { PendenciaEnriquecida } from '../types/pendencia.types';

const CACHE_KEY = 'suprimentos_dashboard_v3';

export class SuprimentosFacade {
    /**
     * Retorna dados cruzados (pendências enriquecidas com estoque + pedidos)
     * Com cache centralizado
     */
    async getDashboard(): Promise<PendenciaEnriquecida[]> {
        // 1. Check cache
        const cached = cacheManager.get<PendenciaEnriquecida[]>(CACHE_KEY);
        if (cached) {
            return cached;
        }

        // 2. Fetch pendências and pedidos de compra in parallel
        const [pendencias, pedidosCompra] = await Promise.all([
            pendenciaService.getAll(),
            pedidoCompraService.getAll(),
        ]);

        // 3. Index pedidos de compra by SKU
        const pedidosMap = PedidoCompraService.indexarPorSku(pedidosCompra);

        // 4. Extract unique SKUs from pendências for stock fetch
        const uniqueSkus = [...new Set(
            pendencias
                .map((p) => String(p.codigo_sku))
                .filter((sku) => sku && sku !== 'undefined' && sku !== 'null')
        )];

        // 5. Batch fetch stock for all unique SKUs
        const stockMap = await estoqueService.fetchBatch(uniqueSkus);

        // 6. Merge & Group by SKU for allocation
        const groupedBySku = new Map<string, typeof pendencias>();
        for (const p of pendencias) {
            const sku = String(p.codigo_sku);
            if (!groupedBySku.has(sku)) groupedBySku.set(sku, []);
            groupedBySku.get(sku)?.push(p);
        }

        const enriched: PendenciaEnriquecida[] = [];

        // Process each SKU group
        for (const [sku, items] of groupedBySku) {
            const estoqueTotal = stockMap.get(sku) || 0;
            let estoqueDisponivel = estoqueTotal;
            const pedidos = pedidosMap.get(sku) || [];

            // Sort items by quantity (Smallest Job First) to maximize satisfied clients
            items.sort((a, b) => {
                const qtdA = PendenciaService.toNumber(a.quantidadePendencia);
                const qtdB = PendenciaService.toNumber(b.quantidadePendencia);
                return qtdA - qtdB;
            });

            for (const item of items) {
                const qtdPendencia = PendenciaService.toNumber(item.quantidadePendencia);

                // Allocate stock
                const allocated = Math.min(qtdPendencia, estoqueDisponivel);
                estoqueDisponivel -= allocated;

                const saldoPendente = Math.max(0, qtdPendencia - allocated);

                // Metrics
                const totalPedidos = PedidoCompraService.calcularTotalQuantidade(pedidos);
                const qtdAChegar = pedidos
                    .filter(p => ['A Faturar', 'Em Transito', 'Em Trânsito'].includes(p.itemStatus))
                    .reduce((acc, curr) => acc + curr.quantidade, 0);

                const pedidosItemStatus = [...new Set(pedidos.map(p => p.itemStatus).filter(Boolean))].join(', ');
                const pedidosDataPrevisao = pedidos
                    .map(p => p.dataPrevisao)
                    .filter(Boolean)
                    .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0] || null;

                enriched.push({
                    // Campos originais
                    idPendencia: item.idPendencia,
                    idCliente: item.idCliente,
                    clienteRazao: item.clienteRazao,
                    clienteFantasia: item.clienteFantasia,
                    idPedido: item.idPedido,
                    dataPedido: item.dataPedido,
                    dataPendencia: item.dataPendencia,
                    quantidadePendencia: qtdPendencia,
                    quantidadeCompra: PendenciaService.toNumber(item.quantidadeCompra),
                    quantidadePedidoCompra: PendenciaService.toNumber(item.quantidadePedidoCompra),
                    idProduto: item.idProduto,
                    codigo_sku: item.codigo_sku,
                    produto: item.produto,
                    status: item.status,
                    statusDescricao: item.statusDescricao,
                    fornecedorRazao: item.fornecedorRazao,
                    consultor: item.consultor,
                    comprador: item.comprador,
                    marca: item.marca,
                    codigoFabricante: item.codigoFabricante,
                    precoCusto: PendenciaService.toNumber(item.precoCusto),
                    precoCompra: PendenciaService.toNumber(item.precoCompra),
                    precoVenda: PendenciaService.toNumber(item.precoVenda),
                    curvaABC: item.curvaABC,
                    idEstoque: item.idEstoque,
                    parceiroFantasia: item.parceiroFantasia,
                    categoria: item.categoria,
                    grupoCategorias: item.grupoCategorias,
                    tipoProdutos: item.tipoProdutos,
                    segmentoProdutos: item.segmentoProdutos,

                    // Campos calculados
                    diasPendentes: PendenciaService.calcularDiasPendentes(item.dataPendencia),
                    estoque: estoqueTotal, // Show total stock available for this SKU
                    situacaoCompra: (saldoPendente === 0 || saldoPendente <= qtdAChegar) ? 'OK' : 'COMPRAR',

                    // Novos campos
                    saldoPendente: saldoPendente || 0, // Ensure it's never undefined
                    qtdAChegar,
                    qtdPedidos: pedidos.length,
                    cliente: item.clienteFantasia || item.clienteRazao || "Cliente não informado",

                    // Dados cruzados
                    pedidosCompra: PedidoCompraService.toResumo(pedidos),
                    totalQuantidadePedidos: totalPedidos,
                    pedidosItemStatus: pedidosItemStatus || "-",
                    pedidosDataPrevisao: pedidosDataPrevisao,
                });
            }
        }

        // 7. Cache result
        cacheManager.set(CACHE_KEY, enriched);

        console.log(`[SuprimentosFacade] Dashboard data ready: ${enriched.length} records`);
        return enriched;
    }

    /**
     * Invalida cache do dashboard
     */
    invalidateCache(): void {
        cacheManager.del(CACHE_KEY);
    }
}

export const suprimentosFacade = new SuprimentosFacade();
