import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { statusConfig } from '../../components/OrderCard';
import type { Order } from '../../types';
import FA5 from 'react-native-vector-icons/FontAwesome5';

export function OrderTrackingScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const order: Order = route.params.order;

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <FA5 name="arrow-left" size={18} color="#475569" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-slate-800">Seguimiento</Text>
          <Text className="text-xs text-slate-500">{order.orderNumber}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map placeholder */}
        <View className="h-48 bg-slate-100 items-center justify-center">
          <FA5 name="map-marked-alt" size={40} color="#64748b" solid style={{ marginBottom: 8 }} />
          <Text className="text-sm text-slate-500">Mapa de seguimiento</Text>
        </View>

        {/* Status Card */}
        <View className="mx-5 -mt-6 bg-white rounded-2xl p-5 shadow-lg border border-slate-100">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-lg font-bold text-slate-800">
                {statusConfig[order.status].label}
              </Text>
              <Text className="text-sm text-slate-500 mt-0.5">
                Entrega estimada: {order.estimatedDelivery}
              </Text>
            </View>
            <Text className="text-4xl">{statusConfig[order.status].icon}</Text>
          </View>

          {order.trackingNumber && (
            <View className="bg-slate-50 rounded-xl px-4 py-3 flex-row items-center justify-between">
              <View>
                <Text className="text-xs text-slate-400">Número de seguimiento</Text>
                <Text className="text-sm font-semibold text-slate-800 mt-0.5">{order.trackingNumber}</Text>
              </View>
              <TouchableOpacity className="bg-gray-100 px-3 py-1.5 rounded-lg">
                <Text className="text-xs font-semibold text-gray-800">Copiar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Timeline */}
        <View className="px-5 mt-6 pb-8">
          <Text className="text-base font-semibold text-slate-800 mb-4">Historial de envío</Text>

          {order.trackingHistory.map((event, index) => {
            const isLast = index === order.trackingHistory.length - 1;
            const isActive = event.isCompleted && (index === order.trackingHistory.length - 1 || !order.trackingHistory[index + 1]?.isCompleted);

            return (
              <View key={event.id} className="flex-row">
                {/* Timeline line */}
                <View className="items-center mr-4 w-8">
                  <View className={`w-4 h-4 rounded-full border-2 z-10 ${event.isCompleted
                      ? isActive
                        ? 'bg-gray-800 border-gray-800'
                        : 'bg-emerald-500 border-emerald-500'
                      : 'bg-white border-slate-300'
                    }`}>
                    {event.isCompleted && !isActive && (
                      <Text className="text-white text-[8px] text-center leading-[12px]">✓</Text>
                    )}
                    {isActive && (
                      <View className="w-1.5 h-1.5 bg-white rounded-full m-auto" />
                    )}
                  </View>
                  {!isLast && (
                    <View className={`w-0.5 flex-1 ${event.isCompleted ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                  )}
                </View>

                {/* Content */}
                <View className={`flex-1 pb-6 ${!event.isCompleted ? 'opacity-40' : ''}`}>
                  <Text className={`text-sm font-semibold ${isActive ? 'text-gray-800' : 'text-slate-800'}`}>
                    {event.description}
                  </Text>
                  {event.location && (
                    <Text className="text-xs text-slate-500 mt-0.5"><FA5 name="map-marker-alt" size={10} color="#64748b" solid /> {event.location}</Text>
                  )}
                  {event.timestamp && (
                    <Text className="text-xs text-slate-400 mt-0.5">
                      {new Date(event.timestamp).toLocaleDateString('es-ES', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Contact */}
        <View className="mx-5 mb-8 bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <Text className="text-sm font-semibold text-slate-800 mb-3">¿Necesitas ayuda?</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-white rounded-xl py-3 items-center border border-slate-200">
              <FA5 name="phone-alt" size={16} color="#1f2937" solid style={{ marginBottom: 4 }} />
              <Text className="text-xs text-slate-600">Llamar</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white rounded-xl py-3 items-center border border-slate-200">
              <FA5 name="comment" size={16} color="#1f2937" solid style={{ marginBottom: 4 }} />
              <Text className="text-xs text-slate-600">Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white rounded-xl py-3 items-center border border-slate-200">
              <FA5 name="envelope" size={16} color="#1f2937" solid style={{ marginBottom: 4 }} />
              <Text className="text-xs text-slate-600">Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
