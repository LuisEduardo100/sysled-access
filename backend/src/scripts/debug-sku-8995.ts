
import { suprimentosFacade } from '../services/suprimentos.facade';
import { pendenciaService } from '../services/pendencia.service';
import { pedidoCompraService } from '../services/pedido-compra.service';
import { estoqueService } from '../services/estoque.service';

const SKU_TO_DEBUG = '8995';

async function run() {
    console.log(`[Debug] Starting debug for SKU ${SKU_TO_DEBUG}...`);

    try {
        // 1. Fetch Raw Data directly
        console.log('[Debug] Fetching raw data...');
        const [pendencias, pedidos] = await Promise.all([
            pendenciaService.getAll(),
            pedidoCompraService.getAll()
        ]);

        const rawPendencias = pendencias.filter(p => String(p.codigo_sku) === SKU_TO_DEBUG);
        const rawPedidos = pedidos.filter(p => String(p.codigo_sku) === SKU_TO_DEBUG);

        console.log(`[Debug] Found ${rawPendencias.length} pendencias for SKU ${SKU_TO_DEBUG}`);
        if (rawPendencias.length > 0) {
            console.log('[Debug] Sample Pendencia Raw:', JSON.stringify(rawPendencias[0], null, 2));
        }

        console.log(`[Debug] Found ${rawPedidos.length} pedidos for SKU ${SKU_TO_DEBUG}`);
        if (rawPedidos.length > 0) {
            console.log('[Debug] Sample Pedido Raw:', JSON.stringify(rawPedidos[0], null, 2));
        }

        // 2. Run Facade Logic (which includes cache check, so we might need to clear cache first if we want fresh processing)
        // For debugging, we can rely on what the facade returns to see the final output.
        // Assuming cache might be stale, let's look at what the facade returns NOW.

        console.log('[Debug] Calling SuprimentosFacade.getDashboard()...');

        // Force invalidation to ensure we debug the Logic, not the Cache
        suprimentosFacade.invalidateCache();

        const dashboard = await suprimentosFacade.getDashboard();
        const enrichedItems = dashboard.filter(i => String(i.codigo_sku) === SKU_TO_DEBUG);

        console.log(`[Debug] Facade returned ${enrichedItems.length} items for SKU ${SKU_TO_DEBUG}`);

        enrichedItems.forEach((item, index) => {
            console.log(`[Debug] Enriched Item ${index + 1}:`);
            console.log(`   - Cliente: ${item.cliente} (Razao: ${item.clienteRazao}, Fantasia: ${item.clienteFantasia})`);
            console.log(`   - Saldo Pendente: ${item.saldoPendente}`);
            console.log(`   - Qtd Pendencia: ${item.quantidadePendencia}`);
            console.log(`   - Estoque: ${item.estoque}`);
            console.log(`   - Pedidos Item Status: ${item.pedidosItemStatus}`);
            console.log(`   - Pedidos Data Previsao: ${item.pedidosDataPrevisao}`);
            console.log(`   - Pedidos Length: ${item.qtdPedidos}`);
            console.log(`   - Situacao Compra: ${item.situacaoCompra}`);
        });

    } catch (error) {
        console.error('[Debug] Error:', error);
    }
}

run();
