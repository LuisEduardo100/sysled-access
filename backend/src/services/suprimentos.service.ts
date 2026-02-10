/**
 * SuprimentosServiceProxy
 * 
 * Re-exporta o Facade para manter compatibilidade com antigos imports
 * ou para uso futuro se lógica específica for necessária aqui.
 */

import { suprimentosFacade } from './suprimentos.facade';

export const suprimentosService = {
    getDashboard: () => suprimentosFacade.getDashboard(),
};
