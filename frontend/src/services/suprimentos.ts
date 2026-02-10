import { api } from './api';

// ===== Tipos para Pedidos de Compra =====
export interface PedidoCompraResumo {
    idPedidoCompra: number;
    itemStatus: string;
    quantidade: number;
    preco: number;
    fornecedorRazao: string;
    dataPrevisao: string | null;
    dataFaturamento: string | null;
}

// ===== Tipo principal: Pendência Enriquecida (dados cruzados) =====
export interface Suprimento {
    idPendencia: string;
    idCliente: string;
    clienteRazao: string;
    clienteFantasia: string;
    idPedido: string;
    dataPedido: string;
    dataPendencia: string;
    quantidadePendencia: number;
    quantidadeCompra: number;
    quantidadePedidoCompra: number;
    idProduto: string;
    codigo_sku: string;
    produto: string;
    status: string;
    statusDescricao: string;
    fornecedorRazao: string;
    consultor: string;
    comprador: string;
    marca: string;
    codigoFabricante: string;
    precoCusto: number;
    precoCompra: number;
    precoVenda: number;
    curvaABC: string | null;
    idEstoque: string;
    parceiroFantasia: string;

    // Categorização
    categoria: string;
    grupoCategorias: string;
    tipoProdutos: string;
    segmentoProdutos: string;

    // Campos calculados
    diasPendentes: number;
    estoque: number;

    // Dados cruzados de pedidos de compra
    pedidosCompra: PedidoCompraResumo[];
    totalQuantidadePedidos: number;
    pedidosItemStatus: string;
    pedidosDataPrevisao: string | null;

    // Novos campos calculados (Logica SJF e métricas)
    saldoPendente: number;
    qtdAChegar: number;
    qtdPedidos: number;
    situacaoCompra: 'OK' | 'COMPRAR';
    cliente: string;
}

// ===== Frontend Service =====
export const SuprimentosService = {
    /**
     * Busca dados cruzados do dashboard (endpoint principal)
     */
    getDashboard: async (): Promise<Suprimento[]> => {
        const response = await api.get<{ data: Suprimento[]; total: number }>('/suprimentos/dashboard');
        return response.data.data;
    },

    /**
     * Busca pendências raw (sem cruzamento)
     */
    getPendencias: async (): Promise<any[]> => {
        const response = await api.get<{ data: any[] }>('/suprimentos/pendencias');
        return response.data.data;
    },

    /**
     * Busca estoque para um SKU específico
     */
    getEstoque: async (sku: string) => {
        const response = await api.get(`/suprimentos/estoque/${sku}`);
        return response.data;
    },

    /**
     * Busca pedidos de compra para um SKU específico
     */
    getPedidosCompra: async (sku: string) => {
        const response = await api.get(`/suprimentos/pedidos-compra/${sku}`);
        return response.data;
    },
};
