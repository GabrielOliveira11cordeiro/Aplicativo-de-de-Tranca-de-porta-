// src/screens/CadastrarSala.js
import { useState } from 'react';
import { Alert, View } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import { api } from '../services/api';

export default function CadastrarSala() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nivelAcesso, setNivelAcesso] = useState('');

  const handleCadastrar = async () => {
    if (!nome) return Alert.alert('Erro', 'Nome é obrigatório');
    const res = await api.cadastrarSala({ nome, descricao, nivelAcesso });
    if (res.success) Alert.alert('Sucesso', 'Sala cadastrada');
    else Alert.alert('Erro', 'Falha ao cadastrar');
  };

  return (
    <View style={{ padding: 16 }}>
      <Input label="Identificação da sala" value={nome} onChangeText={setNome} />
      <Input label="Descrição" value={descricao} onChangeText={setDescricao} />
      <Input label="Nível de acesso" value={nivelAcesso} onChangeText={setNivelAcesso} placeholder="ex: 0,1,2" />
      <Button title="Cadastrar" onPress={handleCadastrar} />
    </View>
  );
}
