

import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";


interface DadosFirestoreReserva {
  salaNome: string;
  dataReserva: string; 
  horaInicio: string; 
  horaFim: string; 
  userEmail: string; 
}


interface HistoricoReservaItem {
  id: string;
  porta: string; 
  data: string; 
  horaInicio: string;
  horaFim: string;
}


export const buscarReservasDoUsuario = async (): Promise<HistoricoReservaItem[]> => {
    try {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;

    
        if (!user || !user.email) {
            console.error("Usuário não autenticado. Retornando lista vazia.");
            return [];
        }

        const reservasRef = collection(db, "reservas");
        
        
        const q = query(
            reservasRef,
            where("userEmail", "==", user.email)
        );
        
        const reservasSnapshot = await getDocs(q);
        const reservasList: HistoricoReservaItem[] = [];

        reservasSnapshot.forEach((doc) => {
            
            const reservaDataFirestore = doc.data() as DadosFirestoreReserva;
            
            
            if (!reservaDataFirestore.dataReserva) {
                console.warn(`Aviso: Reserva ${doc.id} sem data. Ignorada.`);
                return; 
            }

            reservasList.push({
                id: doc.id,
                porta: reservaDataFirestore.salaNome,
                data: reservaDataFirestore.dataReserva,
                horaInicio: reservaDataFirestore.horaInicio,
                horaFim: reservaDataFirestore.horaFim,
            });
        }); 
        
        
        const ordenado = reservasList.sort(
            (a, b) => {
                
                const dateA = new Date(a.data.split('/').reverse().join('-')).getTime();
                const dateB = new Date(b.data.split('/').reverse().join('-')).getTime();
                return dateB - dateA; 
            }
        );
        
        return ordenado;
    } catch (error) {
        console.error("❌ Erro ao buscar reservas:", error);
        return [];
    }   
};