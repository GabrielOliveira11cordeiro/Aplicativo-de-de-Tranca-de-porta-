// src/navigation/AdminTabs.js
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Telas do admin
import CadastrarPorta from '../screens/CadastrarSala';
import CadastrarUsuario from '../screens/CadastrarUsuario';
import HistoricoPortas from '../screens/HistoricoPortas';
import HomeAdmin from '../screens/HomeAdmin';

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#ccc' },
        tabBarActiveTintColor: '#007AFF',
      }}
    >
      <Tab.Screen
        name="HomeAdmin"
        component={HomeAdmin}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CadastrarUsuario"
        component={CadastrarUsuario}
        options={{
          title: 'Usuários',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CadastrarPorta"
        component={CadastrarPorta}
        options={{
          title: 'Portas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="key" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="HistoricoPortas"
        component={HistoricoPortas}
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}