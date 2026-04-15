import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Order, OrderStatus } from '../types';

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: string }> = {
  pending: { label: 'Pendiente', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: '🕐' },
  confirmed: { label: 'Confirmado', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: '✅' },
  processing: { label: 'Preparando', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: '📦' },
  shipped: { label: 'Enviado', color: 'text-indigo-700', bgColor: 'bg-indigo-100', icon: '🚚' },
  in_transit: { label: 'En tránsito', color: 'text-indigo-700', bgColor: 'bg-indigo-100', icon: '🚚' },
  out_for_delivery: { label: 'En reparto', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: '📬' },
  delivered: { label: 'Entregado', color: 'text-emerald-700', bgColor: 'bg-emerald-100', icon: '✅' },
  cancelled: { label: 'Cancelado', color: 'text-red-700', bgColor: 'bg-red-100', icon: '❌' },
  returned: { label: 'Devuelto', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: '↩️' },
  refunded: { label: 'Reembolsado', color: 'text-slate-700', bgColor: 'bg-slate-100', icon: '💰' },
};

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  const status = statusConfig[order.status];
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-slate-100"
      activeOpacity={0.7}>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm font-semibold text-slate-800">{order.orderNumber}</Text>
        <View className={`flex-row items-center px-2.5 py-1 rounded-full ${status.bgColor}`}>
          <Text className="text-xs mr-1">{status.icon}</Text>
          <Text className={`text-xs font-semibold ${status.color}`}>{status.label}</Text>
        </View>
      </View>

      <View className="flex-row mb-3">
        {order.items.slice(0, 3).map((item) => (
          <View key={item.id} className="w-14 h-14 bg-slate-100 rounded-xl items-center justify-center mr-2">
            <Text className="text-2xl">📦</Text>
          </View>
        ))}
        {order.items.length > 3 && (
          <View className="w-14 h-14 bg-slate-200 rounded-xl items-center justify-center">
            <Text className="text-sm font-semibold text-slate-600">+{order.items.length - 3}</Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between pt-3 border-t border-slate-100">
        <View>
          <Text className="text-xs text-slate-400">
            {new Date(order.createdAt).toLocaleDateString('es-ES')} · {itemCount} artículo{itemCount !== 1 ? 's' : ''}
          </Text>
        </View>
        <Text className="text-base font-bold text-slate-800">€{order.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export { statusConfig };
