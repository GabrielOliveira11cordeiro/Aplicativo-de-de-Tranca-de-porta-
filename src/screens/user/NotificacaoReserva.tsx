import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotificacaoReserva() {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
        </TouchableOpacity>

        <Text style={styles.title}>Notificações</Text>

        {/* Espaço pra alinhar o backButton */}
        <View style={{ width: 40 }} />
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Ionicons name="notifications-off-outline" size={48} color="#FACC15" />
        <Text style={styles.cardTitle}>Tudo tranquilo por aqui</Text>
        <Text style={styles.cardSubtitle}>
          Você será avisado quando houver novas notificações sobre suas reservas.
        </Text>
      </View>

      {/* BOTÃO */}
      <TouchableOpacity style={styles.button} onPress={handleLogout} activeOpacity={0.85}>
        <Ionicons name="log-out-outline" size={20} color="#F8FAFC" />
        <Text style={styles.buttonText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#0B1120',
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#F8FAFC',
  },
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.12)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  cardTitle: {
    marginTop: 20,
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
  },
  cardSubtitle: {
    marginTop: 12,
    color: 'rgba(148, 163, 184, 0.85)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 32,
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 10,
  },
  buttonText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
});
