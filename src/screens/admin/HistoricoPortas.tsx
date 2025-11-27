
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { buscarTodasReservas, HistoricoItemAdmin } from '../../services/HistoricoReservasadmin';


import Input from '@/src/components/Input';

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

  
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [ordenacao, setOrdenacao] = useState('recent');
  
  
  const [filtroData, setFiltroData] = useState(''); 

  
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

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  useEffect(() => { loadReservas(); }, []);

  
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

  const periodoMatch = (dataISO: string, periodo: string) => {
    const data = new Date(dataISO);
    const hoje = new Date();
    if (periodo === 'today') return data.toDateString() === hoje.toDateString();
    if (periodo === '7days') return hoje.getTime() - data.getTime() <= 7 * 24 * 60 * 60 * 1000;
    if (periodo === '30days') return hoje.getTime() - data.getTime() <= 30 * 24 * 60 * 60 * 1000;
    return true;
  };

  
  const historicoFiltrado = useMemo(() => {
    let result = historico.filter(item => {
      
      
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
  }, [historico, filtroUsuario, filtroStatus, filtroPeriodo, ordenacao, filtroData]);


  if (!isAdmin) return (
    <View style={styles.loadingContainer}>
      <Text style={styles.blockedText}>Acesso restrito aos administradores.</Text>
    </View>
  );

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2c3e50" />
      <Text style={{ marginTop: 10, color: '#fff' }}>Carregando histórico...</Text>
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

      {/* Círculos decorativos */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      <Text style={styles.title}>Histórico de Portas</Text>

      {/* Filtros - USANDO DARKINPUT */}
      <View style={styles.filtros}>
        <Input
          placeholder="Filtrar por usuário"
          value={filtroUsuario}
          onChangeText={setFiltroUsuario}
          style={styles.input}
        />
        <Input
          placeholder="Filtrar por status (Ativa/Concluída/Cancelada)"
          value={filtroStatus}
          onChangeText={setFiltroStatus}
          style={styles.input}
        />
        <Input
          placeholder="Filtrar por data (dd/mm/aaaa)"
          value={filtroData} 
          onChangeText={setFiltroData}
          style={styles.input}
        />
      </View>

      {/* Lista */}
      {historicoFiltrado.length === 0 ? (
        <Text style={styles.noRecords}>Nenhum registro encontrado.</Text>
      ) : (
        <FlatList
          data={historicoFiltrado}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const dataHora = new Date(item.data).toLocaleString('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'short',
            });
            return (
              <View style={styles.card}>
                <Text style={styles.porta}>{item.porta}</Text>
                <Text style={styles.info}>Usuário: <Text style={styles.infoValue}>{item.usuario}</Text></Text>
                <Text style={styles.info}>Data/Hora: <Text style={styles.infoValue}>{dataHora}</Text></Text>

                <Text
                  style={[
                    styles.status,
                    item.status === 'Ativa' ? styles.statusAtiva :
                    item.status === 'Concluída' ? styles.statusConcluida :
                    styles.statusCancelada
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            );
          }}
        />
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#0d1b2a',
    padding: 24,
  },
  input: {
    color: '#fff',
    borderColor: '#374151',
    backgroundColor: '#1F2937',
  },  

  title: { 
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 70,
    marginBottom: 25,
    textAlign: 'left',
  },

  filtros: { marginBottom: 10 },

  

  card: {
    backgroundColor: '#1C3B70',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },

  porta: { fontSize: 17, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  info: { fontSize: 14, color: '#cbd5e1' },
  infoValue: { color: '#fff' },

  status: { marginTop: 8, fontWeight: 'bold', fontSize: 15 },
  statusAtiva: { color: '#38bdf8' },
  statusConcluida: { color: '#22c55e' },
  statusCancelada: { color: '#ef4444' },

  noRecords: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 20,
    fontSize: 16,
  },

  logoutButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  circleTop: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: '#1C3B70',
    top: -120,
    left: -80,
    opacity: 0.28,
    zIndex: -1,
  },

  circleBottom: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: '#1C3B70',
    bottom: -120,
    right: -60,
    opacity: 0.28,
    zIndex: -1,
  },

  blockedContainer: {
    flex: 1,
    backgroundColor: '#0d1b2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: { 
    flex: 1,
    backgroundColor: '#0d1b2a',
    justifyContent: 'center',
    alignItems: 'center',
  }
});