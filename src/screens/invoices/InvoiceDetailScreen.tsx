import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PriceRow, Divider } from '../../components/Shared';
import { Button } from '../../components/Button';
import type { Invoice } from '../../types';
import FA5 from 'react-native-vector-icons/FontAwesome5';

export function InvoiceDetailScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const invoice: Invoice = route.params.invoice;

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <FA5 name="arrow-left" size={18} color="#475569" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-800">Factura</Text>
        </View>
        <TouchableOpacity className="bg-gray-100 px-3 py-1.5 rounded-lg">
          <Text className="text-sm font-semibold text-gray-800"><FA5 name="download" size={12} color="#1f2937" solid /> Descargar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Invoice Header */}
        <View className="mx-5 mt-4 bg-white rounded-2xl p-5 border border-slate-100">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-2xl font-bold text-gray-800">ShopNX</Text>
              <Text className="text-xs text-slate-500">Tu tienda favorita</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-slate-400">FACTURA</Text>
              <Text className="text-base font-bold text-slate-800">{invoice.invoiceNumber}</Text>
            </View>
          </View>

          <Divider />

          <View className="flex-row justify-between mt-2">
            <View>
              <Text className="text-xs text-slate-400 uppercase mb-1">Fecha emisión</Text>
              <Text className="text-sm text-slate-700">{new Date(invoice.issuedDate).toLocaleDateString('es-ES')}</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs text-slate-400 uppercase mb-1">Pedido</Text>
              <Text className="text-sm text-gray-800 font-semibold">{invoice.orderNumber}</Text>
            </View>
          </View>
        </View>

        {/* Billing Address */}
        <View className="mx-5 mt-3 bg-white rounded-2xl p-4 border border-slate-100">
          <Text className="text-sm font-semibold text-slate-800 mb-2"><FA5 name="map-marker-alt" size={12} color="#1e293b" solid /> Facturar a</Text>
          <Text className="text-sm text-slate-700">{invoice.billingAddress.fullName}</Text>
          <Text className="text-sm text-slate-500">{invoice.billingAddress.street}</Text>
          <Text className="text-sm text-slate-500">
            {invoice.billingAddress.city}, {invoice.billingAddress.state} {invoice.billingAddress.zipCode}
          </Text>
        </View>

        {/* Items */}
        <View className="mx-5 mt-3 bg-white rounded-2xl p-4 border border-slate-100">
          <Text className="text-sm font-semibold text-slate-800 mb-3">Detalle</Text>

          {/* Table header */}
          <View className="flex-row py-2 border-b border-slate-200">
            <Text className="flex-1 text-xs font-semibold text-slate-500">Descripción</Text>
            <Text className="w-12 text-xs font-semibold text-slate-500 text-center">Cant.</Text>
            <Text className="w-20 text-xs font-semibold text-slate-500 text-right">Precio</Text>
            <Text className="w-20 text-xs font-semibold text-slate-500 text-right">Total</Text>
          </View>

          {invoice.items.map((item, index) => (
            <View key={index} className="flex-row py-3 border-b border-slate-50">
              <Text className="flex-1 text-sm text-slate-700">{item.description}</Text>
              <Text className="w-12 text-sm text-slate-600 text-center">{item.quantity}</Text>
              <Text className="w-20 text-sm text-slate-600 text-right">€{item.unitPrice.toFixed(2)}</Text>
              <Text className="w-20 text-sm font-medium text-slate-800 text-right">€{item.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View className="mx-5 mt-3 mb-6 bg-white rounded-2xl p-4 border border-slate-100">
          <PriceRow label="Subtotal" value={invoice.subtotal} />
          <PriceRow label="Envío" value={invoice.shipping} />
          {invoice.discount > 0 && <PriceRow label="Descuento" value={invoice.discount} isDiscount />}
          <PriceRow label="IVA (21%)" value={invoice.tax} />
          <PriceRow label="Total" value={invoice.total} isTotal />
        </View>
      </ScrollView>

      <View className="px-5 py-4 bg-white border-t border-slate-100 flex-row gap-3" style={{ paddingBottom: insets.bottom + 16 }}>
        <View className="flex-1">
          <Button title="Compartir" onPress={() => { }} variant="outline" fullWidth />
        </View>
        <View className="flex-1">
          <Button title="Descargar PDF" onPress={() => { }} fullWidth />
        </View>
      </View>
    </View>
  );
}
