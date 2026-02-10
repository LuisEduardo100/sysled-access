/**
 * ApiClient — Axios instance compartilhada para a API Sysled
 * SRP: Responsabilidade única de configuração HTTP
 */
import axios, { AxiosInstance } from 'axios';
import { env } from './env';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: env.SYSLED_API_URL,
            timeout: env.SYSLED_API_TIMEOUT,
            headers: {
                'Authorization': env.SYSLED_API_TOKEN,
            },
        });
    }

    getInstance(): AxiosInstance {
        return this.client;
    }
}

export const apiClient = new ApiClient().getInstance();
