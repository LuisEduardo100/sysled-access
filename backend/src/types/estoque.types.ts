/**
 * Tipos para o endpoint: v_estoque_consulta_sku
 * Responsabilidade: representar dados de estoque por SKU
 */

export interface ProdutoEstoque {
    idProduto: number;
    quantidadeDisponivel: number;
    usuarioCriacao: string;
    dataCriacao: string;
    usuarioAtualizacao: string;
    dataAtualizacao: string;
    idCategoria: number;
    categoria: string;
    idGrupoCategorias: number;
    grupoCategorias: string;
    idTipoProdutos: number;
    tipoProdutos: string;
    idSegmentoProdutos: number;
    segmentoProdutos: string;
    id: number;
    codigo_sku: number;
    codigoFabricante: string;
    descricaoComplementar: string;
    isEcommerce: number;
    produto: string;
    ncm: string;
    unidade: string;
    precoVenda: number;
    precoCusto: number;
    precoCompra: number;
    precoPromocional: number | null;
    ultimoPreco: number | null;
    precoMedio: number | null;
    dataCadastro: string;
    idMarca: number;
    marca: string;
    status: number;
    dataAlteracao: string;
    produtoImagem: string | null;
    idFornecedor: number;
    fornecedorRazao: string;
    fornecedorFantasia: string;
    unidadeMedida: string;
    codigoOrigemMercadoria: string;
    descricaoOrigemMercadoria: string;
    idDominio: string;
    dominio: string;
    isMix: number;
    isEstoqueDisponivel: string;
}

export interface EstoqueResponse {
    produto: ProdutoEstoque[];
    estoque: any[];
}
