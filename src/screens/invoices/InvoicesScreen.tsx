import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../services/api';
import { mockInvoices } from '../../data/mockData';
import FA5 from 'react-native-vector-icons/FontAwesome5';

const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
  paid: { label: 'Pagada', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  pending: { label: 'Pendiente', color: 'text-amber-700', bg: 'bg-amber-100' },
  overdue: { label: 'Vencida', color: 'text-red-700', bg: 'bg-red-100' },
};

export function InvoicesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInvoices({ size: 50 })
      .then(data => setInvoices(data ?? []))
      .catch(() => setInvoices(mockInvoices))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <FA5 name="arrow-left" size={18} color="#475569" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Facturas</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1f2937" />
        </View>
      ) : (
        <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
          {invoices.map((invoice: any) => {
            const style = statusStyle[invoice.status] ?? statusStyle.pending;
            return (
              <TouchableOpacity
                key={String(invoice.id)}
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
                    {invoice.issuedDate ? new Date(invoice.issuedDate).toLocaleDateString('es-ES') : '-'}
                  </Text>
                  <Text className="text-base font-bold text-slate-800">€{(invoice.total ?? 0).toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
