// src/screens/admin/HomeAdmin.tsx
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RootStackParamList = {
  Login: undefined;
  CadastrarUsuario: undefined;
  CadastrarPorta: undefined;
  HistoricoPortas: undefined;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface Shortcut {
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: keyof RootStackParamList;
}

export default function HomeAdmin() {
  const navigation = useNavigation<NavigationProps>();

  const handleLogout = () => {
    navigation.navigate("Login");
  };

  const shortcuts: Shortcut[] = [
    {
      label: "Gerenciar Usuários",
      description: "Cadastre e acompanhe os usuários do sistema",
      icon: "people-circle",
      route: "CadastrarUsuario",
    },
    {
      label: "Gerenciar Portas",
      description: "Configure novas portas e níveis de acesso",
      icon: "lock-closed",
      route: "CadastrarPorta",
    },
    {
      label: "Histórico",
      description: "Veja as atividades e acessos recentes",
      icon: "time",
      route: "HistoricoPortas",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo, Administrador</Text>
        <Text style={styles.subtitle}>
          Selecione uma opção para começar a gerenciar o sistema.
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {shortcuts.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.card}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.9}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name={item.icon} size={32} color="#0F172A" />
            </View>
            <View style={styles.cardTexts}>
              <Text style={styles.cardTitle}>{item.label}</Text>
              <Text style={styles.cardSubtitle}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1120",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(148, 163, 184, 0.9)",
    lineHeight: 22,
  },
  cardsContainer: {
    gap: 16,
    flex: 1,
  },
  card: {
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#34D399",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },
  cardTexts: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F8FAFC",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(203, 213, 225, 0.8)",
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
