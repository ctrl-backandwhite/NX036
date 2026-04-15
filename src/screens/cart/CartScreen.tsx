import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockCartItems, mockCoupons } from '../../data/mockData';
import { Button } from '../../components/Button';
import { Divider, PriceRow, EmptyState } from '../../components/Shared';

export function CartScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(mockCartItems);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const discount = appliedCoupon ? subtotal * 0.2 : 0;
  const tax = (subtotal - discount) * 0.21;
  const total = subtotal + shipping - discount + tax;

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(item.product.stockQuantity, item.quantity + delta)) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
        <EmptyState
          icon="🛒"
          title="Tu carrito está vacío"
          description="Explora nuestros productos y añade lo que te guste."
          actionTitle="Explorar productos"
          onAction={() => navigation.navigate('HomeTab')}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100">
        <Text className="text-2xl font-bold text-slate-800">Carrito</Text>
        <Text className="text-sm text-slate-500">{items.length} artículo{items.length !== 1 ? 's' : ''}</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View className="px-5 pt-4">
          {items.map(item => (
            <View key={item.id} className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
              <View className="flex-row">
                <View className="w-20 h-20 bg-slate-100 rounded-xl items-center justify-center">
                  <Text className="text-3xl">📦</Text>
                </View>
                <View className="flex-1 ml-3">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="text-xs text-slate-400">{item.product.brand}</Text>
                      <Text className="text-sm font-semibold text-slate-800" numberOfLines={2}>{item.product.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeItem(item.id)} className="p-1">
                      <Text className="text-slate-400">✕</Text>
                    </TouchableOpacity>
                  </View>
                  {(item.selectedSize || item.selectedColor) && (
                    <View className="flex-row mt-1 gap-2">
                      {item.selectedColor && (
                        <Text className="text-xs text-slate-500">Color: {item.selectedColor}</Text>
                      )}
                      {item.selectedSize && (
                        <Text className="text-xs text-slate-500">Talla: {item.selectedSize}</Text>
                      )}
                    </View>
                  )}
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-base font-bold text-indigo-600">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </Text>
                    <View className="flex-row items-center bg-slate-100 rounded-lg">
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 items-center justify-center">
                        <Text className="text-lg text-slate-600">−</Text>
                      </TouchableOpacity>
                      <Text className="text-sm font-semibold text-slate-800 w-6 text-center">{item.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 items-center justify-center">
                        <Text className="text-lg text-slate-600">+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Coupon */}
        <View className="px-5 mt-2">
          <View className="bg-white rounded-2xl p-4 border border-slate-100">
            <Text className="text-sm font-semibold text-slate-800 mb-3">🏷️ Código de descuento</Text>
            <View className="flex-row gap-2">
              <View className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <Text className="text-sm text-slate-400">{appliedCoupon || 'Ingresa tu código'}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setAppliedCoupon(appliedCoupon ? null : 'SPRING20')}
                className={`px-4 py-3 rounded-xl ${appliedCoupon ? 'bg-red-100' : 'bg-indigo-600'}`}>
                <Text className={`text-sm font-semibold ${appliedCoupon ? 'text-red-600' : 'text-white'}`}>
                  {appliedCoupon ? 'Quitar' : 'Aplicar'}
                </Text>
              </TouchableOpacity>
            </View>
            {appliedCoupon && (
              <View className="flex-row items-center mt-2 bg-emerald-50 px-3 py-2 rounded-lg">
                <Text className="text-xs text-emerald-700">✅ Código SPRING20 aplicado: 20% de descuento</Text>
              </View>
            )}
          </View>
        </View>

        {/* Available coupons */}
        <View className="px-5 mt-3 mb-4">
          <Text className="text-sm font-semibold text-slate-800 mb-2">Cupones disponibles</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockCoupons.map(coupon => (
              <TouchableOpacity
                key={coupon.code}
                onPress={() => setAppliedCoupon(coupon.code)}
                className="bg-white border border-dashed border-indigo-300 rounded-xl p-3 mr-2 w-48">
                <Text className="text-sm font-bold text-indigo-600">{coupon.code}</Text>
                <Text className="text-xs text-slate-600 mt-1">{coupon.description}</Text>
                <Text className="text-xs text-slate-400 mt-1">Válido hasta {coupon.expiryDate}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Summary */}
        <View className="px-5 pb-4">
          <View className="bg-white rounded-2xl p-4 border border-slate-100">
            <Text className="text-base font-semibold text-slate-800 mb-3">Resumen del pedido</Text>
            <PriceRow label="Subtotal" value={subtotal} />
            <PriceRow label="Envío" value={shipping} />
            {discount > 0 && <PriceRow label="Descuento" value={discount} isDiscount />}
            <PriceRow label="Impuestos (21%)" value={tax} />
            <PriceRow label="Total" value={total} isTotal />

            {/* Loyalty points earned */}
            <View className="flex-row items-center mt-3 bg-amber-50 px-3 py-2 rounded-lg">
              <Text className="text-xs text-amber-800">🏆 Ganarás <Text className="font-bold">{Math.floor(subtotal)} puntos</Text> con esta compra</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom */}
      <View className="px-5 py-4 bg-white border-t border-slate-100" style={{ paddingBottom: insets.bottom + 16 }}>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-slate-500">Total</Text>
          <Text className="text-2xl font-bold text-slate-800">€{total.toFixed(2)}</Text>
        </View>
        <Button
          title="Proceder al pago"
          onPress={() => navigation.navigate('Checkout', { subtotal, shipping, discount, tax, total })}
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
}
