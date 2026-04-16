import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import type { Product } from '../types';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  variant?: 'grid' | 'horizontal';
  cardWidth?: number;
}

export const ProductCard = memo(function ProductCard({ product, onPress, variant = 'grid', cardWidth }: ProductCardProps) {
  const imageUri = product.images?.[0] ?? '';
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(product.id);

  const discount = product.originalPrice && product.originalPrice > (product.price ?? 0)
    ? Math.round(((product.originalPrice - (product.price ?? 0)) / product.originalPrice) * 100)
    : 0;

  const imageSource = imageUri ? { uri: imageUri } : undefined;

  const handleAddToCart = useCallback(() => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price ?? 0,
      image: product.images?.[0],
    });
  }, [addToCart, product]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(product.id);
  }, [toggleFavorite, product.id]);

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="flex-row bg-white rounded-lg p-3 mb-3 border border-gray-200"
        activeOpacity={0.7}>
        <View className="w-24 h-24 bg-gray-100 rounded-lg items-center justify-center overflow-hidden">
          {imageSource ? (
            <Image
              source={imageSource}
              className="w-full h-full"
              resizeMode="contain"
              fadeDuration={0}
            />
          ) : (
            <FA5 name="box-open" size={32} color="#cbd5e1" solid />
          )}
        </View>
        <View className="flex-1 ml-3 justify-between">
          <View>
            <Text className="text-[10px] text-gray-400 uppercase tracking-wider">{product.brand}</Text>
            <Text className="text-sm text-gray-900 mt-0.5" numberOfLines={2}>
              {product.name}
            </Text>
            {(product.rating ?? 0) > 0 && (
              <View className="flex-row items-center mt-1">
                <Text className="text-xs text-amber-400">⭐ {product.rating}</Text>
                <Text className="text-xs text-gray-500 ml-1">({product.reviewCount})</Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-baseline">
              <Text className="text-base font-semibold text-gray-900">${(product.price ?? 0).toFixed(2)}</Text>
              {product.originalPrice && (
                <Text className="text-xs text-gray-500 line-through ml-2">
                  ${(product.originalPrice ?? 0).toFixed(2)}
                </Text>
              )}
            </View>
            {discount > 0 && (
              <View className="bg-red-500 px-2 py-0.5 rounded">
                <Text className="text-xs font-bold text-white">-{discount}%</Text>
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
      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
      style={cardWidth ? { width: cardWidth } : undefined}
      activeOpacity={0.7}>
      {/* Image */}
      <View className="relative bg-gray-100 items-center justify-center overflow-hidden" style={{ height: cardWidth || 150 }}>
        {imageSource ? (
          <Image
            source={imageSource}
            className="w-full h-full"
            resizeMode="contain"
            fadeDuration={0}
            style={{ padding: 12 }}
          />
        ) : (
          <FA5 name="box-open" size={40} color="#cbd5e1" solid />
        )}
        {discount > 0 && (
          <View className="absolute top-2 left-2 bg-red-500 px-2 py-0.5 rounded">
            <Text className="text-xs font-bold text-white">-{discount}%</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={handleToggleFavorite}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full items-center justify-center shadow-sm border ${liked ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
          <FA5 name="heart" size={14} color={liked ? '#ef4444' : '#d1d5db'} solid />
        </TouchableOpacity>
        {(product.stockQuantity ?? 0) > 0 && (product.stockQuantity ?? 0) < 10 && (
          <View className="absolute bottom-2 left-2 bg-amber-500 px-2 py-0.5 rounded">
            <Text className="text-xs font-bold text-white">¡Últimas!</Text>
          </View>
        )}
      </View>

      {/* Content — matching web layout */}
      <View className="p-3">
        <Text className="text-[10px] text-gray-400 uppercase tracking-wider" numberOfLines={1}>{product.brand}</Text>
        <Text className="text-sm text-gray-900 mt-0.5 mb-1" numberOfLines={2}>
          {product.name}
        </Text>
        {(product.rating ?? 0) > 0 && (
          <View className="flex-row items-center mb-1">
            <Text className="text-xs text-amber-400">⭐ {product.rating}</Text>
            <Text className="text-xs text-gray-500 ml-1">({product.reviewCount})</Text>
          </View>
        )}

        {/* Price */}
        <View className="flex-row items-baseline mb-2">
          <Text className="text-lg text-gray-900">${(product.price ?? 0).toFixed(2)}</Text>
          {product.originalPrice && product.originalPrice > (product.price ?? 0) && (
            <Text className="text-xs text-gray-500 line-through ml-2">
              ${(product.originalPrice ?? 0).toFixed(2)}
            </Text>
          )}
        </View>

        {/* Add to Cart — matching web bg-gray-200 text-gray-700 */}
        <TouchableOpacity
          onPress={handleAddToCart}
          className="bg-gray-200 rounded-lg py-2 items-center flex-row justify-center">
          <FA5 name="shopping-cart" size={12} color="#374151" solid />
          <Text className="text-sm text-gray-700 ml-2">Agregar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});
