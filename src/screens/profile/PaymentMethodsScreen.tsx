import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../services/api';
import { mockPaymentMethods } from '../../data/mockData';
import { PaymentCard } from '../../components/PaymentCard';
import FA5 from 'react-native-vector-icons/FontAwesome5';

export function PaymentMethodsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPaymentMethods()
      .then(data => setPayments(data ?? []))
      .catch(() => setPayments(mockPaymentMethods))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <FA5 name="arrow-left" size={18} color="#475569" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-800">Métodos de Pago</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('AddPaymentMethod')}>
          <Text className="text-gray-800 font-semibold">+ Añadir</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1f2937" />
        </View>
      ) : (
        <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
          {payments.map((payment: any) => (
            <PaymentCard
              key={String(payment.id)}
              payment={payment}
              onEdit={() => navigation.navigate('AddPaymentMethod', { payment })}
              onDelete={() => { }}
            />
          ))}

          <TouchableOpacity
            onPress={() => navigation.navigate('AddPaymentMethod')}
            className="flex-row items-center justify-center py-5 border-2 border-dashed border-slate-300 rounded-2xl mb-6">
            <Text className="text-gray-800 text-2xl mr-2">+</Text>
            <Text className="text-gray-800 font-semibold text-base">Añadir método de pago</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
