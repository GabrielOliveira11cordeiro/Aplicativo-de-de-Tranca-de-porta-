import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

interface RegisterData {
    name: string;
    cpf: string;
    idade: number;
    accessLevel: number;
    email: string;
    password: string;
}

export const registerUserByadmin = async (email: string, password: string): Promise<void> => {
   try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
    });
    console.log("Usuário registrado com UID:", user.uid);
}catch (error) {
    console.error("Erro ao registrar usuário:", error);
    throw error;
   }
};