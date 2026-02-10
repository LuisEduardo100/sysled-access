
// Mock types
interface PendenciaRaw {
    idPendencia: string;
    idCliente: string;
    clienteRazao: string;
    clienteFantasia: string;
    quantidadePendencia: string;
    codigo_sku: string;
    dataPendencia: string;
    [key: string]: any;
}

interface PedidoCompraItem {
    idPedidoCompra: number;
    id: number;
    codigo_sku: number;
    itemStatus: string;
    dataPrevisao: string | null;
    quantidade: number;
    [key: string]: any;
}

// Mock Dependencies
const PendenciaService = {
    toNumber: (val: any) => Number(val) || 0,
    calcularDiasPendentes: (date: string) => 0
};

const PedidoCompraService = {
    calcularTotalQuantidade: (pedidos: any[]) => pedidos.reduce((acc, p) => acc + (p.quantidade || 0), 0),
    toResumo: (pedidos: any[]) => pedidos,
    indexarPorSku: (pedidos: PedidoCompraItem[]) => {
        const map = new Map<string, PedidoCompraItem[]>();
        for (const p of pedidos) {
            const sku = String(p.codigo_sku);
            if (!map.has(sku)) map.set(sku, []);
            map.get(sku)!.push(p);
        }
        return map;
    }
};

// Data from Debug Output
const mockPendencias: PendenciaRaw[] = [
    {
        "idPendencia": "14482",
        "idCliente": "43701",
        "clienteRazao": "JOSÉ MORILO GOMES GURGEL JUNIOR",
        "clienteFantasia": "JOSÉ MORILO GOMES GURGEL JUNIOR",
        "quantidadePendencia": "6",
        "codigo_sku": "8995",
        "dataPendencia": "2026-01-27",
        "estoqueDisponivel": "0"
    }
];

const mockPedidos: PedidoCompraItem[] = [
    {
        "idPedidoCompra": 1735,
        "id": 4495,
        "codigo_sku": 8995,
        "itemStatus": "Entregue",
        "dataPrevisao": "2025-11-01T10:51:33.060",
        "quantidade": 20
    }
];

const mockStockMap = new Map<string, number>();
mockStockMap.set("8995", 0); // Assuming 0 stock from service

// Logic to Test
function executeLogic() {
    console.log("Starting Logic Verification...");

    const pendencias = mockPendencias;
    const pedidosCompra = mockPedidos;
    const stockMap = mockStockMap;

    const pedidosMap = PedidoCompraService.indexarPorSku(pedidosCompra);

    const groupedBySku = new Map<string, PendenciaRaw[]>();
    for (const p of pendencias) {
        const sku = String(p.codigo_sku);
        if (!groupedBySku.has(sku)) groupedBySku.set(sku, []);
        groupedBySku.get(sku)?.push(p);
    }

    const enriched: any[] = [];

    for (const [sku, items] of groupedBySku) {
        const estoqueTotal = stockMap.get(sku) || 0;
        let estoqueDisponivel = estoqueTotal;
        const pedidos = pedidosMap.get(sku) || [];

        // Sort
        items.sort((a, b) => {
            const qtdA = PendenciaService.toNumber(a.quantidadePendencia);
            const qtdB = PendenciaService.toNumber(b.quantidadePendencia);
            return qtdA - qtdB;
        });

        for (const item of items) {
            const qtdPendencia = PendenciaService.toNumber(item.quantidadePendencia); // 6
            const allocated = Math.min(qtdPendencia, estoqueDisponivel); // min(6, 0) = 0
            estoqueDisponivel -= allocated;

            const saldoPendente = Math.max(0, qtdPendencia - allocated); // max(0, 6 - 0) = 6

            const qtdAChegar = pedidos
                .filter(p => ['A Faturar', 'Em Transito', 'Em Trânsito'].includes(p.itemStatus))
                .reduce((acc, curr) => acc + curr.quantidade, 0);

            const pedidosItemStatus = [...new Set(pedidos.map(p => p.itemStatus).filter(Boolean))].join(', ');

            const pedidosDataPrevisao = pedidos
                .map(p => p.dataPrevisao)
                .filter(Boolean)
                .sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0] || null;

            const cliente = item.clienteFantasia || item.clienteRazao;

            enriched.push({
                sku: item.codigo_sku,
                cliente,
                saldoPendente,
                qtdPendencia,
                estoqueTotal,
                qtdPedidos: pedidos.length,
                pedidosItemStatus,
                pedidosDataPrevisao
            });
        }
    }

    console.log("Enriched Results:");
    console.log(JSON.stringify(enriched, null, 2));
}

executeLogic();
