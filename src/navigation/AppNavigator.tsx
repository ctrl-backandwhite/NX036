import React from 'react';
import { Text, View } from 'react-native';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCart } from '../contexts/CartContext';

// Splash
import { SplashScreen } from '../screens/SplashScreen';

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

// ============ Tab Icons FA5 ============
const tabFA5Icons: Record<string, string> = {
  HomeTab: 'home',
  CategoriesTab: 'th-large',
  CartTab: 'shopping-cart',
  ProfileTab: 'user',
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

function MainTabs() {
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIcon: ({ focused }) => {
          const iconName = tabFA5Icons[route.name];
          return (
            <View>
              <FA5
                name={iconName}
                size={21}
                color={focused ? '#1f2937' : '#9ca3af'}
                solid={false}
              />
              {route.name === 'CartTab' && cartCount > 0 && (
                <View style={{
                  position: 'absolute', top: -4, right: -10,
                  backgroundColor: '#ef4444', borderRadius: 8,
                  minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center',
                  paddingHorizontal: 4,
                }}>
                  <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </Text>
                </View>
              )}
            </View>
          );
        },
        tabBarLabel: ({ focused, children }) => (
          <Text
            style={{
              fontSize: 11,
              fontWeight: focused ? '600' : '400',
              color: focused ? '#1f2937' : '#9ca3af',
              marginTop: 0,
            }}>
            {children}
          </Text>
        ),
        tabBarActiveTintColor: '#1f2937',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarShowLabel: true,
      })}>
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="CategoriesTab" component={CategoriesScreen} options={{ tabBarLabel: 'Categorías' }} />
      <Tab.Screen name="CartTab" component={CartScreen} options={{ tabBarLabel: 'Carrito' }} />
      <Tab.Screen name="ProfileTab" component={ProfileNavigator} options={{ tabBarLabel: 'Perfil' }} />
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
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
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
