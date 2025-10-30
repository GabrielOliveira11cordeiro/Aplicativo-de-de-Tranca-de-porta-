import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Assumindo que o serviço loginUser retorna 'admin' ou 'user'
import { loginUser } from '../services/LoginService';

// 1. Definição do Tipo de Rotas (RootStackParamList)
// O StackNavigator principal tem as rotas 'Login' e 'Main'.
// A rota 'Main' aceita um parâmetro 'screen' para abrir uma aba específica.
type RootStackParamList = {
    Login: undefined;
    Main: { screen: 'Reservas' | 'CadastrarUsuario' | 'CadastrarSala' };
};

// 2. Tipagem Customizada do Navigation Prop
type LoginScreenNavigationProp = NavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  // 3. Aplicação do Tipo ao useNavigation
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setStatusMessage(null);

    if (email.trim() === '' || password.trim() === '') {
      setStatusMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // accessLevel deve ser 'admin' ou 'user'
      const accessLevel = await loginUser(email, password); 

      if (accessLevel === 'admin') {
        // Navegação agora tipada e sem o erro 'never'
        navigation.navigate('Main', { screen: 'CadastrarUsuario' }); 
      } else if (accessLevel === 'user') {
        // Navegação agora tipada e sem o erro 'never'
        navigation.navigate('Main', { screen: 'Reservas' }); 
      } else {
        setStatusMessage('Nível de acesso desconhecido. Contate o administrador.');
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
      <Text style={styles.title}>Login</Text>

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

      {statusMessage && <Text style={styles.error}>{statusMessage}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
