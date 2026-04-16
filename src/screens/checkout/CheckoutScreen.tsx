import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../services/api';
import { mockAddresses, mockPaymentMethods, mockCartItems, mockGiftCards } from '../../data/mockData';
import { AddressCard } from '../../components/AddressCard';
import { PaymentCard } from '../../components/PaymentCard';
import { Button } from '../../components/Button';
import { PriceRow } from '../../components/Shared';
import FA5 from 'react-native-vector-icons/FontAwesome5';

type CheckoutStep = 'address' | 'payment' | 'review';

const steps: { key: CheckoutStep; label: string; icon: string }[] = [
  { key: 'address', label: 'Dirección', icon: 'map-marker-alt' },
  { key: 'payment', label: 'Pago', icon: 'credit-card' },
  { key: 'review', label: 'Resumen', icon: 'clipboard-list' },
];

export function CheckoutScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { subtotal = 0, shipping = 0, discount = 0, tax = 0, total = 0 } = route.params || {};
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [addresses, setAddresses] = useState<any[]>(mockAddresses);
  const [payments, setPayments] = useState<any[]>(mockPaymentMethods);
  const [cartItems, setCartItems] = useState<any[]>(mockCartItems);
  const [selectedAddressId, setSelectedAddressId] = useState(mockAddresses[0].id);
  const [selectedPaymentId, setSelectedPaymentId] = useState(mockPaymentMethods[0].id);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [selectedGiftCardId, setSelectedGiftCardId] = useState<string | null>(null);
  const [_orderNotes, _setOrderNotes] = useState('');

  useEffect(() => {
    // Load real data with fallback
    api.getAddresses()
      .then(data => { if (data?.length) { setAddresses(data); setSelectedAddressId(data[0].id); } })
      .catch(() => { });
    api.getPaymentMethods()
      .then(data => { if (data?.length) { setPayments(data); setSelectedPaymentId(data[0].id); } })
      .catch(() => { });
    api.getCart()
      .then(cart => { if (cart.items?.length) setCartItems(cart.items); })
      .catch(() => { });
  }, []);

  const loyaltyDiscount = 0;
  const giftCardDiscount = selectedGiftCardId
    ? Math.min(mockGiftCards.find(gc => gc.id === selectedGiftCardId)?.balance || 0, total)
    : 0;
  const finalTotal = total - loyaltyDiscount - giftCardDiscount;

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  const goNext = () => {
    if (currentStep === 'address') setCurrentStep('payment');
    else if (currentStep === 'payment') setCurrentStep('review');
    else navigation.navigate('OrderConfirmation');
  };

  const goBack = () => {
    if (currentStep === 'payment') setCurrentStep('address');
    else if (currentStep === 'review') setCurrentStep('payment');
    else navigation.goBack();
  };

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={goBack} className="mr-3">
            <FA5 name="arrow-left" size={18} color="#475569" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-800">Checkout</Text>
        </View>

        {/* Step indicator */}
        <View className="flex-row items-center justify-between mt-4 px-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <TouchableOpacity
                onPress={() => index <= currentStepIndex && setCurrentStep(step.key)}
                className="items-center">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${index <= currentStepIndex ? 'bg-gray-800' : 'bg-slate-200'
                  }`}>
                  {index < currentStepIndex ? (
                    <Text className="text-white font-bold">✓</Text>
                  ) : (
                    <FA5 name={step.icon} size={14} color={index <= currentStepIndex ? '#ffffff' : '#94a3b8'} solid />
                  )}
                </View>
                <Text className={`text-xs mt-1 ${index <= currentStepIndex ? 'text-gray-800 font-semibold' : 'text-slate-400'
                  }`}>{step.label}</Text>
              </TouchableOpacity>
              {index < steps.length - 1 && (
                <View className={`flex-1 h-0.5 mx-2 ${index < currentStepIndex ? 'bg-gray-800' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Step: Address */}
        {currentStep === 'address' && (
          <View className="px-5 pt-4 pb-6">
            <Text className="text-lg font-bold text-slate-800 mb-1">Dirección de envío</Text>
            <Text className="text-sm text-slate-500 mb-4">Selecciona dónde quieres recibir tu pedido</Text>

            {addresses.map((address: any) => (
              <AddressCard
                key={String(address.id)}
                address={address}
                selected={selectedAddressId === address.id}
                selectable
                onPress={() => setSelectedAddressId(address.id)}
              />
            ))}

            <TouchableOpacity className="flex-row items-center justify-center py-4 border-2 border-dashed border-slate-300 rounded-2xl mt-2">
              <Text className="text-gray-800 text-lg mr-2">+</Text>
              <Text className="text-gray-800 font-semibold">Añadir nueva dirección</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step: Payment */}
        {currentStep === 'payment' && (
          <View className="px-5 pt-4 pb-6">
            <Text className="text-lg font-bold text-slate-800 mb-1">Método de pago</Text>
            <Text className="text-sm text-slate-500 mb-4">Elige cómo quieres pagar</Text>

            {payments.map((payment: any) => (
              <PaymentCard
                key={String(payment.id)}
                payment={payment}
                selected={selectedPaymentId === payment.id}
                selectable
                onPress={() => setSelectedPaymentId(payment.id)}
              />
            ))}

            <TouchableOpacity className="flex-row items-center justify-center py-4 border-2 border-dashed border-slate-300 rounded-2xl mt-2 mb-6">
              <Text className="text-gray-800 text-lg mr-2">+</Text>
              <Text className="text-gray-800 font-semibold">Añadir método de pago</Text>
            </TouchableOpacity>

            {/* Loyalty Points */}
            <View className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-amber-800"><FA5 name="trophy" size={12} color="#92400e" solid /> Puntos de fidelidad</Text>
                  <Text className="text-xs text-amber-700 mt-1">
                    Próximamente disponible
                  </Text>
                </View>
              </View>
            </View>

            {/* Gift Cards */}
            <View className="bg-white rounded-2xl p-4 border border-slate-100">
              <Text className="text-sm font-semibold text-slate-800 mb-3"><FA5 name="gift" size={12} color="#1e293b" solid /> Tarjetas de regalo</Text>
              {mockGiftCards.filter(gc => gc.status === 'active').map(gc => (
                <TouchableOpacity
                  key={gc.id}
                  onPress={() => setSelectedGiftCardId(selectedGiftCardId === gc.id ? null : gc.id)}
                  className={`flex-row items-center justify-between p-3 rounded-xl mb-2 border ${selectedGiftCardId === gc.id ? 'border-gray-800 bg-gray-50' : 'border-slate-200'
                    }`}>
                  <View>
                    <Text className="text-sm font-medium text-slate-800">{gc.code}</Text>
                    <Text className="text-xs text-slate-500">Balance: €{gc.balance.toFixed(2)}</Text>
                  </View>
                  <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${selectedGiftCardId === gc.id ? 'border-gray-800 bg-gray-800' : 'border-slate-300'
                    }`}>
                    {selectedGiftCardId === gc.id && <Text className="text-white text-xs">✓</Text>}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step: Review */}
        {currentStep === 'review' && (
          <View className="px-5 pt-4 pb-6">
            <Text className="text-lg font-bold text-slate-800 mb-4">Resumen del pedido</Text>

            {/* Shipping Address */}
            <View className="bg-white rounded-2xl p-4 border border-slate-100 mb-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-semibold text-slate-800"><FA5 name="map-marker-alt" size={12} color="#1e293b" solid /> Dirección de envío</Text>
                <TouchableOpacity onPress={() => setCurrentStep('address')}>
                  <Text className="text-sm text-gray-800 font-semibold">Cambiar</Text>
                </TouchableOpacity>
              </View>
              {(() => {
                const addr = addresses.find((a: any) => a.id === selectedAddressId) ?? addresses[0];
                if (!addr) return null;
                return (
                  <>
                    <Text className="text-sm text-slate-700">{addr.fullName}</Text>
                    <Text className="text-sm text-slate-500">{addr.street}</Text>
                    <Text className="text-sm text-slate-500">{addr.city}, {addr.state} {addr.zipCode}</Text>
                  </>
                );
              })()}
            </View>

            {/* Payment Method */}
            <View className="bg-white rounded-2xl p-4 border border-slate-100 mb-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-semibold text-slate-800"><FA5 name="credit-card" size={12} color="#1e293b" solid /> Método de pago</Text>
                <TouchableOpacity onPress={() => setCurrentStep('payment')}>
                  <Text className="text-sm text-gray-800 font-semibold">Cambiar</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-slate-700">
                {payments.find((p: any) => p.id === selectedPaymentId)?.label ?? '-'}
              </Text>
            </View>

            {/* Items */}
            <View className="bg-white rounded-2xl p-4 border border-slate-100 mb-3">
              <Text className="text-sm font-semibold text-slate-800 mb-3"><FA5 name="box" size={12} color="#1e293b" solid /> Artículos ({cartItems.length})</Text>
              {cartItems.map((item: any) => (
                <View key={String(item.id)} className="flex-row items-center py-2 border-b border-slate-50 last:border-0">
                  <View className="w-12 h-12 bg-slate-100 rounded-lg items-center justify-center">
                    <FA5 name="box" size={18} color="#94a3b8" solid />
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-sm text-slate-800" numberOfLines={1}>{item.product?.name ?? item.productName ?? ''}</Text>
                    <Text className="text-xs text-slate-500">Cant: {item.quantity}</Text>
                  </View>
                  <Text className="text-sm font-semibold text-slate-800">€{((item.product?.price ?? 0) * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </View>

            {/* Price Breakdown */}
            <View className="bg-white rounded-2xl p-4 border border-slate-100">
              <Text className="text-sm font-semibold text-slate-800 mb-3"><FA5 name="money-bill-wave" size={12} color="#1e293b" solid /> Desglose</Text>
              <PriceRow label="Subtotal" value={subtotal} />
              <PriceRow label="Envío" value={shipping} />
              {discount > 0 && <PriceRow label="Descuento cupón" value={discount} isDiscount />}
              {loyaltyDiscount > 0 && <PriceRow label="Puntos fidelidad" value={loyaltyDiscount} isDiscount />}
              {giftCardDiscount > 0 && <PriceRow label="Tarjeta regalo" value={giftCardDiscount} isDiscount />}
              <PriceRow label="Impuestos (21%)" value={tax} />
              <PriceRow label="Total" value={finalTotal} isTotal />

              {/* Points earned */}
              <View className="flex-row items-center mt-3 bg-amber-50 px-3 py-2 rounded-lg">
                <Text className="text-xs text-amber-800"><FA5 name="trophy" size={10} color="#92400e" solid /> Ganarás <Text className="font-bold">{Math.floor(subtotal * 2)} pts</Text> (nivel Gold x2)</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom */}
      <View className="px-5 py-4 bg-white border-t border-slate-100" style={{ paddingBottom: insets.bottom + 16 }}>
        <Button
          title={currentStep === 'review' ? `Confirmar pedido · €${finalTotal.toFixed(2)}` : 'Continuar'}
          onPress={goNext}
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
}
