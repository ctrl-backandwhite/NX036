import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Auth
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';

// Home
import { HomeScreen } from '../screens/home/HomeScreen';

// Categories
import { CategoriesScreen } from '../screens/categories/CategoriesScreen';
import { CategoryProductsScreen } from '../screens/categories/CategoryProductsScreen';

// Products
import { ProductDetailScreen } from '../screens/products/ProductDetailScreen';

// Search
import { SearchScreen } from '../screens/search/SearchScreen';

// Notifications
import { NotificationsScreen } from '../screens/notifications/NotificationsScreen';

// Cart & Checkout
import { CartScreen } from '../screens/cart/CartScreen';
import { CheckoutScreen } from '../screens/checkout/CheckoutScreen';
import { OrderConfirmationScreen } from '../screens/checkout/OrderConfirmationScreen';

// Profile
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { AddressesScreen } from '../screens/profile/AddressesScreen';
import { AddAddressScreen } from '../screens/profile/AddAddressScreen';
import { PaymentMethodsScreen } from '../screens/profile/PaymentMethodsScreen';
import { AddPaymentMethodScreen } from '../screens/profile/AddPaymentMethodScreen';

// Orders
import { OrdersScreen } from '../screens/orders/OrdersScreen';
import { OrderDetailScreen } from '../screens/orders/OrderDetailScreen';
import { OrderTrackingScreen } from '../screens/orders/OrderTrackingScreen';

// Invoices
import { InvoicesScreen } from '../screens/invoices/InvoicesScreen';
import { InvoiceDetailScreen } from '../screens/invoices/InvoiceDetailScreen';

// Loyalty & Gift Cards
import { LoyaltyPointsScreen } from '../screens/loyalty/LoyaltyPointsScreen';
import { GiftCardsScreen } from '../screens/giftcards/GiftCardsScreen';

// Security
import { SecurityScreen } from '../screens/security/SecurityScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

// ============ Tab Icons ============
const tabIcons: Record<string, { active: string; inactive: string }> = {
  HomeTab: { active: '🏠', inactive: '🏡' },
  CategoriesTab: { active: '📂', inactive: '📁' },
  CartTab: { active: '🛒', inactive: '🛒' },
  ProfileTab: { active: '👤', inactive: '👤' },
};

const tabLabels: Record<string, string> = {
  HomeTab: 'Inicio',
  CategoriesTab: 'Categorías',
  CartTab: 'Carrito',
  ProfileTab: 'Perfil',
};

// ============ Profile Navigator ============
function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="Addresses" component={AddressesScreen} />
      <ProfileStack.Screen name="AddAddress" component={AddAddressScreen} />
      <ProfileStack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <ProfileStack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
      <ProfileStack.Screen name="Orders" component={OrdersScreen} />
      <ProfileStack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <ProfileStack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <ProfileStack.Screen name="Invoices" component={InvoicesScreen} />
      <ProfileStack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
      <ProfileStack.Screen name="LoyaltyPoints" component={LoyaltyPointsScreen} />
      <ProfileStack.Screen name="GiftCards" component={GiftCardsScreen} />
      <ProfileStack.Screen name="Security" component={SecurityScreen} />
    </ProfileStack.Navigator>
  );
}

// ============ Main Tabs ============
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIcon: ({ focused }) => {
          const icons = tabIcons[route.name];
          return <Text style={{ fontSize: 22 }}>{focused ? icons.active : icons.inactive}</Text>;
        },
        tabBarLabel: ({ focused }) => (
          <Text
            style={{
              fontSize: 11,
              fontWeight: focused ? '600' : '400',
              color: focused ? '#4F46E5' : '#94A3B8',
              marginTop: 2,
            }}>
            {tabLabels[route.name]}
          </Text>
        ),
      })}>
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="CategoriesTab" component={CategoriesScreen} />
      <Tab.Screen name="CartTab" component={CartScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}

// ============ Auth Navigator ============
function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

// ============ Root Navigator ============
export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
