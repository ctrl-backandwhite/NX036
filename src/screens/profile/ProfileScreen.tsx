import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockUser, mockOrders } from '../../data/mockData';

const menuSections = [
  {
    title: 'Mi Cuenta',
    items: [
      { icon: '👤', label: 'Editar perfil', screen: 'EditProfile' },
      { icon: '📍', label: 'Direcciones', screen: 'Addresses' },
      { icon: '💳', label: 'Métodos de pago', screen: 'PaymentMethods' },
      { icon: '🛡️', label: 'Seguridad', screen: 'Security' },
    ],
  },
  {
    title: 'Mis Compras',
    items: [
      { icon: '📦', label: 'Mis pedidos', screen: 'Orders' },
      { icon: '🧾', label: 'Facturas', screen: 'Invoices' },
    ],
  },
  {
    title: 'Recompensas',
    items: [
      { icon: '🏆', label: 'Puntos de fidelidad', screen: 'LoyaltyPoints' },
      { icon: '🎁', label: 'Tarjetas de regalo', screen: 'GiftCards' },
    ],
  },
];

export function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const activeOrders = mockOrders.filter(o => !['delivered', 'cancelled', 'refunded'].includes(o.status));

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View className="bg-white px-5 pt-6 pb-5">
        <View className="flex-row items-center">
          <View className="w-16 h-16 bg-indigo-100 rounded-full items-center justify-center">
            <Text className="text-2xl font-bold text-indigo-600">
              {mockUser.firstName[0]}{mockUser.lastName[0]}
            </Text>
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-xl font-bold text-slate-800">{mockUser.firstName} {mockUser.lastName}</Text>
            <Text className="text-sm text-slate-500">{mockUser.email}</Text>
            <View className="flex-row items-center mt-1">
              <View className="bg-amber-100 px-2 py-0.5 rounded-full">
                <Text className="text-xs font-semibold text-amber-700">🏆 {mockUser.loyaltyTier.toUpperCase()}</Text>
              </View>
              <Text className="text-xs text-slate-400 ml-2">Miembro desde {new Date(mockUser.memberSince).getFullYear()}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            className="p-2">
            <Text className="text-lg">✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row mt-5 bg-slate-50 rounded-2xl p-4">
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-indigo-600">{mockUser.totalOrders}</Text>
            <Text className="text-xs text-slate-500">Pedidos</Text>
          </View>
          <View className="w-px bg-slate-200" />
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-indigo-600">€{mockUser.totalSpent.toFixed(0)}</Text>
            <Text className="text-xs text-slate-500">Gastado</Text>
          </View>
          <View className="w-px bg-slate-200" />
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-amber-600">{mockUser.loyaltyPoints.toLocaleString()}</Text>
            <Text className="text-xs text-slate-500">Puntos</Text>
          </View>
        </View>
      </View>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Orders')}
          className="mx-5 mt-4 bg-indigo-600 rounded-2xl p-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-2xl mr-3">🚚</Text>
            <View>
              <Text className="text-white font-semibold">Pedidos activos</Text>
              <Text className="text-white/70 text-xs">{activeOrders.length} pedido{activeOrders.length !== 1 ? 's' : ''} en curso</Text>
            </View>
          </View>
          <Text className="text-white text-xl">›</Text>
        </TouchableOpacity>
      )}

      {/* Menu Sections */}
      {menuSections.map(section => (
        <View key={section.title} className="mt-5 px-5">
          <Text className="text-xs font-semibold text-slate-400 uppercase mb-2 ml-1">{section.title}</Text>
          <View className="bg-white rounded-2xl overflow-hidden border border-slate-100">
            {section.items.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => navigation.navigate(item.screen)}
                className={`flex-row items-center justify-between px-4 py-3.5 ${
                  index > 0 ? 'border-t border-slate-100' : ''
                }`}>
                <View className="flex-row items-center">
                  <Text className="text-xl mr-3">{item.icon}</Text>
                  <Text className="text-base text-slate-700">{item.label}</Text>
                </View>
                <Text className="text-slate-400 text-lg">›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout */}
      <View className="px-5 mt-6 mb-8">
        <TouchableOpacity
          onPress={() => navigation.replace('Auth')}
          className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center border border-red-100">
          <Text className="text-xl mr-3">🚪</Text>
          <Text className="text-base text-red-600 font-medium">Cerrar sesión</Text>
        </TouchableOpacity>
        <Text className="text-xs text-slate-400 text-center mt-4">ShopNX v1.0.0</Text>
      </View>
    </ScrollView>
  );
}
