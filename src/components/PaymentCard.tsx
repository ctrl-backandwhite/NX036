import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { PaymentMethod } from '../types';

const cardBrandIcons: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  discover: '💳',
};

const paymentTypeIcons: Record<string, string> = {
  credit_card: '💳',
  debit_card: '💳',
  paypal: '🅿️',
  apple_pay: '🍎',
  google_pay: '🔵',
  bank_transfer: '🏦',
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
  const icon = payment.cardBrand
    ? cardBrandIcons[payment.cardBrand]
    : paymentTypeIcons[payment.type];

  const brandLabel = payment.cardBrand
    ? payment.cardBrand.charAt(0).toUpperCase() + payment.cardBrand.slice(1)
    : payment.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={`bg-white rounded-2xl p-4 mb-3 border-2 ${
        selected ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100'
      }`}
      activeOpacity={onPress ? 0.7 : 1}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {selectable && (
            <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
              selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
            }`}>
              {selected && <Text className="text-white text-xs font-bold">✓</Text>}
            </View>
          )}
          <View className="w-12 h-12 bg-slate-100 rounded-xl items-center justify-center">
            <Text className="text-2xl">{icon}</Text>
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
              <Text className="text-slate-400">✏️</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} className="p-2">
              <Text className="text-slate-400">🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
