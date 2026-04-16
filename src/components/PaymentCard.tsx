import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import type { PaymentMethod } from '../types';

const cardBrandIcons: Record<string, string> = {
  visa: 'cc-visa',
  mastercard: 'cc-mastercard',
  amex: 'cc-amex',
  discover: 'cc-discover',
};

const paymentTypeIcons: Record<string, string> = {
  credit_card: 'credit-card',
  debit_card: 'credit-card',
  paypal: 'paypal',
  apple_pay: 'apple-pay',
  google_pay: 'google-pay',
  bank_transfer: 'university',
};

interface PaymentCardProps {
  payment: PaymentMethod;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  selected?: boolean;
  selectable?: boolean;
}

export function PaymentCard({ payment, onPress, onEdit, onDelete, selected = false, selectable = false }: PaymentCardProps) {
  const iconName = payment.cardBrand
    ? cardBrandIcons[payment.cardBrand] ?? 'credit-card'
    : paymentTypeIcons[payment.type] ?? 'credit-card';

  const isBrand = !!(payment.cardBrand && cardBrandIcons[payment.cardBrand]) ||
    ['paypal', 'apple_pay', 'google_pay'].includes(payment.type);

  const brandLabel = payment.cardBrand
    ? payment.cardBrand.charAt(0).toUpperCase() + payment.cardBrand.slice(1)
    : payment.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={`bg-white rounded-2xl p-4 mb-3 border-2 ${selected ? 'border-gray-800 bg-gray-50' : 'border-gray-200'
        }`}
      activeOpacity={onPress ? 0.7 : 1}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {selectable && (
            <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${selected ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
              }`}>
              {selected && <Text className="text-white text-xs font-bold">✓</Text>}
            </View>
          )}
          <View className="w-12 h-12 bg-slate-100 rounded-xl items-center justify-center">
            <FA5 name={iconName} size={22} color="#334155" brand={isBrand} solid={!isBrand} />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-base font-semibold text-slate-800">{payment.label}</Text>
            {payment.expiryDate && (
              <Text className="text-sm text-slate-500 mt-0.5">Expira {payment.expiryDate}</Text>
            )}
            {payment.email && (
              <Text className="text-sm text-slate-500 mt-0.5">{payment.email}</Text>
            )}
          </View>
        </View>
        <View className="flex-row items-center">
          {payment.isDefault && (
            <View className="bg-emerald-100 px-2 py-0.5 rounded-full mr-2">
              <Text className="text-xs text-emerald-700">Default</Text>
            </View>
          )}
          {onEdit && (
            <TouchableOpacity onPress={onEdit} className="p-2">
              <FA5 name="pen" size={14} color="#94a3b8" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} className="p-2">
              <FA5 name="trash-alt" size={14} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
