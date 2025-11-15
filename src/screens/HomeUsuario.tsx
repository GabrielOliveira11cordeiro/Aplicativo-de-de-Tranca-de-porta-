import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Importa a função real
import { buscarReservasDoUsuario } from '../services/HistoricoReserva';

interface Reserva {
  id: string;
  porta: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  status: 'Ativa' | 'Concluída' | 'Cancelada';
}

export default function HomeUsuario() {
  const navigation = useNavigation();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReservas = async () => {
    try {
      setLoading(true);
      const dados = await buscarReservasDoUsuario();
      setReservas(dados as Reserva[]);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservas();
  }, []);

  const handleReservarPorta = () => navigation.navigate('Reservas' as never);
  const handleHistorico = () => navigation.navigate('HistoricoReservas' as never);
  const handleLogout = () => navigation.navigate('Login' as never);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Carregando suas reservas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá novamente</Text>
          <Text style={styles.title}>Minhas Reservas</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={22} color="#F8FAFC" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* AÇÕES */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionCard} onPress={handleReservarPorta} activeOpacity={0.9}>
          <View style={styles.actionIcon}>
            <Ionicons name="calendar-outline" size={26} color="#0F172A" />
          </View>
          <View style={styles.actionTexts}>
            <Text style={styles.actionTitle}>Reservar Sala</Text>
            <Text style={styles.actionSubtitle}>Faça uma nova reserva em poucos toques</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={handleHistorico} activeOpacity={0.9}>
          <View style={[styles.actionIcon, styles.historyIcon]}>
            <Ionicons name="time-outline" size={26} color="#0F172A" />
          </View>
          <View style={styles.actionTexts}>
            <Text style={styles.actionTitle}>Ver Histórico</Text>
            <Text style={styles.actionSubtitle}>Consulte reservas anteriores e detalhes</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Reservas Ativas</Text>

      {reservas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-clear-outline" size={44} color="rgba(148, 163, 184, 0.7)" />
          <Text style={styles.emptyTitle}>Nenhuma reserva ativa</Text>
          <Text style={styles.emptySubtitle}>Que tal reservar uma sala agora mesmo?</Text>

          <TouchableOpacity style={styles.emptyButton} onPress={handleReservarPorta} activeOpacity={0.88}>
            <Text style={styles.emptyButtonText}>Reservar Sala</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Ionicons name="key-outline" size={16} color="#0F172A" />
                </View>

                <Text
                  style={[
                    styles.status,
                    statusStyles[item.status as keyof typeof statusStyles] ?? styles.statusDefault,
                  ]}
                >
                  {item.status}
                </Text>
              </View>

              <Text style={styles.porta}>{item.porta}</Text>

              <View style={styles.cardRow}>
                <Ionicons name="calendar-number-outline" size={18} color="rgba(148, 163, 184, 0.8)" />
                <Text style={styles.cardInfo}>{item.data}</Text>
              </View>

              <View style={styles.cardRow}>
                <Ionicons name="time-outline" size={18} color="rgba(148, 163, 184, 0.8)" />
                <Text style={styles.cardInfo}>
                  {item.horaInicio} - {item.horaFim}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const statusStyles = StyleSheet.create({
  Ativa: { color: '#22C55E' },
  Concluída: { color: '#38BDF8' },
  Cancelada: { color: '#F97316' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1120' },
  content: { paddingHorizontal: 24, paddingTop: 50, paddingBottom: 40 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B1120' },
  loadingText: { marginTop: 12, color: 'rgba(148, 163, 184, 0.9)', fontSize: 15 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 14, color: 'rgba(148, 163, 184, 0.9)', marginBottom: 6 },
  title: { fontSize: 28, color: '#F8FAFC', fontWeight: '700' },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.25)',
  },
  logoutText: { color: '#22C55E', fontWeight: '600', marginLeft: 6 },

  actionsRow: { gap: 14, marginBottom: 30 },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },
  actionIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  historyIcon: { backgroundColor: '#FACC15' },
  actionTexts: { flex: 1 },
  actionTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '600', marginBottom: 6 },
  actionSubtitle: { color: 'rgba(203, 213, 225, 0.8)', fontSize: 14, lineHeight: 19 },

  sectionTitle: { color: '#E2E8F0', fontSize: 16, fontWeight: '600', marginBottom: 16, letterSpacing: 0.3 },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
  },
  emptyTitle: { marginTop: 18, color: '#F8FAFC', fontSize: 18, fontWeight: '600' },
  emptySubtitle: { color: 'rgba(148, 163, 184, 0.85)', fontSize: 15, textAlign: 'center', marginTop: 6, marginBottom: 18 },

  emptyButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },
  emptyButtonText: { color: '#F8FAFC', fontWeight: '700', fontSize: 16 },

  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  status: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  statusDefault: { color: '#E2E8F0' },

  porta: { color: '#F8FAFC', fontSize: 20, fontWeight: '700', marginBottom: 12 },

  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  cardInfo: { color: 'rgba(203, 213, 225, 0.9)', fontSize: 15, fontWeight: '500' },
});
