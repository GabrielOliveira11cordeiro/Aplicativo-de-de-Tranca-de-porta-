import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Reservas() {
  // Estados para sala
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [openSala, setOpenSala] = useState(false);

  // Estados para data
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Estados para horários
  const [inicio, setInicio] = useState(null);
  const [fim, setFim] = useState(null);
  const [openInicio, setOpenInicio] = useState(false);
  const [openFim, setOpenFim] = useState(false);

  // Listas de opções
  const salasFixas = [
    { label: "Laboratório 1", value: "Laboratório 1" },
    { label: "Laboratório 2", value: "Laboratório 2" },
    { label: "Sala 103", value: "Sala 103" },
  ];

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

  // Função de confirmação
  const confirmarReserva = () => {
    if (!salaSelecionada || !inicio || !fim) {
      alert("Preencha todos os campos antes de confirmar!");
      return;
    }

    alert(
      `✅ Reserva confirmada!\n\nSala: ${salaSelecionada}\nData: ${data.toLocaleDateString()}\nHorário: ${inicio} às ${fim}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reserva de salas</Text>

      {/* Escolha de Sala */}
      <Text style={styles.label}>Escolha uma sala ou laboratório</Text>
      <View style={{ zIndex: 3000, marginBottom: 25 }}>
        <DropDownPicker
          open={openSala}
          value={salaSelecionada}
          items={salasFixas}
          setOpen={setOpenSala}
          setValue={setSalaSelecionada}
          placeholder="Selecione uma sala"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          textStyle={{ fontWeight: "bold" }}
        />
      </View>

      {/* Escolha do dia */}
      <Text style={styles.label}>Escolha o dia</Text>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.boldText}>{data.toLocaleDateString()}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={(selectedDate) => {
          setShowDatePicker(false);
          if (selectedDate) setData(selectedDate);
        }}
        onCancel={() => setShowDatePicker(false)}
        confirmTextIOS="Confirmar"
        cancelTextIOS="Cancelar"
        buttonTextColorIOS="#2ecc71"
      />

      {/* Seleção de horário */}
      <Text style={styles.label}>Selecione o horário</Text>

      {/* Início */}
      <View style={{ zIndex: 2000, marginBottom: 15 }}>
        <DropDownPicker
          open={openInicio}
          value={inicio}
          items={horarios}
          setOpen={setOpenInicio}
          setValue={setInicio}
          placeholder="Horário de início"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      {/* Fim */}
      <View style={{ zIndex: 1000, marginBottom: 40 }}>
        <DropDownPicker
          open={openFim}
          value={fim}
          items={horarios}
          setOpen={setOpenFim}
          setValue={setFim}
          placeholder="Horário de término"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>

      {/* Botão Confirmar */}
      <TouchableOpacity style={styles.button} onPress={confirmarReserva}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 50,
    fontWeight: "bold",
  },
  label: {
    fontSize: 17,
    marginBottom: 6,
  },
  dropdown: {
    borderColor: "#2ecc71",
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownContainer: {
    borderColor: "#2ecc71",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#2ecc71",
    borderRadius: 8,
    padding: 10,
    marginBottom: 25,
  },
  boldText: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  button: {
    backgroundColor: "#2ecc71",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
