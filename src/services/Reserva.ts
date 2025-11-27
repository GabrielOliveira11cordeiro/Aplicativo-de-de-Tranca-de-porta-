import { getAuth } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";

interface ReservaInput {
  salaNome: string;
  dataReserva: string; 
  horaInicio: string;
  horaFim: string; 
}


export const verificarConflitoReserva = async (data: ReservaInput): Promise<boolean> => {
  try {
    const db = getFirestore();

    
    const reservasRef = collection(db, "reservas");
    
    const q = query(
      reservasRef,
      where("salaNome", "==", data.salaNome),
      where("dataReserva", "==", data.dataReserva)
    );

    const reservasSnapshot = await getDocs(q);

    
    if (reservasSnapshot.empty) {
      return false; 
    }

   
    const novaInicio = data.horaInicio;
    const novaFim = data.horaFim;

    let conflitoEncontrado = false;

    reservasSnapshot.forEach((doc) => {
      const reservaExistente = doc.data();
      const existenteInicio = reservaExistente.horaInicio;
      const existenteFim = reservaExistente.horaFim;

      
      if (novaInicio < existenteFim && novaFim > existenteInicio) {
        conflitoEncontrado = true;
      }
    });

    return conflitoEncontrado;

  } catch (error) {
    console.error("❌ Erro ao verificar conflito de reserva:", error);

    return true; 
  }
};


export const reservarSala = async (data: ReservaInput) => {
  try {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuário não autenticado.");
      return { success: false, message: "Usuário não autenticado." };
    }

    
    const isConflito = await verificarConflitoReserva(data);

    if (isConflito) {
      console.warn("🚫 Conflito de reserva detectado.");
      return { 
        success: false, 
        message: "A sala já está reservada neste horário. Por favor, escolha outro." 
      };
    }

  
    const reservaId = `${user.uid}_${data.salaNome}_${Date.now()}`;

    const reservaRef = doc(db, "reservas", reservaId);
    await setDoc(reservaRef, {
      salaNome: data.salaNome,
      dataReserva: data.dataReserva,
      horaInicio: data.horaInicio,
      horaFim: data.horaFim,
      userEmail: user.email,
      createdAt: new Date(),
    });

    console.log("✅ Reserva salva com sucesso!");
    return { success: true, message: "Reserva salva com sucesso!" };
  } catch (error) {
    console.error("❌ Erro ao salvar reserva:", error);
    return { success: false, message: "Erro ao salvar reserva." };
  }
};
interface reservas {
      salaNome: string;
          dataReserva: string;
              horaInicio: string;
              horaFim: string;
}

        