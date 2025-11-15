import { getAuth } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";

interface ReservaInput {
  salaNome: string;
  dataReserva: string; // Ex: "DD/MM/AAAA" (formato usado no frontend)
  horaInicio: string; // Ex: "09:00"
  horaFim: string; // Ex: "10:00"
}

/**
 * 🔍 Verifica se a sala já possui uma reserva que se sobrepõe ao horário especificado.
 */
export const verificarConflitoReserva = async (data: ReservaInput): Promise<boolean> => {
  try {
    const db = getFirestore();

    // 1. Query para buscar reservas na mesma sala e mesma data
    const reservasRef = collection(db, "reservas");
    // Filtramos apenas pela sala e data, pois o conflito de horário é verificado no código.
    const q = query(
      reservasRef,
      where("salaNome", "==", data.salaNome),
      where("dataReserva", "==", data.dataReserva)
    );

    const reservasSnapshot = await getDocs(q);

    // Se não houver reservas para essa sala/data, não há conflito.
    if (reservasSnapshot.empty) {
      return false; 
    }

    // 2. Lógica de sobreposição de horário:
    const novaInicio = data.horaInicio;
    const novaFim = data.horaFim;

    let conflitoEncontrado = false;

    reservasSnapshot.forEach((doc) => {
      const reservaExistente = doc.data();
      const existenteInicio = reservaExistente.horaInicio;
      const existenteFim = reservaExistente.horaFim;

      // Conflito se: (Nova Início < Fim Existente) E (Nova Fim > Início Existente)
      if (novaInicio < existenteFim && novaFim > existenteInicio) {
        conflitoEncontrado = true;
      }
    });

    return conflitoEncontrado;

  } catch (error) {
    console.error("❌ Erro ao verificar conflito de reserva:", error);
    // Em caso de erro, por segurança, assume-se que há um conflito.
    return true; 
  }
};

// 🔹 Salvar uma nova reserva no Firestore (AGORA COM VERIFICAÇÃO)
export const reservarSala = async (data: ReservaInput) => {
  try {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuário não autenticado.");
      return { success: false, message: "Usuário não autenticado." };
    }

    // 1. Chamar a verificação de conflito antes de salvar
    const isConflito = await verificarConflitoReserva(data);

    if (isConflito) {
      console.warn("🚫 Conflito de reserva detectado.");
      return { 
        success: false, 
        message: "A sala já está reservada neste horário. Por favor, escolha outro." 
      };
    }

    // 2. Salvar a reserva (apenas se não houver conflito)
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

        