/**
 * Tipos para o endpoint: v_suprimentos_pedido_compra_itens
 * Responsabilidade: representar itens de pedidos de compra
 */

export interface PedidoCompraItem {
    idPedidoCompra: number;
    itemStatusNome: string;
    produto: string;
    codigo_sku: number;
    fabricanteCodigo: string;
    usuarioCriacaoLogin: string;
    usuarioAtualizacaoLogin: string;
    valorTotalItem: number;
    id: number;
    id_pedido_compra: number;
    idProduto: number;
    precoVenda: number;
    precoCompra: number;
    precoUltimo: number;
    precoMedio: number;
    precoMenor: number;
    quantidade: number;
    quantidadeRecebida: number;
    preco: number;
    itemValorICMS: number;
    itemValorIPI: number;
    observacao: string;
    idItemStatus: number;
    itemStatus: string;
    desconto: number;
    isRessuprimento: number;
    usuarioCriacao: number;
    usuarioAlteracao: number;
    dataCriacao: string;
    dataAlteracao: string;
    dataFaturamento: string | null;
    status: number;
    dataPrevisao: string | null;
    statusPedidoCompra: number;
    idFornecedor: number;
    fornecedorCodigo: number;
    fornecedorRazao: string;
    fornecedorDocumento: string;
    idFornecedorProduto: number;
    fornecedorProdutoCodigo: number;
    fornecedorRazaoProduto: string;
    fornecedorDocumentoProduto: string;
    decimalIPI: number;
    valorIPITotalItem: number;
    pedidoFornecedor: string;
    wmsDisponivel: number;
    estoqueDisponivel: number;
    estoqueUnificado: number;
    precoVendaSku: number;
}
