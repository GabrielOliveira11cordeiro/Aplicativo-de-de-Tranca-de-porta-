import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Button, StyleSheet, Text, View } from 'react-native';
import { auth } from '../../../config/firebaseConfig';

export default function AdminScreen() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('..'); // Redireciona para a tela de login após o logout
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Administrador</Text>
      <Text style={styles.subtitle}>Bem-vindo, Administrador!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Sair" onPress={handleLogout} color="#dc3545" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: '#555',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
});
