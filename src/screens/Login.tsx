

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

import { RootStackParamList } from '../navigation/AppNavigator';
import { loginUser } from '../services/LoginService';


type LoginScreenNavigationProp = NavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); 

  const handleLogin = async () => {
    setStatusMessage(null);

    if (email.trim() === '' || password.trim() === '') {
      setStatusMessage('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true); 

    try {
      
      const accessLevel = await loginUser(email, password);

    
    if (accessLevel === 1) { 
      navigation.navigate("AdminMain");
    } else{ 
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
          
          errorMessage = error.message; 
          break;
      }
      setStatusMessage(`Erro: ${errorMessage}`);
    } finally {
        setIsLoading(false); 
    }
  };

 return (
    <View style={styles.container}>
      
      {/* Círculos decorativos */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      {/* Logo */}
      <Image 
        source={require('../../assets/images/logo.jpeg')} 
        style={styles.logo} 
      />

      {/* Texto de boas-vindas */}
      <Text style={styles.welcome}>Bem-vindo de volta</Text>
      <Text style={styles.subtitle}>Acesse sua conta para gerenciar as reservas</Text>

      {/* Inputs estilo linha */}
      <TextInput
        placeholder="Digite seu email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Digite sua senha"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* Botão */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.forgotPassword}>
        Esqueceu a senha? <Text style={styles.link}>Redefinir</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E1B30',
    paddingHorizontal: 20,
  },

  
  circleTop: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 300,
    backgroundColor: '#1C3B70',
    top: -120,
    left: -80,
    opacity: 0.4,
  },
  circleBottom: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: '#1C3B70',
    bottom: -100,
    right: -60,
    opacity: 0.35,
  },

  logo: {
    width: 140,
    height: 140,
    resizeMode: 'cover',
    borderRadius: 70,
    marginBottom: 10,
  },

  welcome: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },

  subtitle: {
    color: '#d0d0d0',
    fontSize: 14,
    marginBottom: 30,
  },

  input: {
    width: '90%',
    borderBottomWidth: 1,
    borderBottomColor: '#6AA9E9',
    color: '#fff',
    paddingVertical: 8,
    marginBottom: 20,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#27AE60',
    paddingVertical: 12,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  forgotPassword: {
    marginTop: 15,
    color: '#ccc',
  },

  link: {
    color: '#6AA9E9',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});