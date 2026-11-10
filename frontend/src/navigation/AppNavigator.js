import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useCinema } from '../context/CinemaContext';
import { HomeScreen } from '../screens/HomeScreen';
import { MovieDetailScreen } from '../screens/MovieDetailScreen';
import { SeatSelectionScreen } from '../screens/SeatSelectionScreen';
import { TicketScreen } from '../screens/TicketScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { TicketsScreen } from '../screens/TicketsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors, fonts } from '../theme/tokens';
import { isBookingPast } from '../utils/showtimes';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.brand,
  },
};

const TAB_ICONS = {
  Cartelera: ['film', 'film-outline'],
  Boletos: ['ticket', 'ticket-outline'],
  Perfil: ['person', 'person-outline'],
};

const Tabs = () => {
  const { bookings } = useCinema();
  const upcomingCount = bookings.filter((b) => !isBookingPast(b)).length;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 12 },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={TAB_ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Cartelera" component={HomeScreen} />
      <Tab.Screen
        name="Boletos"
        component={TicketsScreen}
        options={{
          title: 'Mis boletos',
          tabBarBadge: upcomingCount > 0 ? upcomingCount : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.brand, fontFamily: fonts.bold, fontSize: 11 },
        }}
      />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => (
  <NavigationContainer theme={navTheme}>
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen
        name="Ticket"
        component={TicketScreen}
        options={{ animation: 'slide_from_bottom', gestureEnabled: true }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
