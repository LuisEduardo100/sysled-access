/**
 * PendenciaService
 * SRP: Lógica de negócio para pendências (normalização, cálculos)
 */
import { pendenciaRepository } from '../repositories/pendencia.repository';
import { PendenciaRaw } from '../types/pendencia.types';

export class PendenciaService {
    /**
     * Busca todas as pendências ativas da API
     */
    async getAll(): Promise<PendenciaRaw[]> {
        return pendenciaRepository.findAll();
    }

    /**
     * Calcula dias pendentes entre a data da pendência e hoje
     */
    static calcularDiasPendentes(dataPendencia: string): number {
        if (!dataPendencia) return 0;
        const data = new Date(dataPendencia + 'T00:00:00');
        if (isNaN(data.getTime())) return 0;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const diffMs = hoje.getTime() - data.getTime();
        return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    /**
     * Normaliza valor numérico vindo como string da API
     */
    static toNumber(value: string | number | null | undefined): number {
        if (value === null || value === undefined || value === '') return 0;
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    }
}

export const pendenciaService = new PendenciaService();
