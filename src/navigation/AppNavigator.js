// src/navigation/AppNavigator.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CadastrarSala from '../screens/CadastrarSala';
import CadastrarUsuario from '../screens/CadastrarUsuario';
import Login from '../screens/Login';
import Reservas from '../screens/Reservas';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Reservas" component={Reservas} />
      <Tab.Screen name="CadastrarUsuario" component={CadastrarUsuario} />
      <Tab.Screen name="CadastrarSala" component={CadastrarSala} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
