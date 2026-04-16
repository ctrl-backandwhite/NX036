import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FA5 from 'react-native-vector-icons/FontAwesome5';
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
      className={`bg-white rounded-2xl p-4 mb-3 border-2 ${selected ? 'border-gray-800 bg-gray-50' : 'border-gray-200'
        }`}
      activeOpacity={onPress ? 0.7 : 1}>
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          {selectable && (
            <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${selected ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
              }`}>
              {selected && <Text className="text-white text-xs font-bold">✓</Text>}
            </View>
          )}
          <View className="bg-gray-100 px-3 py-1 rounded-full">
            <Text className="text-xs font-semibold text-gray-800">{address.label}</Text>
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
      <Text className="text-base font-semibold text-slate-800">{address.fullName}</Text>
      <Text className="text-sm text-slate-600 mt-1">{address.street}</Text>
      <Text className="text-sm text-slate-600">{address.city}, {address.state} {address.zipCode}</Text>
      <Text className="text-sm text-slate-600">{address.country}</Text>
      <View className="flex-row items-center mt-1">
        <FA5 name="phone-alt" size={12} color="#64748b" />
        <Text className="text-sm text-slate-500 ml-1.5">{address.phone}</Text>
      </View>
    </TouchableOpacity>
  );
}
