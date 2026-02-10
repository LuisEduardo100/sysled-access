import { api } from './api';

export interface Suprimento {
    idCliente: string | number;
    razaoCliente: string;
    idPedido: string | number;
    status: string;
    dataPendencia: string;
    dataPedido: string;
    comprador: string;
    consultor: string;
    curvaABC: string;
    idEstoque: string | number;
    quantidadePendencia: number;
    quantidadeCompra: number;
    quantidadePedidoCompra: number;
    idProduto: string | number;
    codigo_sku: string;
    produto: string;
    fornecedorRazao: string;
    [key: string]: any;
}

export const SuprimentosService = {
    getAll: async (): Promise<Suprimento[]> => {
        const response = await api.get<{ data: Suprimento[] }>('/suprimentos');
        return response.data.data;
    },
};
