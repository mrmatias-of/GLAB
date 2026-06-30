import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import HomeScreen from './screens/HomeScreen'
import OrdensScreen from './screens/OrdensScreen'
import TecnicoScreen from './screens/TecnicoScreen'
import EstoqueScreen from './screens/EstoqueScreen'
import PerfilScreen from './screens/PerfilScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function OrdensStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="OrdensHome" component={OrdensScreen} options={{ title: 'Ordens' }} />
    </Stack.Navigator>
  )
}

function TecnicoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TecnicoHome" component={TecnicoScreen} options={{ title: 'Técnico' }} />
    </Stack.Navigator>
  )
}

function EstoqueStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EstoqueHome" component={EstoqueScreen} options={{ title: 'Estoque' }} />
    </Stack.Navigator>
  )
}

function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PerfilHome" component={PerfilScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: '#999'
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Início' }}
          />
          <Tab.Screen
            name="OrdensTab"
            component={OrdensStack}
            options={{ title: 'Ordens' }}
          />
          <Tab.Screen
            name="TecnicoTab"
            component={TecnicoStack}
            options={{ title: 'Técnico' }}
          />
          <Tab.Screen
            name="EstoqueTab"
            component={EstoqueStack}
            options={{ title: 'Estoque' }}
          />
          <Tab.Screen
            name="PerfilTab"
            component={PerfilStack}
            options={{ title: 'Perfil' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
