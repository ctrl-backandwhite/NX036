import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockAddresses, mockPaymentMethods, mockCartItems, mockUser, mockGiftCards } from '../../data/mockData';
import { AddressCard } from '../../components/AddressCard';
import { PaymentCard } from '../../components/PaymentCard';
import { Button } from '../../components/Button';
import { PriceRow } from '../../components/Shared';

type CheckoutStep = 'address' | 'payment' | 'review';

const steps: { key: CheckoutStep; label: string; icon: string }[] = [
  { key: 'address', label: 'Dirección', icon: '📍' },
  { key: 'payment', label: 'Pago', icon: '💳' },
  { key: 'review', label: 'Resumen', icon: '📋' },
];

export function CheckoutScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { subtotal = 1384.96, shipping = 0, discount = 0, tax = 290.84, total = 1675.80 } = route.params || {};
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [selectedAddressId, setSelectedAddressId] = useState(mockAddresses[0].id);
  const [selectedPaymentId, setSelectedPaymentId] = useState(mockPaymentMethods[0].id);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [selectedGiftCardId, setSelectedGiftCardId] = useState<string | null>(null);
  const [_orderNotes, _setOrderNotes] = useState('');

  const loyaltyDiscount = useLoyaltyPoints ? Math.min(mockUser.loyaltyPoints * 0.01, total * 0.1) : 0;
  const giftCardDiscount = selectedGiftCardId
    ? Math.min(mockGiftCards.find(gc => gc.id === selectedGiftCardId)?.balance || 0, total - loyaltyDiscount)
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
            <Text className="text-2xl text-slate-600">←</Text>
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
                <View className={`w-10 h-10 rounded-full items-center justify-center ${
                  index <= currentStepIndex ? 'bg-indigo-600' : 'bg-slate-200'
                }`}>
                  {index < currentStepIndex ? (
                    <Text className="text-white font-bold">✓</Text>
                  ) : (
                    <Text className={index <= currentStepIndex ? 'text-lg' : 'text-lg opacity-50'}>{step.icon}</Text>
                  )}
                </View>
                <Text className={`text-xs mt-1 ${
                  index <= currentStepIndex ? 'text-indigo-600 font-semibold' : 'text-slate-400'
                }`}>{step.label}</Text>
              </TouchableOpacity>
              {index < steps.length - 1 && (
                <View className={`flex-1 h-0.5 mx-2 ${index < currentStepIndex ? 'bg-indigo-600' : 'bg-slate-200'}`} />
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

            {mockAddresses.map(address => (
              <AddressCard
                key={address.id}
                address={address}
                selected={selectedAddressId === address.id}
                selectable
                onPress={() => setSelectedAddressId(address.id)}
              />
            ))}

            <TouchableOpacity className="flex-row items-center justify-center py-4 border-2 border-dashed border-slate-300 rounded-2xl mt-2">
              <Text className="text-indigo-600 text-lg mr-2">+</Text>
              <Text className="text-indigo-600 font-semibold">Añadir nueva dirección</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step: Payment */}
        {currentStep === 'payment' && (
          <View className="px-5 pt-4 pb-6">
            <Text className="text-lg font-bold text-slate-800 mb-1">Método de pago</Text>
            <Text className="text-sm text-slate-500 mb-4">Elige cómo quieres pagar</Text>

            {mockPaymentMethods.map(payment => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                selected={selectedPaymentId === payment.id}
                selectable
                onPress={() => setSelectedPaymentId(payment.id)}
              />
            ))}

            <TouchableOpacity className="flex-row items-center justify-center py-4 border-2 border-dashed border-slate-300 rounded-2xl mt-2 mb-6">
              <Text className="text-indigo-600 text-lg mr-2">+</Text>
              <Text className="text-indigo-600 font-semibold">Añadir método de pago</Text>
            </TouchableOpacity>

            {/* Loyalty Points */}
            <View className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-amber-800">🏆 Puntos de fidelidad</Text>
                  <Text className="text-xs text-amber-700 mt-1">
                    Tienes {mockUser.loyaltyPoints.toLocaleString()} pts (≈ €{(mockUser.loyaltyPoints * 0.01).toFixed(2)})
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setUseLoyaltyPoints(!useLoyaltyPoints)}
                  className={`w-12 h-7 rounded-full justify-center px-0.5 ${useLoyaltyPoints ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                  <View className={`w-6 h-6 bg-white rounded-full shadow-sm ${useLoyaltyPoints ? 'self-end' : 'self-start'}`} />
                </TouchableOpacity>
              </View>
              {useLoyaltyPoints && (
                <Text className="text-xs text-emerald-700 mt-2">
                  ✅ Se aplicarán €{loyaltyDiscount.toFixed(2)} de descuento (máx. 10% del total)
                </Text>
              )}
            </View>

            {/* Gift Cards */}
            <View className="bg-white rounded-2xl p-4 border border-slate-100">
              <Text className="text-sm font-semibold text-slate-800 mb-3">🎁 Tarjetas de regalo</Text>
              {mockGiftCards.filter(gc => gc.status === 'active').map(gc => (
                <TouchableOpacity
                  key={gc.id}
                  onPress={() => setSelectedGiftCardId(selectedGiftCardId === gc.id ? null : gc.id)}
                  className={`flex-row items-center justify-between p-3 rounded-xl mb-2 border ${
                    selectedGiftCardId === gc.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'
                  }`}>
                  <View>
                    <Text className="text-sm font-medium text-slate-800">{gc.code}</Text>
                    <Text className="text-xs text-slate-500">Balance: €{gc.balance.toFixed(2)}</Text>
                  </View>
                  <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    selectedGiftCardId === gc.id ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
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
                <Text className="text-sm font-semibold text-slate-800">📍 Dirección de envío</Text>
                <TouchableOpacity onPress={() => setCurrentStep('address')}>
                  <Text className="text-sm text-indigo-600 font-semibold">Cambiar</Text>
                </TouchableOpacity>
              </View>
              {(() => {
                const addr = mockAddresses.find(a => a.id === selectedAddressId)!;
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
                <Text className="text-sm font-semibold text-slate-800">💳 Método de pago</Text>
                <TouchableOpacity onPress={() => setCurrentStep('payment')}>
                  <Text className="text-sm text-indigo-600 font-semibold">Cambiar</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-slate-700">
                {mockPaymentMethods.find(p => p.id === selectedPaymentId)?.label}
              </Text>
            </View>

            {/* Items */}
            <View className="bg-white rounded-2xl p-4 border border-slate-100 mb-3">
              <Text className="text-sm font-semibold text-slate-800 mb-3">📦 Artículos ({mockCartItems.length})</Text>
              {mockCartItems.map(item => (
                <View key={item.id} className="flex-row items-center py-2 border-b border-slate-50 last:border-0">
                  <View className="w-12 h-12 bg-slate-100 rounded-lg items-center justify-center">
                    <Text className="text-xl">📦</Text>
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-sm text-slate-800" numberOfLines={1}>{item.product.name}</Text>
                    <Text className="text-xs text-slate-500">Cant: {item.quantity}</Text>
                  </View>
                  <Text className="text-sm font-semibold text-slate-800">€{(item.product.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </View>

            {/* Price Breakdown */}
            <View className="bg-white rounded-2xl p-4 border border-slate-100">
              <Text className="text-sm font-semibold text-slate-800 mb-3">💰 Desglose</Text>
              <PriceRow label="Subtotal" value={subtotal} />
              <PriceRow label="Envío" value={shipping} />
              {discount > 0 && <PriceRow label="Descuento cupón" value={discount} isDiscount />}
              {loyaltyDiscount > 0 && <PriceRow label="Puntos fidelidad" value={loyaltyDiscount} isDiscount />}
              {giftCardDiscount > 0 && <PriceRow label="Tarjeta regalo" value={giftCardDiscount} isDiscount />}
              <PriceRow label="Impuestos (21%)" value={tax} />
              <PriceRow label="Total" value={finalTotal} isTotal />

              {/* Points earned */}
              <View className="flex-row items-center mt-3 bg-amber-50 px-3 py-2 rounded-lg">
                <Text className="text-xs text-amber-800">🏆 Ganarás <Text className="font-bold">{Math.floor(subtotal * 2)} pts</Text> (nivel Gold x2)</Text>
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
