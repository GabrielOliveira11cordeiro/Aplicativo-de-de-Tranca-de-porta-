// src/services/HistoricoService.ts

import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";

// 🔹 Interface dos Dados Salvos no Firestore
// (Corresponde aos campos da ReservaInput, mas lidos do documento)
interface DadosFirestoreReserva {
  salaNome: string;
  dataReserva: string; // Ex: "DD/MM/AAAA"
  horaInicio: string; 
  horaFim: string; 
  userEmail: string; // Campo usado para o filtro
}

// 🔹 Interface de Saída (O que a tela HistoricoReservas.tsx espera)
interface HistoricoReservaItem {
  id: string;
  porta: string; // Mapeado de salaNome
  data: string; // Mapeado de dataReserva
  horaInicio: string;
  horaFim: string;
}

/**
 * Busca as reservas no Firestore, filtrando apenas pelo usuário logado (userEmail).
 * Mapeia os dados do Firestore (salaNome, dataReserva) para o formato da tela (porta, data).
 */
export const buscarReservasDoUsuario = async (): Promise<HistoricoReservaItem[]> => {
    try {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;

        // 1. Verificação de Autenticação
        if (!user || !user.email) {
            console.error("Usuário não autenticado. Retornando lista vazia.");
            return [];
        }

        const reservasRef = collection(db, "reservas");
        
        // 2. Criação da Query com Filtro
        const q = query(
            reservasRef,
            where("userEmail", "==", user.email)
        );
        
        const reservasSnapshot = await getDocs(q);
        const reservasList: HistoricoReservaItem[] = [];

        reservasSnapshot.forEach((doc) => {
            // 3. Tipagem e Mapeamento
            const reservaDataFirestore = doc.data() as DadosFirestoreReserva;
            
            // Verificação de segurança para evitar erro de .split
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
        
        // 4. Ordenação por Data (do mais recente para o mais antigo)
        const ordenado = reservasList.sort(
            (a, b) => {
                // Converte a data (DD/MM/AAAA) para um objeto Date para comparação
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