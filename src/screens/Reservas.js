// src/screens/Reservas.js
import { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { api } from '../services/api';

export default function Reservas() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await api.getSalas();
      setSalas(data);
      setLoading(false);
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Reserva de salas</Text>
      <FlatList
        data={salas}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 8 }}>
            <Text>{item.nome}</Text>
            <TouchableOpacity style={{ marginTop: 8 }}>
              <Text style={{ color: '#2ecc71' }}>Reservar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Nova Reserva (mock)" onPress={() => alert('abrir modal ou screen de reserva')} />
    </View>
  );
}
