import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Divider, PriceRow } from '../../components/Shared';
import type { Product } from '../../types';

export function ProductDetailScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const product: Product = route.params.product;
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(product.isFavorite);
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="absolute top-2 left-4 right-4 z-10 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-sm">
            <Text className="text-xl">←</Text>
          </TouchableOpacity>
          <View className="flex-row gap-2">
            <TouchableOpacity className="w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-sm">
              <Text className="text-lg">📤</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsFavorite(!isFavorite)}
              className="w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-sm">
              <Text className="text-lg">{isFavorite ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image */}
        <View className="h-80 bg-slate-100 items-center justify-center">
          <Text className="text-8xl">📦</Text>
          {product.discount && (
            <View className="absolute bottom-4 left-4 bg-red-500 px-3 py-1 rounded-full">
              <Text className="text-sm font-bold text-white">-{product.discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Image dots */}
        <View className="flex-row justify-center py-3 gap-1.5">
          {product.images.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImageIndex(index)}
              className={`h-2 rounded-full ${index === selectedImageIndex ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-300'}`}
            />
          ))}
        </View>

        {/* Info */}
        <View className="px-5">
          <Text className="text-xs text-indigo-600 font-semibold uppercase">{product.brand}</Text>
          <Text className="text-2xl font-bold text-slate-800 mt-1">{product.name}</Text>

          {/* Rating */}
          <View className="flex-row items-center mt-2">
            <View className="flex-row items-center bg-amber-50 px-2 py-1 rounded-lg">
              <Text className="text-sm text-amber-500">⭐ {product.rating}</Text>
            </View>
            <Text className="text-sm text-slate-500 ml-2">({product.reviewCount} reseñas)</Text>
            <View className="flex-row items-center ml-3">
              <View className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-red-500'} mr-1`} />
              <Text className={`text-sm ${product.inStock ? 'text-emerald-600' : 'text-red-600'}`}>
                {product.inStock ? 'En stock' : 'Agotado'}
              </Text>
            </View>
          </View>

          {/* Price */}
          <View className="flex-row items-baseline mt-4">
            <Text className="text-3xl font-bold text-indigo-600">€{product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text className="text-lg text-slate-400 line-through ml-3">€{product.originalPrice.toFixed(2)}</Text>
            )}
            {product.discount && (
              <View className="bg-red-100 px-2 py-0.5 rounded-full ml-3">
                <Text className="text-sm font-semibold text-red-600">Ahorras €{((product.originalPrice || product.price) - product.price).toFixed(2)}</Text>
              </View>
            )}
          </View>

          {/* Loyalty points earned */}
          <View className="flex-row items-center mt-3 bg-amber-50 px-3 py-2 rounded-xl">
            <Text className="text-sm mr-2">🏆</Text>
            <Text className="text-sm text-amber-800">
              Gana <Text className="font-bold">{Math.floor(product.price)}</Text> puntos de fidelidad con esta compra
            </Text>
          </View>

          <Divider className="my-4" />

          {/* Description */}
          <Text className="text-base font-semibold text-slate-800 mb-2">Descripción</Text>
          <Text className="text-sm text-slate-600 leading-5" numberOfLines={showFullDescription ? undefined : 3}>
            {product.description}
          </Text>
          <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)} className="mt-1">
            <Text className="text-sm font-semibold text-indigo-600">
              {showFullDescription ? 'Ver menos' : 'Leer más'}
            </Text>
          </TouchableOpacity>

          <Divider className="my-4" />

          {/* Specifications */}
          <Text className="text-base font-semibold text-slate-800 mb-3">Especificaciones</Text>
          {product.specifications.map((spec, index) => (
            <View key={index} className={`flex-row justify-between py-2.5 ${index > 0 ? 'border-t border-slate-100' : ''}`}>
              <Text className="text-sm text-slate-500">{spec.label}</Text>
              <Text className="text-sm font-medium text-slate-800">{spec.value}</Text>
            </View>
          ))}

          <Divider className="my-4" />

          {/* Quantity */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-semibold text-slate-800">Cantidad</Text>
            <View className="flex-row items-center bg-slate-100 rounded-xl">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 items-center justify-center">
                <Text className="text-xl text-slate-600">−</Text>
              </TouchableOpacity>
              <Text className="text-base font-semibold text-slate-800 w-10 text-center">{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="w-10 h-10 items-center justify-center">
                <Text className="text-xl text-slate-600">+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tags */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {product.tags.map(tag => (
              <View key={tag} className="bg-slate-100 px-3 py-1 rounded-full">
                <Text className="text-xs text-slate-600">🏷️ {tag}</Text>
              </View>
            ))}
          </View>

          {/* SKU */}
          <Text className="text-xs text-slate-400 mb-6">SKU: {product.sku}</Text>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View className="px-5 py-4 bg-white border-t border-slate-100 flex-row items-center gap-3" style={{ paddingBottom: insets.bottom + 16 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CartTab')}
          className="w-14 h-14 bg-slate-100 rounded-xl items-center justify-center">
          <Text className="text-2xl">🛒</Text>
        </TouchableOpacity>
        <View className="flex-1">
          <Button
            title={`Añadir al carrito · €${(product.price * quantity).toFixed(2)}`}
            onPress={() => navigation.navigate('CartTab')}
            size="lg"
            fullWidth
            disabled={!product.inStock}
          />
        </View>
      </View>
    </View>
  );
}
