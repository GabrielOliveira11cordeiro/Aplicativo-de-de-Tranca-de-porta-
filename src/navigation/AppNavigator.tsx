// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import React from 'react';

// 🔹 Telas
import Login from '../screens/Login';
import HistoricoReservas from '../screens/user/HistoricoReservas';

// 🔹 Navegações separadas
import AdminTabs from './AdminTabs';
import UsuarioTabs from './UsuarioTabs';

// 🔹 Tipagem das rotas principais
export type RootStackParamList = {
  Login: undefined;
  AdminMain: undefined;
  UserMain: undefined;
  HistoricoReservas: undefined;
};

// 🔹 Tipagem para navegação (útil para usar com useNavigation)
export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Tela inicial */}
        <Stack.Screen name="Login" component={Login} />

        {/* Rotas principais */}
        <Stack.Screen name="AdminMain" component={AdminTabs} />
        <Stack.Screen name="UserMain" component={UsuarioTabs} />

        {/* Tela de histórico do usuário */}
        <Stack.Screen
          name="HistoricoReservas"
          component={HistoricoReservas}
          options={{
            headerShown: true,
            title: 'Histórico de Reservas',
            headerStyle: { backgroundColor: '#27ae60' },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
