import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockOrders } from '../../data/mockData';
import { OrderCard } from '../../components/OrderCard';
import { EmptyState } from '../../components/Shared';

const tabs = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Activos' },
  { key: 'completed', label: 'Completados' },
  { key: 'cancelled', label: 'Cancelados' },
];

export function OrdersScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return !['delivered', 'cancelled', 'refunded'].includes(order.status);
    if (activeTab === 'completed') return order.status === 'delivered';
    if (activeTab === 'cancelled') return ['cancelled', 'returned', 'refunded'].includes(order.status);
    return true;
  });

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Text className="text-2xl text-slate-600">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Mis Pedidos</Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="bg-white border-b border-slate-100" contentContainerClassName="px-5 py-3">
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full mr-2 ${activeTab === tab.key ? 'bg-indigo-600' : 'bg-slate-100'}`}>
            <Text className={`text-sm font-medium ${activeTab === tab.key ? 'text-white' : 'text-slate-600'}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => navigation.navigate('OrderDetail', { order })}
            />
          ))
        ) : (
          <EmptyState
            icon="📦"
            title="Sin pedidos"
            description="No tienes pedidos en esta categoría."
          />
        )}
      </ScrollView>
    </View>
  );
}
