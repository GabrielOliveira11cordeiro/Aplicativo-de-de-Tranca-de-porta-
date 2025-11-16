import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { buscarSalas } from "../../services/CadastrarSala";
import { reservarSala } from "../../services/Reserva";

interface SalaOption {
  label: string;
  value: string;
  salaacessolevel: string;
}

export default function Reservas() {
  const navigation = useNavigation();

  const [salas, setSalas] = useState<SalaOption[]>([]);
  const [salaSelecionada, setSalaSelecionada] = useState<string | null>(null);
  const [openSala, setOpenSala] = useState(false);

  const [data, setData] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [inicio, setInicio] = useState<string | null>(null);
  const [fim, setFim] = useState<string | null>(null);
  const [openInicio, setOpenInicio] = useState(false);
  const [openFim, setOpenFim] = useState(false);

  const horarios = [
    { label: "08:00", value: "08:00" },
    { label: "09:00", value: "09:00" },
    { label: "10:00", value: "10:00" },
    { label: "11:00", value: "11:00" },
    { label: "13:00", value: "13:00" },
    { label: "14:00", value: "14:00" },
    { label: "15:00", value: "15:00" },
    { label: "16:00", value: "16:00" },
  ];

  useEffect(() => {
    const carregar = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const db = getFirestore();

        if (!user) {
          Alert.alert("Erro", "Usuário não autenticado!");
          return;
        }

        const usuariosSnapshot = await getDocs(collection(db, "users"));
        let nivelAcessoUsuario = "3";

        usuariosSnapshot.forEach((doc) => {
          const dados = doc.data();
          if (dados.email === user.email) {
            nivelAcessoUsuario = dados.accessLevel ? String(dados.accessLevel) : "3";
          }
        });

        console.log("👤 Nível do usuário logado:", nivelAcessoUsuario);

        const salasDisponiveis = await buscarSalas();
        
        setSalas(salasDisponiveis);

      } catch (error) {
        console.error("Erro ao carregar salas:", error);
        Alert.alert("Erro", "Falha ao carregar as salas disponíveis.");
      }
    };

    carregar();
  }, []);

  const handleAbrirCalendario = () => {
    setShowDatePicker(true);
  };

  const confirmarReserva = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado!");
      return;
    }

    if (!salaSelecionada || !inicio || !fim) {
      Alert.alert("Atenção", "Preencha todos os campos antes de confirmar!");
      return;
    }

    const inicioNum = parseInt(inicio.replace(':', ''));
    const fimNum = parseInt(fim.replace(':', ''));
    if (inicioNum >= fimNum) {
        Alert.alert("Erro de Horário", "A hora de início deve ser anterior à hora de término.");
        return;
    }

    const resultado = await reservarSala({
      salaNome: salaSelecionada,
      dataReserva: data.toLocaleDateString("pt-BR"),
      horaInicio: inicio,
      horaFim: fim,
    });

    Alert.alert(
      resultado.success ? "✅ Sucesso" : "❌ Erro",
      resultado.message
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.title}>Nova Reserva</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>
        Escolha a sala, data e horário para realizar sua nova reserva.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Sala ou laboratório</Text>
        <DropDownPicker
          open={openSala}
          value={salaSelecionada}
          items={salas}
          setOpen={setOpenSala}
          setValue={setSalaSelecionada}
          placeholder="Selecione uma sala"
          style={styles.dropdown}
          listMode="MODAL"
        />

        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Data</Text>
        <TouchableOpacity style={styles.dateInput} onPress={handleAbrirCalendario}>
          <Ionicons name="calendar-outline" size={20} color="#38BDF8" />
          <Text style={styles.dateText}>{data.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          minimumDate={new Date()}
          onConfirm={(selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setData(selectedDate);
          }}
          onCancel={() => setShowDatePicker(false)}
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
        />

        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Horários</Text>
        <View style={styles.timeRow}>
          <View style={{ flex: 1 }}>
            <DropDownPicker
              open={openInicio}
              value={inicio}
              items={horarios}
              setOpen={setOpenInicio}
              setValue={setInicio}
              placeholder="Início"
              style={styles.dropdown}
              listMode="MODAL"
            />
          </View>

          <View style={{ width: 16 }} />

          <View style={{ flex: 1 }}>
            <DropDownPicker
              open={openFim}
              value={fim}
              items={horarios}
              setOpen={setOpenFim}
              setValue={setFim}
              placeholder="Término"
              style={styles.dropdown}
              listMode="MODAL"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={confirmarReserva}>
          <Text style={styles.buttonText}>Confirmar Reserva</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1120" },
  content: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 26, fontWeight: "700", color: "#F8FAFC" },
  subtitle: {
    color: "rgba(148, 163, 184, 0.9)",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  sectionLabel: {
    color: "#E2E8F0",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderColor: "rgba(148, 163, 184, 0.2)",
    borderRadius: 14,
    minHeight: 52,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.2)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dateText: { color: "#E2E8F0", fontWeight: "600", fontSize: 16 },
  timeRow: { flexDirection: "row", marginTop: 4 },
  button: {
    backgroundColor: "#22C55E",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "#F8FAFC",
    fontWeight: "700",
    fontSize: 16,
  },
});
