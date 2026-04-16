import React from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import FA5 from 'react-native-vector-icons/FontAwesome5';

export function OrderConfirmationScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const orderNumber = 'ORD-2026-001235';

  return (
    <View className="flex-1 bg-white items-center justify-center px-6" style={{ paddingTop: insets.top }}>
      {/* Success animation placeholder */}
      <View className="w-28 h-28 bg-emerald-100 rounded-full items-center justify-center mb-6">
        <FA5 name="check-circle" size={56} color="#10b981" solid />
      </View>

      <Text className="text-2xl font-bold text-slate-800 text-center">¡Pedido confirmado!</Text>
      <Text className="text-base text-slate-500 text-center mt-2 px-4">
        Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación pronto.
      </Text>

      {/* Order number */}
      <View className="bg-slate-50 rounded-2xl px-6 py-4 mt-8 items-center border border-slate-200">
        <Text className="text-sm text-slate-500">Número de pedido</Text>
        <Text className="text-xl font-bold text-gray-800 mt-1">{orderNumber}</Text>
      </View>

      {/* Details */}
      <View className="w-full mt-8 bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <View className="flex-row items-center justify-between py-2">
          <Text className="text-sm text-slate-500">Entrega estimada</Text>
          <Text className="text-sm font-semibold text-slate-800">18-20 Abril 2026</Text>
        </View>
        <View className="flex-row items-center justify-between py-2 border-t border-slate-200">
          <Text className="text-sm text-slate-500">Método de pago</Text>
          <Text className="text-sm font-semibold text-slate-800">Visa ****4242</Text>
        </View>
        <View className="flex-row items-center justify-between py-2 border-t border-slate-200">
          <Text className="text-sm text-slate-500">Total pagado</Text>
          <Text className="text-sm font-bold text-gray-800">€1,675.80</Text>
        </View>
        <View className="flex-row items-center justify-between py-2 border-t border-slate-200">
          <Text className="text-sm text-slate-500">Puntos ganados</Text>
          <Text className="text-sm font-semibold text-amber-600"><FA5 name="trophy" size={12} color="#d97706" solid /> +2,770 pts</Text>
        </View>
      </View>

      {/* Actions */}
      <View className="w-full mt-8 gap-3" style={{ paddingBottom: insets.bottom + 16 }}>
        <Button
          title="Seguir mi pedido"
          onPress={() => navigation.navigate('Main', { screen: 'ProfileTab', params: { screen: 'OrderDetail', params: { orderId: 'o1' } } })}
          size="lg"
          fullWidth
        />
        <Button
          title="Seguir comprando"
          onPress={() => navigation.navigate('Main', { screen: 'HomeTab' })}
          variant="outline"
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
}
