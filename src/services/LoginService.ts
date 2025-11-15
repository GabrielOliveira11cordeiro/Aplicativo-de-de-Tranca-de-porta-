// src/services/LoginService.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebaseConfig";


export const loginUser = async (
  email: string,
  password: string
): Promise<1 | 2 | 3 | 0> => { 
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();

  
      const currentLevel = Number(userData.accessLevel ?? 3); 

      
      await AsyncStorage.setItem("userAccessLevel", String(currentLevel));


      return currentLevel as 1 | 2 | 3;
    }

    return 0; 
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};