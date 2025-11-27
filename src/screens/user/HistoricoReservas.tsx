
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { buscarReservasDoUsuario } from '../../services/HistoricoReserva';

interface Reserva {
  id: string;
  porta: string;
  data: string;
  horaInicio: string;
  horaFim: string;
}

type RootStackParamList = {
  HistoricoReservas: undefined;
  Login: undefined;
  Home: undefined;
};

export default function HistoricoReservas() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [historico, setHistorico] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistorico = async () => {
    setLoading(true);
    setError(null);
    try {
      const dadosReservas = await buscarReservasDoUsuario();
      setHistorico(dadosReservas);
    } catch (err) {
      console.error("Erro ao carregar histórico: ", err);
      setError("Não foi possível carregar o histórico de reservas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistorico();
  }, []);

  const handleVoltar = () => navigation.goBack();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27ae60" />
        <Text>Carregando histórico...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red', fontSize: 16, textAlign: 'center' }}>{error}</Text>
        
        <TouchableOpacity style={styles.largeButton} onPress={loadHistorico}>
          <Text style={styles.largeButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Reservas</Text>

      {historico.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.loadingText}>Nenhuma reserva encontrada.</Text>
        </View>
      ) : (
        <FlatList
          data={historico}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.porta}>Porta: {item.porta}</Text>
              <Text style={styles.date}>Data: {item.data}</Text>
              <Text style={styles.hora}>Horário: {item.horaInicio} - {item.horaFim}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.largeButton} onPress={handleVoltar}>
        <Text style={styles.largeButtonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1120', paddingHorizontal: 24, paddingTop: 50 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B1120' },
  loadingText: { marginTop: 12, color: 'rgba(148,163,184,0.9)', fontSize: 15 },

  largeButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  largeButtonText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 16,
  },

  title: { fontSize: 24, fontWeight: '700', color: '#F8FAFC', marginBottom: 16 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15,23,42,0.85)', borderRadius: 20, paddingVertical: 40, paddingHorizontal: 20, borderWidth: 1, borderColor: 'rgba(148,163,184,0.12)' },
  card: { backgroundColor: 'rgba(15,23,42,0.85)', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: 'rgba(148,163,184,0.12)', elevation: 8, marginBottom: 15 },
  date: { color: 'rgba(203,213,225,0.8)', fontSize: 14, fontWeight: '600' },
  porta: { color: '#F8FAFC', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  hora: { color: 'rgba(203,213,225,0.85)', fontSize: 15, fontWeight: '500' },
});
