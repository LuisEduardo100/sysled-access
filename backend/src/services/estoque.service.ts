/**
 * EstoqueService
 * SRP: Lógica de negócio para estoque (batch fetch com rate-limiting)
 */
import { estoqueRepository } from '../repositories/estoque.repository';
import { EstoqueResponse } from '../types/estoque.types';

export class EstoqueService {
    private static readonly BATCH_SIZE = 100; // Increased from 20 to 100
    private static readonly BATCH_DELAY_MS = 20; // Reduced from 50 to 20

    /**
     * Busca estoque para um SKU individual
     */
    async getBySku(sku: string): Promise<EstoqueResponse | null> {
        return estoqueRepository.findBySku(sku);
    }

    /**
     * Extrai quantidade disponível de uma resposta de estoque
     */
    static extrairQuantidadeDisponivel(data: EstoqueResponse | null): number {
        if (!data) return 0;

        // Tentar extrair de produto[] (campo principal)
        if (data.produto && Array.isArray(data.produto) && data.produto.length > 0) {
            const qtd = Number(data.produto[0].quantidadeDisponivel);
            return isNaN(qtd) ? 0 : qtd;
        }

        // Fallback: extrair de estoque[]
        if (data.estoque && Array.isArray(data.estoque) && data.estoque.length > 0) {
            const qtd = Number((data.estoque[0] as any).quantidadeDisponivel);
            return isNaN(qtd) ? 0 : qtd;
        }

        return 0;
    }

    /**
     * Busca estoque em lote para múltiplos SKUs (com rate-limiting)
     * Retorna Map<sku, quantidadeDisponivel>
     */
    async fetchBatch(skus: string[]): Promise<Map<string, number>> {
        const stockMap = new Map<string, number>();
        const uniqueSkus = [...new Set(skus)];

        for (let i = 0; i < uniqueSkus.length; i += EstoqueService.BATCH_SIZE) {
            const batch = uniqueSkus.slice(i, i + EstoqueService.BATCH_SIZE);

            await Promise.all(
                batch.map(async (sku) => {
                    const data = await this.getBySku(sku);
                    const qtd = EstoqueService.extrairQuantidadeDisponivel(data);
                    stockMap.set(sku, qtd);
                })
            );

            // Small delay between batches to avoid overwhelming the API
            if (i + EstoqueService.BATCH_SIZE < uniqueSkus.length) {
                await new Promise((resolve) => setTimeout(resolve, EstoqueService.BATCH_DELAY_MS));
            }
        }

        return stockMap;
    }
}

export const estoqueService = new EstoqueService();
