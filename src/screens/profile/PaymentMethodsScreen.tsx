import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockPaymentMethods } from '../../data/mockData';
import { PaymentCard } from '../../components/PaymentCard';

export function PaymentMethodsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <Text className="text-2xl text-slate-600">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-800">Métodos de Pago</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('AddPaymentMethod')}>
          <Text className="text-indigo-600 font-semibold">+ Añadir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        {mockPaymentMethods.map(payment => (
          <PaymentCard
            key={payment.id}
            payment={payment}
            onEdit={() => navigation.navigate('AddPaymentMethod', { payment })}
            onDelete={() => {}}
          />
        ))}

        <TouchableOpacity
          onPress={() => navigation.navigate('AddPaymentMethod')}
          className="flex-row items-center justify-center py-5 border-2 border-dashed border-slate-300 rounded-2xl mb-6">
          <Text className="text-indigo-600 text-2xl mr-2">+</Text>
          <Text className="text-indigo-600 font-semibold text-base">Añadir método de pago</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
