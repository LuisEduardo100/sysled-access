/**
 * PendenciaRepository
 * SRP: Responsabilidade única de buscar pendências ativas da API Sysled
 * GOF Repository Pattern: abstrai acesso a dados externos
 */
import { apiClient } from '../config/api-client';
import { PendenciaRaw } from '../types/pendencia.types';

export class PendenciaRepository {
    async findAll(): Promise<PendenciaRaw[]> {
        try {
            const response = await apiClient.get<PendenciaRaw[]>('', {
                params: { v_suprimentos_pendencia_compra_ativas: 'null' },
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch (error) {
            console.error('[PendenciaRepository] Error fetching pendências:', error);
            throw error;
        }
    }
}

export const pendenciaRepository = new PendenciaRepository();
