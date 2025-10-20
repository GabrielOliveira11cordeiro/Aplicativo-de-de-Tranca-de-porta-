// src/screens/CadastrarUsuario.js
import { useState } from 'react';
import { Alert, View } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import { api } from '../services/api';

export default function CadastrarUsuario() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastrar = async () => {
    if (!nome || !cpf || !email || !senha) return Alert.alert('Erro', 'Preencha todos os campos');
    const res = await api.cadastrarUsuario({ nome, cpf, email, senha });
    if (res.success) Alert.alert('Sucesso', 'Usuário cadastrado');
    else Alert.alert('Erro', 'Falha ao cadastrar');
  };

  return (
    <View style={{ padding: 16 }}>
      <Input label="Nome completo" value={nome} onChangeText={setNome} />
      <Input label="CPF" value={cpf} onChangeText={setCpf} />
      <Input label="Email" value={email} onChangeText={setEmail} />
      <Input label="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
      <Button title="Cadastrar" onPress={handleCadastrar} />
    </View>
  );
}
