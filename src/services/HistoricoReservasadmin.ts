// src/services/HistoricoAdminService.ts

import { collection, getDocs, getFirestore } from "firebase/firestore";

// Interface dos dados lidos DIRETAMENTE do Firestore
interface DadosFirestoreReservaAdmin {
  salaNome: string;
  dataReserva: string; // Ex: "DD/MM/AAAA"
  horaInicio: string; 
  horaFim: string; 
  userEmail: string;
}

// Interface de saída (o que o componente HistoricoPortas.tsx espera)
export interface HistoricoItemAdmin {
  id: string;
  porta: string; // Mapeado de salaNome
  usuario: string; // Mapeado de userEmail
  data: string; // Data no formato ISO para fácil ordenação
  status: 'Ativa' | 'Concluída' | 'Cancelada' | string; // O status precisa ser definido ou calculado
}

/**
 * Busca TODAS as reservas no Firestore para visualização do administrador.
 */
export const buscarTodasReservas = async (): Promise<HistoricoItemAdmin[]> => {
    try {
        const db = getFirestore();
        const reservasRef = collection(db, "reservas");
        
        // Não usamos 'query' nem 'where', pois queremos todos os documentos
        const reservasSnapshot = await getDocs(reservasRef);
        const reservasList: HistoricoItemAdmin[] = [];

        reservasSnapshot.forEach((doc) => {
            const data = doc.data() as DadosFirestoreReservaAdmin;
            
            // ⚠️ NOTA IMPORTANTE: O STATUS não é salvo no Firestore.
            // Para ter o STATUS ('Ativa' / 'Concluída'), você deve calcular:
            // 1. Combine dataReserva + horaFim para criar a data/hora de término.
            // 2. Compare com a data/hora atual (new Date()).

            // Exemplo de cálculo básico de Status:
            const dataFimStr = `${data.dataReserva.split('/').reverse().join('-')}T${data.horaFim}:00`;
            const dataFimReserva = new Date(dataFimStr);
            const statusCalculado = dataFimReserva > new Date() ? 'Ativa' : 'Concluída';

            // Mapeamento para a interface de saída (HistoricoItemAdmin)
            reservasList.push({
                id: doc.id,
                porta: data.salaNome,
                usuario: data.userEmail, // Usamos o e-mail como nome de usuário para simplificar
                // Retornamos a data no formato ISO da reserva para ordenação e filtro
                data: `${data.dataReserva.split('/').reverse().join('-')}T${data.horaInicio}:00`, 
                status: statusCalculado,
            });
        }); 
        
        // A ordenação será feita no componente (ou aqui, se preferir)
        return reservasList;

    } catch (error) {
        console.error("❌ Erro ao buscar todas as reservas para o Admin:", error);
        // Em caso de falha, retorne um array vazio
        return [];
    }   
};