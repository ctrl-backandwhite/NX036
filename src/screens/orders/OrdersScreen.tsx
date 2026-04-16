import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import { api } from '../../services/api';
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
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders({ size: 50 })
      .then(data => setOrders(data ?? []))
      .catch(() => setOrders(mockOrders))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = orders.filter(order => {
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
          <FA5 name="arrow-left" size={18} color="#475569" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Mis Pedidos</Text>
      </View>

      {/* Tabs */}
      <View className="bg-white border-b border-slate-100 px-5 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="flex-row">
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-full mr-2 ${activeTab === tab.key ? 'bg-gray-800' : 'bg-slate-100'}`}>
              <Text className={`text-sm font-medium ${activeTab === tab.key ? 'text-white' : 'text-slate-600'}`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#1f2937" />
          </View>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => navigation.navigate('OrderDetail', { order })}
            />
          ))
        ) : (
          <EmptyState
            icon="box-open"
            title="Sin pedidos"
            description="No tienes pedidos en esta categoría."
          />
        )}
      </ScrollView>
    </View>
  );
}
