import axios, { AxiosInstance } from 'axios';
import NodeCache from 'node-cache';
import { env } from '../config/env';

// Cache Configuration (30 seconds TTL)
const cache = new NodeCache({ stdTTL: env.CACHE_TTL });

// Axios Client Configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: env.SYSLED_API_URL,
    timeout: env.SYSLED_API_TIMEOUT,
    headers: {
        'Authorization': env.SYSLED_API_TOKEN,
    },
});

export interface SuprimentoRecord {
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
    [key: string]: any; // Allow extensibility
}

const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class SuprimentosService {

    static async fetchSuprimentos(): Promise<SuprimentoRecord[]> {
        const cacheKey = 'suprimentos_data';

        // Check Cache
        const cachedData = cache.get<SuprimentoRecord[]>(cacheKey);
        if (cachedData) {
            console.log('📦 Returning cached data');
            return cachedData;
        }

        let attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                console.log(`fetching data attempt: ${attempt + 1}`);
                const response = await apiClient.get('', {
                    params: {
                        v_suprimentos_pendencia_compra_ativas: 'null'
                    }
                });

                const data = response.data;

                // Validate is array?
                if (!Array.isArray(data)) {
                    // If the API returns a wrapped object, adjust here. Assuming array based on prompt.
                    // But prompt says: "Retorna todos os registros de suprimentos"
                    // Let's assume array.
                    if (data && typeof data === 'object' && !Array.isArray(data)) {
                        // handle potential wrapping
                    }
                }

                // Set Cache
                cache.set(cacheKey, data);
                return data as SuprimentoRecord[];

            } catch (error: any) {
                attempt++;
                console.error(`Attempt ${attempt} failed: ${error.message}`);

                if (attempt >= MAX_RETRIES) {
                    throw new Error('Failed to fetch suprimentos after multiple attempts');
                }

                const retryDelay = RETRY_DELAY_BASE * Math.pow(2, attempt - 1);
                await delay(retryDelay);
            }
        }

        return [];
    }
}
