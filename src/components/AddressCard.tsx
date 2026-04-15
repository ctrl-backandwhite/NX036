import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Address } from '../types';

interface AddressCardProps {
  address: Address;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  selected?: boolean;
  selectable?: boolean;
}

export function AddressCard({ address, onPress, onEdit, onDelete, selected = false, selectable = false }: AddressCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={`bg-white rounded-2xl p-4 mb-3 border-2 ${
        selected ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100'
      }`}
      activeOpacity={onPress ? 0.7 : 1}>
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          {selectable && (
            <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
              selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
            }`}>
              {selected && <Text className="text-white text-xs font-bold">✓</Text>}
            </View>
          )}
          <View className="bg-indigo-100 px-3 py-1 rounded-full">
            <Text className="text-xs font-semibold text-indigo-600">{address.label}</Text>
          </View>
          {address.isDefault && (
            <View className="bg-emerald-100 px-2 py-0.5 rounded-full ml-2">
              <Text className="text-xs text-emerald-700">Predeterminada</Text>
            </View>
          )}
        </View>
        <View className="flex-row">
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
      <Text className="text-base font-semibold text-slate-800">{address.fullName}</Text>
      <Text className="text-sm text-slate-600 mt-1">{address.street}</Text>
      <Text className="text-sm text-slate-600">{address.city}, {address.state} {address.zipCode}</Text>
      <Text className="text-sm text-slate-600">{address.country}</Text>
      <Text className="text-sm text-slate-500 mt-1">📞 {address.phone}</Text>
    </TouchableOpacity>
  );
}
