/**
 * EstoqueRepository
 * SRP: Responsabilidade única de buscar estoque por SKU da API Sysled
 * GOF Repository Pattern: abstrai acesso a dados externos
 */
import { apiClient } from '../config/api-client';
import { EstoqueResponse } from '../types/estoque.types';

export class EstoqueRepository {
    async findBySku(sku: string): Promise<EstoqueResponse | null> {
        try {
            const response = await apiClient.get<EstoqueResponse>('', {
                params: {
                    v_estoque_consulta_sku: 'null',
                    codigoSku: sku,
                },
            });
            return response.data;
        } catch (error) {
            // Suppress individual SKU errors to not break batch operations
            console.error(`[EstoqueRepository] Error fetching stock for SKU ${sku}:`, error);
            return null;
        }
    }
}

export const estoqueRepository = new EstoqueRepository();
