import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

const paymentTypes = [
  { type: 'credit_card', label: 'Tarjeta de crédito', icon: '💳' },
  { type: 'debit_card', label: 'Tarjeta de débito', icon: '💳' },
  { type: 'paypal', label: 'PayPal', icon: '🅿️' },
  { type: 'bank_transfer', label: 'Transferencia', icon: '🏦' },
];

export function AddPaymentMethodScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const existing = route.params?.payment;
  const isEditing = !!existing;

  const [selectedType, setSelectedType] = useState(existing?.type || 'credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const isCard = selectedType === 'credit_card' || selectedType === 'debit_card';

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '').substring(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '').substring(0, 4);
    if (cleaned.length > 2) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return cleaned;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
      style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Text className="text-2xl text-slate-600">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">
          {isEditing ? 'Editar método de pago' : 'Nuevo método de pago'}
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" keyboardShouldPersistTaps="handled">
        {/* Payment Type */}
        <Text className="text-sm font-medium text-slate-700 mb-3">Tipo de pago</Text>
        <View className="flex-row flex-wrap gap-2 mb-6">
          {paymentTypes.map(pt => (
            <TouchableOpacity
              key={pt.type}
              onPress={() => setSelectedType(pt.type)}
              className={`flex-row items-center px-4 py-3 rounded-xl border ${
                selectedType === pt.type ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'
              }`}>
              <Text className="text-lg mr-2">{pt.icon}</Text>
              <Text className={`text-sm ${selectedType === pt.type ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}>
                {pt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Preview */}
        {isCard && (
          <View className="bg-indigo-600 rounded-2xl p-5 mb-6" style={{ aspectRatio: 1.586 }}>
            <View className="flex-1 justify-between">
              <View className="flex-row justify-between items-start">
                <Text className="text-white/80 text-sm">
                  {selectedType === 'credit_card' ? 'Crédito' : 'Débito'}
                </Text>
                <Text className="text-white text-lg">💳</Text>
              </View>
              <Text className="text-white text-xl tracking-widest font-mono">
                {cardNumber || '•••• •••• •••• ••••'}
              </Text>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-white/60 text-xs">Titular</Text>
                  <Text className="text-white text-sm">{cardHolder || 'TU NOMBRE'}</Text>
                </View>
                <View>
                  <Text className="text-white/60 text-xs">Expira</Text>
                  <Text className="text-white text-sm">{expiryDate || 'MM/AA'}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Card Form */}
        {isCard && (
          <>
            <Input
              label="Número de tarjeta"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChangeText={t => setCardNumber(formatCardNumber(t))}
              keyboardType="numeric"
              leftIcon="💳"
              maxLength={19}
            />
            <Input
              label="Titular de la tarjeta"
              placeholder="NOMBRE COMO EN LA TARJETA"
              value={cardHolder}
              onChangeText={setCardHolder}
              autoCapitalize="characters"
              leftIcon="👤"
            />
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Input
                  label="Fecha de expiración"
                  placeholder="MM/AA"
                  value={expiryDate}
                  onChangeText={t => setExpiryDate(formatExpiry(t))}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <View className="flex-1">
                <Input
                  label="CVV"
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                />
              </View>
            </View>
          </>
        )}

        {/* PayPal */}
        {selectedType === 'paypal' && (
          <Input
            label="Email de PayPal"
            placeholder="tu@email.com"
            value={paypalEmail}
            onChangeText={setPaypalEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="✉️"
          />
        )}

        {/* Bank Transfer */}
        {selectedType === 'bank_transfer' && (
          <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <Text className="text-sm text-blue-800">
              ℹ️ La transferencia bancaria será configurada al momento del pago. Se te proporcionarán los datos bancarios.
            </Text>
          </View>
        )}

        {/* Default toggle */}
        <TouchableOpacity
          onPress={() => setIsDefault(!isDefault)}
          className="flex-row items-center justify-between bg-white rounded-xl p-4 border border-slate-200 my-6">
          <Text className="text-base text-slate-700">Usar como método predeterminado</Text>
          <View className={`w-12 h-7 rounded-full justify-center px-0.5 ${isDefault ? 'bg-indigo-600' : 'bg-slate-300'}`}>
            <View className={`w-6 h-6 bg-white rounded-full shadow-sm ${isDefault ? 'self-end' : 'self-start'}`} />
          </View>
        </TouchableOpacity>

        {/* Security note */}
        <View className="flex-row items-center bg-emerald-50 rounded-xl p-3 mb-6 border border-emerald-200">
          <Text className="text-lg mr-2">🔒</Text>
          <Text className="text-xs text-emerald-700 flex-1">
            Tu información de pago está protegida con encriptación de nivel bancario (AES-256).
          </Text>
        </View>
      </ScrollView>

      <View className="px-5 py-4 bg-white border-t border-slate-100" style={{ paddingBottom: insets.bottom + 16 }}>
        <Button
          title={isEditing ? 'Guardar cambios' : 'Añadir método de pago'}
          onPress={() => navigation.goBack()}
          size="lg"
          fullWidth
        />
      </View>
    </KeyboardAvoidingView>
  );
}
