import { useNavigation } from '@react-navigation/native'; // Navegação via react-navigation
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Renomeado para a nova importação que forneceu:
import { registerUserByadmin } from '../services/CadastroUsuario';
// Assumindo que este caminho deve ser '../utils/validar' ou similar:
import Input from '../components/Input'; // Componente Input reutilizável
import { validaCPF } from '../utils/validar';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [idade, setIdade] = useState('');
  const [accessLevel, setAccessLevel] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hook para navegação
  const navigation = useNavigation();

  const handleRegister = async () => {
    setStatusMessage(null);

    // 1. Validação de campos vazios
    if (!nome.trim() || !cpf.trim() || !idade.trim() || !accessLevel.trim() || !email.trim() || !password.trim()) {
      setStatusMessage('⚠️ Por favor, preencha todos os campos.');
      return;
    }
    
    // 2. Validação de CPF
    if (!validaCPF(cpf)) {
      setStatusMessage('⚠️ CPF inválido. Por favor, insira um CPF válido.');
      return;
    }
    
    // 3. Validação de Nível de Acesso
    const accessLevelNum = parseInt(accessLevel); 
    if (isNaN(accessLevelNum) || accessLevelNum < 1 || accessLevelNum > 3) {   
      setStatusMessage('⚠️ Nível de acesso inválido. Insira um número entre 1 e 3.');
      return;
    }

    setIsLoading(true);

    try {
      // Ajustado o userData para o serviço de registo, que tipicamente só precisa de:
      // email, password, name e accessLevel (e talvez CPF/Idade, se o service for atualizado)
      const userData = {
          email: email,
          password: password,
          name: nome,
          cpf: cpf, // Incluído para consistência com o estado, mas pode ser ignorado pelo service
          idade: parseInt(idade), // Incluído para consistência com o estado
          accessLevel: accessLevelNum as 1 | 2 | 3 
      };
      
      // Chamada ao serviço com o nome de função que forneceu
      // Nota: Recomenda-se uniformizar o nome do serviço para 'registerUser'
      await registerUserByadmin(userData);

      setStatusMessage('✅ Usuário registrado com sucesso!');
      
      // Limpar campos
      setNome('');
      setCpf('');
      setIdade('');
      setAccessLevel('');
      setEmail('');
      setPassword('');

      // 4. Navegar para a tela de Login após o sucesso
      setTimeout(() => {
        // Usando o método navigate para a rota 'Login'
        navigation.navigate('Login' as never); 
      }, 1500);

    } catch (error: any) {
      setStatusMessage(`❌ Erro: ${error.message}`);
    } finally {
        setIsLoading(false);
    }
  };
  
    return (
     <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: '#f0f4f8' }}>
        <View style={styles.card}>
            <Text style={styles.title}>Cadastrar Novo Usuário</Text>
            <Text style={styles.subtitle}>Preencha os dados do novo membro.</Text>

            {/* Input para Nome */}
            <Input
              label="Nome Completo"
              placeholder="Nome completo"
              value={nome}
              onChangeText={setNome}
              editable={!isLoading}
            />

            {/* Input para CPF */}
            <Input
              label="CPF"
              placeholder="000.000.000-00"
              keyboardType="numeric"
              value={cpf}
              onChangeText={setCpf}
              editable={!isLoading}
            />

            {/* Input para Idade */}
            <Input
              label="Idade"
              placeholder="Ex: 30"
              keyboardType="numeric"
              value={idade}
              onChangeText={setIdade}
              editable={!isLoading}
            />

            {/* Input para Nível de Acesso */}
            <Input
              label="Nível de Acesso"
              placeholder="Insira 1, 2 ou 3"
              keyboardType="numeric"
              maxLength={1}
              value={accessLevel}
              onChangeText={setAccessLevel}
              editable={!isLoading}
            />

            {/* Input para E-mail */}
            <Input
              label="E-mail"
              placeholder="user@exemplo.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />

            {/* Input para Senha */}
            <Input
              label="Senha"
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />

            {/* Mensagem de Status */}
            {statusMessage && (
                <View style={[styles.statusBox, statusMessage.startsWith('✅') ? styles.statusSuccess : styles.statusError]}>
                    <Text style={styles.statusText}>{statusMessage}</Text>
                </View>
            )}

            {/* Botão de Cadastro */}
            <TouchableOpacity 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={handleRegister}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>CADASTRAR</Text>
                )}
            </TouchableOpacity>
        </View>
     </ScrollView>
   );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 20,
  },
  statusBox: {
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
  },
  statusSuccess: {
    backgroundColor: '#d1fae5',
    borderColor: '#34d399',
  },
  statusError: {
    backgroundColor: '#fee2e2',
    borderColor: '#f87171',
  },
  statusText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});
