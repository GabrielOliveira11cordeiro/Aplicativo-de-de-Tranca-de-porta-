// src/screens/CadastrarSala.js
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import { cadastrarSala } from '../services/CadastrarSala';

export default function CadastrarSala() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [nivelAcesso, setNivelAcesso] = useState('');
  const navigation = useNavigation();

  const handleCadastrar = async () => {
    if (!nome || !descricao || !nivelAcesso) {
      return Alert.alert('Erro', 'Preencha todos os campos!');
    }

    // Validação de Nível de Acesso (1 a 3)
    const accessLevelNum = parseInt(nivelAcesso);
    if (isNaN(accessLevelNum) || accessLevelNum < 1 || accessLevelNum > 3) {
      return Alert.alert('Erro', 'Nível de acesso inválido. Use um número entre 1 e 3.');
    }

    const salaData = {
        nomeSala: nome,
        descricao,
        salaacessolevel: nivelAcesso,
    }
    try {

      const res = await cadastrarSala(salaData);

      if (res.sucess) {
        Alert.alert('Sucesso', 'Sala cadastrada com sucesso!');
        setNome('');
        setDescricao('');
        setNivelAcesso('');
        navigation.navigate('Reservas' as never);
      } else {
        Alert.alert('Erro', 'Falha ao cadastrar a sala.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível cadastrar a sala.');
    }
  };

  return (
    <View style={styles.container}>
      <Input label="Identificação da sala" value={nome} onChangeText={setNome} />
      <Input label="Descrição" value={descricao} onChangeText={setDescricao} />
      <Input
        label="Nível de acesso"
        value={nivelAcesso}
        onChangeText={setNivelAcesso}
        placeholder="ex: 1, 2 ou 3"
        keyboardType="numeric"
      />
      <Button title="Cadastrar" onPress={handleCadastrar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
