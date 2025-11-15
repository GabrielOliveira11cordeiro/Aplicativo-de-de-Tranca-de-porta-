import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Input from '../components/Input';
import { registerUserByadmin } from '../services/CadastroUsuario';
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

  const navigation = useNavigation();

  const handleRegister = async () => {
    setStatusMessage(null);

    if (!nome || !cpf || !idade || !accessLevel || !email || !password) {
      setStatusMessage("⚠️ Preencha todos os campos.");
      return;
    }

    if (!validaCPF(cpf)) {
      setStatusMessage("⚠️ CPF inválido.");
      return;
    }

    const accessLevelNum = Number(accessLevel);
    if (isNaN(accessLevelNum) || accessLevelNum < 1 || accessLevelNum > 3) {
      setStatusMessage("⚠️ Nível de acesso deve ser entre 1 e 3.");
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        email,
        password,
        name: nome,
        cpf,
        idade: Number(idade),
        accessLevel: accessLevelNum as 1 | 2 | 3,
      };

      await registerUserByadmin(userData);

      setStatusMessage("✅ Usuário registrado com sucesso!");

      setNome('');
      setCpf('');
      setIdade('');
      setAccessLevel('');
      setEmail('');
      setPassword('');

      setTimeout(() => {
        navigation.navigate("Login" as never);
      }, 1500);

    } catch (error: any) {
      setStatusMessage(`❌ Erro: ${error?.message || "Falha ao registrar"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Cadastrar Novo Usuário</Text>
        <Text style={styles.subtitle}>Preencha os dados do novo membro.</Text>

        <Input label="Nome Completo" value={nome} onChangeText={setNome} editable={!isLoading} />
        <Input label="CPF" keyboardType="numeric" value={cpf} onChangeText={setCpf} editable={!isLoading} />
        <Input label="Idade" keyboardType="numeric" value={idade} onChangeText={setIdade} editable={!isLoading} />

        <Input
          label="Nível de Acesso"
          placeholder="Insira 1, 2 ou 3"
          keyboardType="numeric"
          maxLength={1}
          value={accessLevel}
          onChangeText={setAccessLevel}
          editable={!isLoading}
        />

        <Input label="E-mail" keyboardType="email-address" value={email} onChangeText={setEmail} editable={!isLoading} />

        <Input label="Senha" secureTextEntry value={password} onChangeText={setPassword} editable={!isLoading} />

        {/* 🔥 Correção aqui */}
        {statusMessage && (
          <View
            style={[
              styles.statusBox,
              statusMessage.startsWith("✅")
                ? styles.statusSuccess
                : styles.statusError,
            ]}
          >
            <Text style={styles.statusText}>{statusMessage}</Text>
          </View>
        )}

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
    flex: 1,
  backgroundColor: '#0B1120',
  },
  content: {
    padding: 24,
  },
  card: {
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#f8fafc",
    marginBottom: 18,
  },
  statusBox: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  statusSuccess: {
    backgroundColor: "rgba(34,197,94,0.25)",
    borderWidth: 1,
    borderColor: "#22c55e",
  },
  statusError: {
    backgroundColor: "rgba(239,68,68,0.25)",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  statusText: {
    color: "#fff",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
