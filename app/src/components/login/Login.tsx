import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { auth, db } from '../../../config/firebaseConfig';
import styles from './sLoginStyles';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const router = useRouter();
  const handleLogin = async () => {
    setStatusMessage(null);

    if (email.trim() === '' || password.trim() === '') {
      setStatusMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.isAdmin) {
          router.replace('./admin');
        } else {
          router.replace('../user');
        }
      } else {
        router.replace('..');
      }

    } catch (error: any) {
      let errorMessage = 'Ocorreu um erro. Tente novamente.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'O e-mail fornecido é inválido.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Não há usuário com este e-mail.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'A senha está incorreta.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas de login. Sua conta foi temporariamente bloqueada.';
          break;
        default:
          errorMessage = error.message;
          break;
      }
      setStatusMessage(`Erro: ${errorMessage}`);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça seu Login</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Entrar" onPress={handleLogin} color="#1E90FF" />
      </View>
      {statusMessage && (
        <Text style={
          { ...styles.statusMessage, 
            color: statusMessage.startsWith('Erro') ? 'red' : 'green' 
          }
        }>
          {statusMessage}
        </Text>
      )}
    </View>
  );
}
