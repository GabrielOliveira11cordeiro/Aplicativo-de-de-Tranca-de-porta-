

import { collection, getDocs, getFirestore } from "firebase/firestore";


interface DadosFirestoreReservaAdmin {
  salaNome: string;
  dataReserva: string; 
  horaInicio: string; 
  horaFim: string; 
  userEmail: string;
}


export interface HistoricoItemAdmin {
  id: string;
  porta: string; 
  usuario: string; 
  data: string; 
  status: 'Ativa' | 'Concluída' | 'Cancelada' | string; 
}


export const buscarTodasReservas = async (): Promise<HistoricoItemAdmin[]> => {
    try {
        const db = getFirestore();
        const reservasRef = collection(db, "reservas");
        
        
        const reservasSnapshot = await getDocs(reservasRef);
        const reservasList: HistoricoItemAdmin[] = [];

        reservasSnapshot.forEach((doc) => {
            const data = doc.data() as DadosFirestoreReservaAdmin;
            
            

            
            const dataFimStr = `${data.dataReserva.split('/').reverse().join('-')}T${data.horaFim}:00`;
            const dataFimReserva = new Date(dataFimStr);
            const statusCalculado = dataFimReserva > new Date() ? 'Ativa' : 'Concluída';

            
            reservasList.push({
                id: doc.id,
                porta: data.salaNome,
                usuario: data.userEmail, 
                data: `${data.dataReserva.split('/').reverse().join('-')}T${data.horaInicio}:00`, 
                status: statusCalculado,
            });
        }); 
        
        
        return reservasList;

    } catch (error) {
        console.error("❌ Erro ao buscar todas as reservas para o Admin:", error);
        
        return [];
    }   
};