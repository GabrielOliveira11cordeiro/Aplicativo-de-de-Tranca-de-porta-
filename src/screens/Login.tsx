// src/screens/Login.tsx

import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
// Certifique-se de que o caminho para AppNavigator está correto
import { RootStackParamList } from '../navigation/AppNavigator';
import { loginUser } from '../services/LoginService';

// Tipagem da navegação baseada no AppNavigator
type LoginScreenNavigationProp = NavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Adicionado para UX

  const handleLogin = async () => {
    setStatusMessage(null);

    if (email.trim() === '' || password.trim() === '') {
      setStatusMessage('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true); // Inicia o carregamento

    try {
      // accessLevel será 1 (Admin), 2 ou 3 (User), ou 0 (Unknown)
      const accessLevel = await loginUser(email, password);

    // 🔑 LÓGICA DE NAVEGAÇÃO CORRIGIDA: compara com NÚMEROS
    if (accessLevel === 1) { // Nível 1: Admin
      navigation.navigate("AdminMain");
    } else{ // Nível 2 ou 3: Usuário
      navigation.navigate("UserMain");
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
          errorMessage = 'Muitas tentativas de login. Conta temporariamente bloqueada.';
          break;
        default:
          // Pega o corpo da mensagem de erro se disponível
          errorMessage = error.message; 
          break;
      }
      setStatusMessage(`Erro: ${errorMessage}`);
    } finally {
        setIsLoading(false); // Finaliza o carregamento, independentemente do resultado
    }
  };

 return (
  <View style={styles.container}>
    <Image
      source={require('../../assets/images/logo.jpeg')}
      style={styles.logo}
    />

    <Text style={styles.title}>Login</Text>

    <TextInput
      placeholder="Digite seu email"
      value={email}
      onChangeText={setEmail}
      style={styles.input}
    />

    <TextInput
      placeholder="Digite sua senha"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      style={styles.input}
    />

    <TouchableOpacity 
      style={styles.button} 
      onPress={handleLogin}
      disabled={isLoading}
    >
      <Text style={styles.buttonText}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Text>
    </TouchableOpacity>

    <Text style={styles.forgotPassword}>
      Esqueceu a senha? <Text style={styles.link}>REDEFINIR SENHA</Text>
    </Text>

    {statusMessage && (
      <Text style={{ color: 'red', marginTop: 10 }}>{statusMessage}</Text>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1120',
    position: 'relative',
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(56, 189, 248, 0.35)',
  },
  blobTopLeft: {
    top: -90,
    left: -60,
    backgroundColor: 'rgba(99, 102, 241, 0.42)',
  },
  blobBottomRight: {
    bottom: -120,
    right: -80,
    backgroundColor: 'rgba(16, 185, 129, 0.38)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoWrapper: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 12,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'cover',
    borderRadius: 80,
    overflow: 'hidden',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(226, 232, 240, 0.7)',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 28,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.16)',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    color: '#E2E8F0',
    fontSize: 16,
  },
  inputFocused: {
    borderColor: '#22C55E',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 20,
    color: 'rgba(226, 232, 240, 0.7)',
    fontSize: 14,
  },
  link: {
    color: '#38BDF8',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});