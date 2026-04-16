import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import type { Order, OrderStatus } from '../types';

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: string }> = {
  pending: { label: 'Pendiente', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: 'clock' },
  confirmed: { label: 'Confirmado', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: 'check-circle' },
  processing: { label: 'Preparando', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: 'box' },
  shipped: { label: 'Enviado', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: 'shipping-fast' },
  in_transit: { label: 'En tránsito', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: 'truck' },
  out_for_delivery: { label: 'En reparto', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: 'truck-loading' },
  delivered: { label: 'Entregado', color: 'text-emerald-700', bgColor: 'bg-emerald-100', icon: 'check-circle' },
  cancelled: { label: 'Cancelado', color: 'text-red-700', bgColor: 'bg-red-100', icon: 'times-circle' },
  returned: { label: 'Devuelto', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: 'undo-alt' },
  refunded: { label: 'Reembolsado', color: 'text-slate-700', bgColor: 'bg-slate-100', icon: 'money-bill-wave' },
};

const statusIconColors: Record<OrderStatus, string> = {
  pending: '#b45309',
  confirmed: '#1d4ed8',
  processing: '#1d4ed8',
  shipped: '#374151',
  in_transit: '#374151',
  out_for_delivery: '#7e22ce',
  delivered: '#047857',
  cancelled: '#b91c1c',
  returned: '#c2410c',
  refunded: '#475569',
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
          <FA5 name={status.icon} size={10} color={statusIconColors[order.status]} solid />
          <Text className={`text-xs font-semibold ml-1 ${status.color}`}>{status.label}</Text>
        </View>
      </View>

      <View className="flex-row mb-3">
        {order.items.slice(0, 3).map((item) => (
          <View key={item.id} className="w-14 h-14 bg-slate-100 rounded-xl items-center justify-center mr-2">
            <FA5 name="box" size={20} color="#94a3b8" solid />
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
