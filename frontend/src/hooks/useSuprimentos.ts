import { useQuery } from '@tanstack/react-query';
import { SuprimentosService } from '../services/suprimentos';

export function useSuprimentos() {
    return useQuery({
        queryKey: ['suprimentos'],
        queryFn: SuprimentosService.getAll,
        refetchInterval: 10000, // Polling fallback if SSE not used or as redundancy
    });
}
