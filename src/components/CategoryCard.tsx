import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
        <Text className="text-lg mr-2">{category.icon}</Text>
        <Text className="text-sm font-medium text-slate-700">{category.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-4 items-center justify-center shadow-sm border border-slate-100 w-[48%] mb-3"
      activeOpacity={0.7}>
      <View className="w-16 h-16 bg-indigo-50 rounded-2xl items-center justify-center mb-2">
        <Text className="text-3xl">{category.icon}</Text>
      </View>
      <Text className="text-sm font-semibold text-slate-800 text-center">{category.name}</Text>
      <Text className="text-xs text-slate-400 mt-0.5">{category.productCount} productos</Text>
    </TouchableOpacity>
  );
}
