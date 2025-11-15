// src/screens/admin/HistoricoPortas.tsx
import { Picker } from '@react-native-picker/picker';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { buscarTodasReservas, HistoricoItemAdmin } from '../services/HistoricoReservasadmin';

interface HistoricoItem extends HistoricoItemAdmin {}

type RootStackParamList = {
  Login: undefined;
  HistoricoPortas: { isAdmin?: boolean };
};

interface HistoricoPortasProps {
  route: { params?: { isAdmin?: boolean } };
}

export default function HistoricoPortas({ route }: HistoricoPortasProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const isAdmin = route?.params?.isAdmin ?? true;

  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [ordenacao, setOrdenacao] = useState('recent');

  // Menus animados
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const filterAnim = useRef(new Animated.Value(0)).current;
  const sortAnim = useRef(new Animated.Value(0)).current;
  const filterButtonScale = useRef(new Animated.Value(1)).current;
  const sortButtonScale = useRef(new Animated.Value(1)).current;

  const loadReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await buscarTodasReservas();
      setHistorico(dados);
    } catch (err) {
      console.error(err);
      setError('Falha ao carregar o histórico de reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReservas(); }, []);

  // Animações popover
  useEffect(() => {
    Animated.timing(filterAnim, { toValue: showFilterMenu ? 1 : 0, duration: 200, useNativeDriver: true }).start();
  }, [showFilterMenu]);

  useEffect(() => {
    Animated.timing(sortAnim, { toValue: showSortMenu ? 1 : 0, duration: 200, useNativeDriver: true }).start();
  }, [showSortMenu]);

  const handleButtonPressIn = (type: 'filter' | 'sort') => {
    const anim = type === 'filter' ? filterButtonScale : sortButtonScale;
    Animated.spring(anim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handleButtonPressOut = (type: 'filter' | 'sort') => {
    const anim = type === 'filter' ? filterButtonScale : sortButtonScale;
    Animated.spring(anim, { toValue: 1, useNativeDriver: true }).start();
  };

  const closeMenus = () => { setShowFilterMenu(false); setShowSortMenu(false); };

  // Filtro e ordenação
  const historicoFiltrado = useMemo(() => {
    let result = historico.filter(item => {
      const dataFormatada = new Date(item.data).toLocaleDateString('pt-BR');
      return (
        (filtroUsuario ? item.usuario.toLowerCase().includes(filtroUsuario.toLowerCase()) : true) &&
        (filtroStatus ? item.status.toLowerCase().includes(filtroStatus.toLowerCase()) : true) &&
        (filtroPeriodo ? periodoMatch(item.data, filtroPeriodo) : true)
      );
    });

    if (ordenacao === 'recent') result.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    if (ordenacao === 'nome') result.sort((a, b) => a.usuario.localeCompare(b.usuario));
    if (ordenacao === 'porta') result.sort((a, b) => a.porta.localeCompare(b.porta));
    if (ordenacao === 'statusAtiva') result = result.filter(r => r.status === 'Ativa');
    if (ordenacao === 'statusConcluida') result = result.filter(r => r.status === 'Concluída');
    if (ordenacao === 'statusCancelada') result = result.filter(r => r.status === 'Cancelada');

    return result;
  }, [historico, filtroUsuario, filtroStatus, filtroPeriodo, ordenacao]);

  const periodoMatch = (dataISO: string, periodo: string) => {
    const data = new Date(dataISO);
    const hoje = new Date();
    if (periodo === 'today') return data.toDateString() === hoje.toDateString();
    if (periodo === '7days') return hoje.getTime() - data.getTime() <= 7 * 24 * 60 * 60 * 1000;
    if (periodo === '30days') return hoje.getTime() - data.getTime() <= 30 * 24 * 60 * 60 * 1000;
    return true;
  };

  if (!isAdmin) return (
    <View style={styles.loadingContainer}>
      <Text style={styles.blockedText}>Acesso restrito aos administradores.</Text>
    </View>
  );

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2c3e50" />
      <Text style={{ marginTop: 10 }}>Carregando histórico...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.loadingContainer}>
      <Text style={styles.blockedText}>{error}</Text>
      <TouchableOpacity onPress={loadReservas} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Reservas</Text>

      {/* Ações: filtro e ordenação */}
      <View style={styles.actionsRow}>
        <View style={styles.actionWrapper}>
          <Animated.View style={{ transform: [{ scale: filterButtonScale }] }}>
            <TouchableOpacity
              style={[styles.actionButton, showFilterMenu && styles.actionButtonActive]}
              onPress={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); }}
              onPressIn={() => handleButtonPressIn('filter')}
              onPressOut={() => handleButtonPressOut('filter')}
            >
              <Text style={styles.actionButtonText}>Filtro</Text>
            </TouchableOpacity>
          </Animated.View>

          {showFilterMenu && (
            <Animated.View style={[styles.popover, { opacity: filterAnim }]}>
              <TextInput
                style={styles.popoverInput}
                placeholder="Usuário"
                placeholderTextColor="rgba(148,163,184,0.7)"
                value={filtroUsuario}
                onChangeText={setFiltroUsuario}
              />
              <Picker
                selectedValue={filtroStatus}
                onValueChange={setFiltroStatus}
                style={styles.popoverPicker}
              >
                <Picker.Item label="Todos" value="" />
                <Picker.Item label="Ativa" value="Ativa" />
                <Picker.Item label="Concluída" value="Concluída" />
                <Picker.Item label="Cancelada" value="Cancelada" />
              </Picker>
              <Picker
                selectedValue={filtroPeriodo}
                onValueChange={setFiltroPeriodo}
                style={styles.popoverPicker}
              >
                <Picker.Item label="Todos" value="" />
                <Picker.Item label="Hoje" value="today" />
                <Picker.Item label="Últimos 7 dias" value="7days" />
                <Picker.Item label="Últimos 30 dias" value="30days" />
              </Picker>
              <TouchableOpacity onPress={() => { setFiltroUsuario(''); setFiltroStatus(''); setFiltroPeriodo(''); }}>
                <Text style={styles.popoverClearText}>Limpar filtros</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        <View style={styles.actionWrapper}>
          <Animated.View style={{ transform: [{ scale: sortButtonScale }] }}>
            <TouchableOpacity
              style={[styles.actionButton, showSortMenu && styles.actionButtonActive]}
              onPress={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); }}
              onPressIn={() => handleButtonPressIn('sort')}
              onPressOut={() => handleButtonPressOut('sort')}
            >
              <Text style={styles.actionButtonText}>Ordenar por</Text>
            </TouchableOpacity>
          </Animated.View>

          {showSortMenu && (
            <Animated.View style={[styles.popover, { opacity: sortAnim }]}>
              {[
                { label: 'Mais recentes', value: 'recent' },
                { label: 'Nome do usuário', value: 'nome' },
                { label: 'Porta', value: 'porta' },
                { label: 'Status: Ativa', value: 'statusAtiva' },
                { label: 'Status: Concluída', value: 'statusConcluida' },
                { label: 'Status: Cancelada', value: 'statusCancelada' },
              ].map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.sortOption, ordenacao === opt.value && styles.sortOptionActive]}
                  onPress={() => { setOrdenacao(opt.value); setShowSortMenu(false); }}
                >
                  <Text style={[styles.sortOptionText, ordenacao === opt.value && styles.sortOptionTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
        </View>
      </View>

      {/* Lista */}
      {historicoFiltrado.length === 0 ? (
        <Text style={styles.noRecords}>Nenhum registro encontrado com esses filtros.</Text>
      ) : (
        <FlatList
          data={historicoFiltrado}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const dataHora = new Date(item.data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
            return (
              <View style={styles.card}>
                <Text style={styles.porta}>{item.porta}</Text>
                <Text style={styles.info}>Usuário: {item.usuario}</Text>
                <Text style={styles.info}>Data/Hora: {dataHora}</Text>
                <Text style={[
                  styles.status,
                  item.status === 'Ativa' ? styles.statusAtiva :
                  item.status === 'Concluída' ? styles.statusConcluida :
                  styles.statusCancelada
                ]}>Status: {item.status}</Text>
              </View>
            );
          }}
        />
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1120', padding: 24, paddingTop: 32 },
  title: { fontSize: 26, fontWeight: '700', color: '#F8FAFC', marginBottom: 16 },
  actionsRow: { flexDirection: 'row', gap: 16, marginBottom: 20, flexWrap: 'wrap', justifyContent: 'center' },
  actionWrapper: { position: 'relative', zIndex: 30 },
  actionButton: { backgroundColor: 'rgba(15,23,42,0.85)', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 18, borderWidth: 1, borderColor: 'rgba(148,163,184,0.16)', alignItems: 'center' },
  actionButtonActive: { borderColor: 'rgba(56,189,248,0.55)', backgroundColor: 'rgba(56,189,248,0.12)' },
  actionButtonText: { color: '#E2E8F0', fontWeight: '600' },
  popover: { position: 'absolute', top: 54, left: 0, minWidth: 240, maxWidth: 280, backgroundColor: '#10192C', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: 'rgba(56,189,248,0.25)', zIndex: 40 },
  popoverInput: { backgroundColor: 'rgba(15,23,42,0.8)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(56,189,248,0.25)', padding: 10, color: '#E2E8F0', marginBottom: 10 },
  popoverPicker: { color: '#F8FAFC', marginBottom: 10 },
  popoverClearText: { color: '#38BDF8', fontWeight: '600', fontSize: 13 },
  sortOption: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(148,163,184,0.16)', backgroundColor: 'rgba(15,23,42,0.78)', marginBottom: 10 },
  sortOptionActive: { borderColor: '#22C55E', backgroundColor: 'rgba(34,197,94,0.12)' },
  sortOptionText: { color: 'rgba(226,232,240,0.86)', fontWeight: '600' },
  sortOptionTextActive: { color: '#22C55E' },
  card: { backgroundColor: 'rgba(15,23,42,0.85)', padding: 20, borderRadius: 18, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(148,163,184,0.1)' },
  porta: { fontSize: 17, fontWeight: '700', color: '#F8FAFC', marginBottom: 6 },
  info: { fontSize: 14, color: 'rgba(203,213,225,0.85)', marginBottom: 4 },
  status: { marginTop: 8, fontWeight: '700', fontSize: 14 },
  statusAtiva: { color: '#38BDF8' },
  statusConcluida: { color: '#22C55E' },
  statusCancelada: { color: '#F97316' },
  logoutButton: { backgroundColor: '#27ae60', paddingVertical: 12, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  noRecords: { textAlign: 'center', color: 'rgba(148,163,184,0.85)', marginTop: 20, fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  blockedText: { color: '#721c24', fontSize: 16, fontWeight: 'bold' },
});
