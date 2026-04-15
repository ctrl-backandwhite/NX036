import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onFavoriteToggle?: () => void;
  variant?: 'grid' | 'horizontal';
}

export function ProductCard({ product, onPress, onFavoriteToggle, variant = 'grid' }: ProductCardProps) {
  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="flex-row bg-white rounded-2xl p-3 mb-3 shadow-sm border border-slate-100"
        activeOpacity={0.7}>
        <View className="w-24 h-24 bg-slate-100 rounded-xl items-center justify-center">
          <Text className="text-4xl">📦</Text>
        </View>
        <View className="flex-1 ml-3 justify-between">
          <View>
            <Text className="text-xs text-slate-400 uppercase">{product.brand}</Text>
            <Text className="text-sm font-semibold text-slate-800 mt-0.5" numberOfLines={2}>
              {product.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-xs text-amber-500">⭐ {product.rating}</Text>
              <Text className="text-xs text-slate-400 ml-1">({product.reviewCount})</Text>
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-baseline">
              <Text className="text-base font-bold text-indigo-600">€{product.price.toFixed(2)}</Text>
              {product.originalPrice && (
                <Text className="text-xs text-slate-400 line-through ml-2">
                  €{product.originalPrice.toFixed(2)}
                </Text>
              )}
            </View>
            {product.discount && (
              <View className="bg-red-100 px-2 py-0.5 rounded-full">
                <Text className="text-xs font-semibold text-red-600">-{product.discount}%</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex-1 m-1.5"
      activeOpacity={0.7}>
      <View className="relative">
        <View className="h-36 bg-slate-100 rounded-xl items-center justify-center">
          <Text className="text-5xl">📦</Text>
        </View>
        {product.discount && (
          <View className="absolute top-2 left-2 bg-red-500 px-2 py-0.5 rounded-full">
            <Text className="text-xs font-bold text-white">-{product.discount}%</Text>
          </View>
        )}
        {onFavoriteToggle && (
          <TouchableOpacity
            onPress={onFavoriteToggle}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm">
            <Text className="text-sm">{product.isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="mt-2">
        <Text className="text-xs text-slate-400 uppercase">{product.brand}</Text>
        <Text className="text-sm font-semibold text-slate-800 mt-0.5" numberOfLines={2}>
          {product.name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-xs text-amber-500">⭐ {product.rating}</Text>
          <Text className="text-xs text-slate-400 ml-1">({product.reviewCount})</Text>
        </View>
        <View className="flex-row items-baseline mt-1.5">
          <Text className="text-base font-bold text-indigo-600">€{product.price.toFixed(2)}</Text>
          {product.originalPrice && (
            <Text className="text-xs text-slate-400 line-through ml-2">
              €{product.originalPrice.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
