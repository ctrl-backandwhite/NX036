import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { statusConfig } from '../../components/OrderCard';
import { PriceRow } from '../../components/Shared';
import { Button } from '../../components/Button';
import type { Order } from '../../types';
import FA5 from 'react-native-vector-icons/FontAwesome5';

export function OrderDetailScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const order: Order = route.params.order;
  const status = statusConfig[order.status];

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <FA5 name="arrow-left" size={18} color="#475569" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-slate-800">Detalle del pedido</Text>
          <Text className="text-xs text-slate-500">{order.orderNumber}</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Status */}
        <View className="mx-5 mt-4 bg-white rounded-2xl p-4 border border-slate-100">
          <View className="flex-row items-center justify-between mb-2">
            <View className={`flex-row items-center px-3 py-1.5 rounded-full ${status.bgColor}`}>
              <Text className="mr-1">{status.icon}</Text>
              <Text className={`text-sm font-semibold ${status.color}`}>{status.label}</Text>
            </View>
            <Text className="text-xs text-slate-500">
              {new Date(order.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>
          {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
            <Text className="text-sm text-slate-600 mt-1">
              <FA5 name="calendar-alt" size={12} color="#475569" solid /> Entrega estimada: <Text className="font-semibold">{order.estimatedDelivery}</Text>
            </Text>
          )}
        </View>

        {/* Track Order Button */}
        {order.trackingNumber && !['delivered', 'cancelled', 'refunded'].includes(order.status) && (
          <TouchableOpacity
            onPress={() => navigation.navigate('OrderTracking', { order })}
            className="mx-5 mt-3 bg-gray-800 rounded-2xl p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <FA5 name="truck" size={20} color="#1f2937" solid style={{ marginRight: 12 }} />
              <View>
                <Text className="text-white font-semibold">Seguir pedido</Text>
                <Text className="text-white/70 text-xs">Tracking: {order.trackingNumber}</Text>
              </View>
            </View>
            <Text className="text-white text-xl">›</Text>
          </TouchableOpacity>
        )}

        {/* Items */}
        <View className="mx-5 mt-4 bg-white rounded-2xl p-4 border border-slate-100">
          <Text className="text-base font-semibold text-slate-800 mb-3">Artículos</Text>
          {order.items.map((item, index) => (
            <View key={item.id} className={`flex-row py-3 ${index > 0 ? 'border-t border-slate-100' : ''}`}>
              <View className="w-16 h-16 bg-slate-100 rounded-xl items-center justify-center">
                <FA5 name="box" size={18} color="#94a3b8" solid />
              </View>
              <View className="flex-1 ml-3 justify-between">
                <Text className="text-sm font-medium text-slate-800" numberOfLines={2}>{item.productName}</Text>
                <View className="flex-row items-center gap-2">
                  {item.size && <Text className="text-xs text-slate-500">Talla: {item.size}</Text>}
                  {item.color && <Text className="text-xs text-slate-500">Color: {item.color}</Text>}
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs text-slate-500">Cant: {item.quantity}</Text>
                  <Text className="text-sm font-semibold text-slate-800">€{(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Address */}
        <View className="mx-5 mt-3 bg-white rounded-2xl p-4 border border-slate-100">
          <Text className="text-base font-semibold text-slate-800 mb-2"><FA5 name="map-marker-alt" size={14} color="#1e293b" solid /> Dirección de envío</Text>
          <Text className="text-sm text-slate-700">{order.shippingAddress.fullName}</Text>
          <Text className="text-sm text-slate-500">{order.shippingAddress.street}</Text>
          <Text className="text-sm text-slate-500">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </Text>
        </View>

        {/* Payment */}
        <View className="mx-5 mt-3 bg-white rounded-2xl p-4 border border-slate-100">
          <Text className="text-base font-semibold text-slate-800 mb-2"><FA5 name="credit-card" size={14} color="#1e293b" solid /> Método de pago</Text>
          <Text className="text-sm text-slate-700">{order.paymentMethod.label}</Text>
        </View>

        {/* Price Summary */}
        <View className="mx-5 mt-3 mb-6 bg-white rounded-2xl p-4 border border-slate-100">
          <Text className="text-base font-semibold text-slate-800 mb-3"><FA5 name="money-bill-wave" size={14} color="#1e293b" solid /> Resumen</Text>
          <PriceRow label="Subtotal" value={order.subtotal} />
          <PriceRow label="Envío" value={order.shipping} />
          {order.discount > 0 && <PriceRow label="Descuento" value={order.discount} isDiscount />}
          {order.loyaltyPointsUsed > 0 && (
            <PriceRow label={`Puntos (${order.loyaltyPointsUsed} pts)`} value={order.loyaltyPointsUsed * 0.01} isDiscount />
          )}
          {order.giftCardAmount > 0 && <PriceRow label="Tarjeta regalo" value={order.giftCardAmount} isDiscount />}
          <PriceRow label="Impuestos" value={order.tax} />
          <PriceRow label="Total" value={order.total} isTotal />

          {order.loyaltyPointsEarned > 0 && (
            <View className="flex-row items-center mt-3 bg-amber-50 px-3 py-2 rounded-lg">
              <Text className="text-xs text-amber-800"><FA5 name="trophy" size={10} color="#92400e" solid /> +{order.loyaltyPointsEarned} puntos ganados</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom actions */}
      {order.status === 'delivered' && (
        <View className="px-5 py-4 bg-white border-t border-slate-100 flex-row gap-3" style={{ paddingBottom: insets.bottom + 16 }}>
          <View className="flex-1">
            <Button title="Devolver" onPress={() => { }} variant="outline" fullWidth />
          </View>
          <View className="flex-1">
            <Button title="Comprar otra vez" onPress={() => { }} fullWidth />
          </View>
        </View>
      )}
    </View>
  );
}
