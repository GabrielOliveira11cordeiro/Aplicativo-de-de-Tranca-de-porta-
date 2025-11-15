// src/screens/CadastrarSala.js
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
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

    const accessLevelNum = parseInt(nivelAcesso);
    if (isNaN(accessLevelNum) || accessLevelNum < 1 || accessLevelNum > 3) {
      return Alert.alert('Erro', 'Nível de acesso inválido. Use um número entre 1 e 3.');
    }

    const salaData = {
      nomeSala: nome,
      descricao,
      salaacessolevel: nivelAcesso,
    };

    try {
      const res = await cadastrarSala(salaData);

      if (res.success) {
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
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>Cadastro de Salas</Text>
          <Text style={styles.subtitle}>
            Configure novas salas e defina níveis de acesso.
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Input
            label="Identificação da sala"
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Sala 101"
          />

          <Input
            label="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Ex: Sala de reunião"
          />

          <Input
            label="Nível de acesso"
            value={nivelAcesso}
            onChangeText={setNivelAcesso}
            placeholder="1, 2 ou 3"
            keyboardType="numeric"
          />

          <Button title="Cadastrar" onPress={handleCadastrar} />
        </View>
      </ScrollView>
    </View>
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(148, 163, 184, 0.9)',
    lineHeight: 22,
  },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
});
