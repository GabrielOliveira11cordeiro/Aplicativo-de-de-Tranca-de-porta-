import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";


export interface CadastrarSalaData {
  nomeSala: string;
  descricao: string;
  salaacessolevel: string; 
}


export const cadastrarSala = async (data: CadastrarSalaData) => {
  try {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuário não autenticado.");
      return { success: false, message: "Usuário não autenticado." };
    }

    
    const userAccessLevelStr = await AsyncStorage.getItem("userAccessLevel");
    const userAccessLevel = userAccessLevelStr ? Number(userAccessLevelStr) : 3;

    console.log("👤 Nível do usuário logado:", userAccessLevel);

    
    if (userAccessLevel !== 1) {
      console.warn("Usuário sem permissão para criar salas.");
      return {
        success: false,
        message: "Apenas usuários de nível 1 podem cadastrar salas.",
      };
    }

    
    const salaRef = doc(db, "salas", data.nomeSala);
    await setDoc(salaRef, {
      nomeSala: data.nomeSala,
      descricao: data.descricao,
      salaacessolevel: String(data.salaacessolevel),
      createdBy: user.email,
      createdAt: new Date(),
    });

    console.log("✅ Sala cadastrada com sucesso!");
    return { success: true, message: "Sala cadastrada com sucesso!" };

  } catch (error: any) {
    console.error("❌ Erro ao cadastrar sala:", error);
    return { success: false, message: error.message || "Erro ao cadastrar sala." };
  }
};


export interface SalaOption {
  label: string;
  value: string;
  salaacessolevel: string;
}

export const buscarSalas = async (): Promise<SalaOption[]> => {
  try {
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuário não autenticado.");
      return [];
    }

    
    const userAccessLevelStr = await AsyncStorage.getItem("userAccessLevel");
    const nivelAcessoUsuario = userAccessLevelStr ? String(userAccessLevelStr) : "3";

    console.log("👤 Nível do usuário logado:", nivelAcessoUsuario);

  
    const salasSnapshot = await getDocs(collection(db, "salas"));

  
    const salasFiltradas: SalaOption[] = salasSnapshot.docs
      .map((doc) => {
        const dados = doc.data();
        return {
          label: dados.nomeSala,
          value: dados.nomeSala,
          salaacessolevel: dados.salaacessolevel,
        };
      })
      .filter((sala) => Number(nivelAcessoUsuario) <= Number(sala.salaacessolevel));

    return salasFiltradas;

  } catch (error) {
    console.error("❌ Erro ao buscar salas:", error);
    return [];
  }
};
