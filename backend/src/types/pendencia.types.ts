/**
 * Tipos para o endpoint: v_suprimentos_pendencia_compra_ativas
 * Responsabilidade: representar pendências de compra ativas
 */

export interface PendenciaRaw {
    idPendencia: string;
    idCliente: string;
    clienteG2: string;
    clienteRazao: string;
    clienteFantasia: string;
    idPedido: string;
    idPedidoG2: string;
    dataPedido: string;
    dataAcordoEntregaPedido: string;
    dataPendencia: string;
    quantidadePendencia: string;
    quantidadeCompra: string;
    quantidadePedidoCompra: string;
    idProduto: string;
    codigo_sku: string;
    idProdutoG2: string;
    produto: string;
    status: string;
    fornecedorCodigoG2: string;
    fornecedorRazao: string;
    idConsultor: string;
    codigoConsultorG2: string;
    consultor: string;
    idMarca: string;
    marca: string;
    exportadoSeparacao: string | null;
    isImportadoERP: string | null;
    idComprador: string;
    comprador: string;
    precoUnitarioManual: string | null;
    statusDescricao: string;
    codigoFabricante: string;
    precoCusto: string;
    precoCompra: string;
    precoVenda: string;
    estoqueDisponivel: string | null;
    curvaABC: string | null;
    idEstoque: string;
    idParceiro: string | null;
    parceiroFantasia: string;
    idCategoria: string;
    categoria: string;
    idGrupoCategorias: string;
    grupoCategorias: string;
    idTipoProdutos: string;
    tipoProdutos: string;
    idSegmentoProdutos: string;
    segmentoProdutos: string;
}

export interface PendenciaEnriquecida {
    // Campos originais da pendência
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
    qtdAChegar: number; // Soma de 'A Faturar' e 'Em Trânsito'
    qtdPedidos: number; // Contagem de pedidos
    situacaoCompra: 'OK' | 'COMPRAR';
    cliente: string; // Nome do cliente (Fantasia ou Razão)
}

export interface PedidoCompraResumo {
    idPedidoCompra: number;
    itemStatus: string;
    quantidade: number;
    preco: number;
    fornecedorRazao: string;
    dataPrevisao: string | null;
    dataFaturamento: string | null;
}
