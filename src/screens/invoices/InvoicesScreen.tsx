import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockInvoices } from '../../data/mockData';

const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
  paid: { label: 'Pagada', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  pending: { label: 'Pendiente', color: 'text-amber-700', bg: 'bg-amber-100' },
  overdue: { label: 'Vencida', color: 'text-red-700', bg: 'bg-red-100' },
};

export function InvoicesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Text className="text-2xl text-slate-600">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Facturas</Text>
      </View>

      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        {mockInvoices.map(invoice => {
          const style = statusStyle[invoice.status];
          return (
            <TouchableOpacity
              key={invoice.id}
              onPress={() => navigation.navigate('InvoiceDetail', { invoice })}
              className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-semibold text-slate-800">{invoice.invoiceNumber}</Text>
                <View className={`px-2.5 py-1 rounded-full ${style.bg}`}>
                  <Text className={`text-xs font-semibold ${style.color}`}>{style.label}</Text>
                </View>
              </View>
              <Text className="text-xs text-slate-500">Pedido: {invoice.orderNumber}</Text>
              <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <Text className="text-xs text-slate-400">
                  {new Date(invoice.issuedDate).toLocaleDateString('es-ES')}
                </Text>
                <Text className="text-base font-bold text-slate-800">€{invoice.total.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
