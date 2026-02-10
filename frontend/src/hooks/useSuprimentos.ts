import { useQuery } from '@tanstack/react-query';
import { SuprimentosService } from '../services/suprimentos';

export function useSuprimentos() {
    return useQuery({
        queryKey: ['suprimentos-dashboard'],
        queryFn: SuprimentosService.getDashboard,
        refetchInterval: 30000, // Refresh every 30s
        staleTime: 15000,       // Consider fresh for 15s
    });
}
