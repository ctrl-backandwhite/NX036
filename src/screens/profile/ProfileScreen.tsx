import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { mockOrders } from '../../data/mockData';

const menuSections = [
  {
    title: 'Mi Cuenta',
    items: [
      { icon: 'user-edit', label: 'Editar perfil', screen: 'EditProfile' },
      { icon: 'map-marker-alt', label: 'Direcciones', screen: 'Addresses' },
      { icon: 'credit-card', label: 'Métodos de pago', screen: 'PaymentMethods' },
      { icon: 'shield-alt', label: 'Seguridad', screen: 'Security' },
    ],
  },
  {
    title: 'Mis Compras',
    items: [
      { icon: 'box', label: 'Mis pedidos', screen: 'Orders' },
      { icon: 'file-invoice', label: 'Facturas', screen: 'Invoices' },
    ],
  },
  {
    title: 'Recompensas',
    items: [
      { icon: 'trophy', label: 'Puntos de fidelidad', screen: 'LoyaltyPoints' },
      { icon: 'gift', label: 'Tarjetas de regalo', screen: 'GiftCards' },
    ],
  },
];

export function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const firstName = user?.firstName ?? 'Usuario';
  const lastName = user?.lastName ?? '';
  const email = user?.email ?? '';
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`;

  useEffect(() => {
    api.getOrders({ size: 50 })
      .then(data => setOrders(data ?? []))
      .catch(() => setOrders(mockOrders))
      .finally(() => setLoadingOrders(false));
  }, []);

  const activeOrders = orders.filter(o => !['delivered', 'cancelled', 'refunded'].includes(o.status));

  const handleLogout = async () => {
    await logout();
    navigation.getParent()?.getParent()?.reset({ index: 0, routes: [{ name: 'Auth' }] });
  };

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View className="bg-white px-5 pt-6 pb-5">
        <View className="flex-row items-center">
          <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center">
            <Text className="text-2xl font-bold text-gray-800">
              {initials}
            </Text>
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-xl font-bold text-slate-800">{firstName} {lastName}</Text>
            <Text className="text-sm text-slate-500">{email}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            className="p-2">
            <FA5 name="pen" size={16} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row mt-5 bg-slate-50 rounded-2xl p-4">
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-gray-800">{orders.length}</Text>
            <Text className="text-xs text-slate-500">Pedidos</Text>
          </View>
          <View className="w-px bg-slate-200" />
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-gray-800">€{orders.reduce((s: number, o: any) => s + (o.total ?? 0), 0).toFixed(0)}</Text>
            <Text className="text-xs text-slate-500">Gastado</Text>
          </View>
          <View className="w-px bg-slate-200" />
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-amber-600">0</Text>
            <Text className="text-xs text-slate-500">Puntos</Text>
          </View>
        </View>
      </View>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Orders')}
          className="mx-5 mt-4 bg-gray-800 rounded-2xl p-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <FA5 name="truck" size={18} color="#ffffff" solid />
            <View className="ml-3">
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
                className={`flex-row items-center justify-between px-4 py-3.5 ${index > 0 ? 'border-t border-slate-100' : ''
                  }`}>
                <View className="flex-row items-center">
                  <FA5 name={item.icon} size={16} color="#475569" solid />
                  <Text className="text-base text-slate-700 ml-3">{item.label}</Text>
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
          onPress={handleLogout}
          className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center border border-red-100">
          <FA5 name="sign-out-alt" size={16} color="#dc2626" />
          <Text className="text-base text-red-600 font-medium ml-3">Cerrar sesión</Text>
        </TouchableOpacity>
        <Text className="text-xs text-slate-400 text-center mt-4">NX036 v1.0.0</Text>
      </View>
    </ScrollView>
  );
}
