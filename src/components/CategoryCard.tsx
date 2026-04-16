import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  variant?: 'grid' | 'chip';
}

export function CategoryCard({ category, onPress, variant = 'grid' }: CategoryCardProps) {
  if (variant === 'chip') {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center bg-white border border-slate-200 rounded-full px-4 py-2.5 mr-2"
        activeOpacity={0.7}>
        <FA5 name={category.icon} size={16} color="#475569" solid style={{ marginRight: 8 }} />
        <Text className="text-sm font-medium text-slate-700">{category.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 items-center justify-center shadow-sm border border-slate-100 w-[48%] mb-3"
      activeOpacity={0.7}>
      <View className="w-16 h-16 bg-gray-100 rounded-lg items-center justify-center mb-2">
        <FA5 name={category.icon} size={28} color="#475569" solid />
      </View>
      <Text className="text-sm font-semibold text-slate-800 text-center">{category.name}</Text>
      <Text className="text-xs text-slate-400 mt-0.5">{category.productCount} productos</Text>
    </TouchableOpacity>
  );
}
