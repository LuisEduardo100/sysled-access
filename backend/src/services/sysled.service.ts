import axios from 'axios';
import { env } from '../config/env';

interface SysledResponse {
    data: any[];
    // Add specific typing based on Sysled API response structure if known
}

export class SysledService {
    private client;

    constructor() {
        const token = env.SYSLED_API_TOKEN;

        this.client = axios.create({
            baseURL: env.SYSLED_API_URL,
            timeout: env.SYSLED_API_TIMEOUT,
            headers: {
                'Authorization': token,
            },
        });
    }

    async fetchSuprimentos() {
        try {
            const response = await this.client.get<SysledResponse>('?v_suprimentos_pendencia_compra_ativas=null');
            console.log('--- SYSLED API DEBUG ---');
            console.log('Status:', response.status);
            console.log('Data Type:', typeof response.data);
            console.log('Is Array:', Array.isArray(response.data));
            console.log('Data Preview:', JSON.stringify(response.data).substring(0, 200));
            console.log('------------------------');

            return response.data;
        } catch (error) {
            console.error('Error fetching from Sysled:', error);
            throw error;
        }
    }
}

export const sysledService = new SysledService();
