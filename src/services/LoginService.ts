import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig';

export const loginUser = async (email: string, password: string): Promise<'admin' | 'user' | 'unknown'> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            const level = userData.accessLevel;
            if (level === 1) {
                return 'admin';
            } else if (level === 2 || level === 3) {
                return 'user';
            }
        } 
        return 'unknown';
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
    }
};
