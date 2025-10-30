
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";

interface RegisterData {
    name: string;
    cpf: string;
    idade: number;
    accessLevel: number;
    email: string;
    password: string;
}

export const registerUserByadmin = async (userData: RegisterData): Promise<void> => {
   try {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: userData.name,
        cpf: userData.cpf,
        idade: userData.idade,
        accessLevel: userData.accessLevel,
        createdAt: new Date(),
    });
    console.log("Usuário registrado com UID:", user.uid);
}catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
   }
};
const db = getFirestore();
