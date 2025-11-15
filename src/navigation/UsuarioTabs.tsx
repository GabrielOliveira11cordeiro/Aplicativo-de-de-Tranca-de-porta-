// src/navigation/UsuarioTabs.js
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Telas do usuário
import HistoricoReservas from '../screens/HistoricoReservas'; // nova tela
import HomeUsuario from '../screens/HomeUsuario';
import NotificacaoReserva from '../screens/NotificacaoReserva';
import ReservarPorta from '../screens/Reservas';

const Tab = createBottomTabNavigator();

export default function UsuarioTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#ccc',
          height: 60,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: '#27ae60', // verde padrão
        tabBarInactiveTintColor: '#777',
      }}
    >
      <Tab.Screen
        name="HomeUsuario"
        component={HomeUsuario}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="ReservarPorta"
        component={ReservarPorta}
        options={{
          title: 'Reservar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="key-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="HistoricoReservas"
        component={HistoricoReservas}
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="NotificacaoReserva"
        component={NotificacaoReserva}
        options={{
          title: 'Notificações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}