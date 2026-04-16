import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Button } from '../../components/Button';
import { PriceRow, EmptyState } from '../../components/Shared';
import FA5 from 'react-native-vector-icons/FontAwesome5';

export function CartScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { items, isLoading, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.21;
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center" style={{ paddingTop: insets.top }}>
        <FA5 name="spinner" size={24} color="#1f2937" />
        <Text className="text-slate-400 mt-3 text-sm">Cargando carrito...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
        <EmptyState
          icon="shopping-cart"
          title="Tu carrito está vacío"
          description="Explora nuestros productos y añade lo que te guste."
          actionTitle="Explorar productos"
          onAction={() => navigation.navigate('HomeTab')}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100">
        <Text className="text-2xl font-bold text-slate-800">Carrito</Text>
        <Text className="text-sm text-slate-500">{items.length} artículo{items.length !== 1 ? 's' : ''}</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View className="px-5 pt-4">
          {items.map(item => {
            const liked = isFavorite(item.productId);
            return (
              <View key={item.id} className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
                <View className="flex-row">
                  {/* Product image */}
                  <View className="w-24 h-24 bg-gray-100 rounded-xl items-center justify-center overflow-hidden">
                    {item.productImage ? (
                      <Image source={{ uri: item.productImage }} className="w-full h-full" resizeMode="contain" />
                    ) : (
                      <FA5 name="box-open" size={28} color="#94a3b8" solid />
                    )}
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-sm font-semibold text-slate-800" numberOfLines={2}>{item.productName}</Text>

                    {/* Variant attributes */}
                    {item.selectedAttrs && Object.keys(item.selectedAttrs).length > 0 && (
                      <View className="flex-row flex-wrap mt-1 gap-1">
                        {Object.entries(item.selectedAttrs).map(([k, v]) => (
                          <View key={k} className="bg-gray-100 px-2 py-0.5 rounded">
                            <Text className="text-[11px] text-gray-500">{k}: {v as string}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Favorite & Delete buttons */}
                    <View className="flex-row items-center gap-2 mt-2">
                      <TouchableOpacity
                        onPress={() => {
                          const wasLiked = isFavorite(item.productId);
                          toggleFavorite(item.productId);
                          if (!wasLiked) removeFromCart(item.id);
                        }}
                        className={`w-8 h-8 rounded-full border items-center justify-center ${liked ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
                        <FA5 name="heart" size={13} color={liked ? '#ef4444' : '#9ca3af'} solid />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full border border-gray-200 items-center justify-center">
                        <FA5 name="trash-alt" size={13} color="#9ca3af" />
                      </TouchableOpacity>
                    </View>

                    {/* Quantity & Price */}
                    <View className="flex-row items-center justify-between mt-2">
                      <View className="flex-row items-center bg-slate-100 rounded-lg">
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 items-center justify-center">
                          <FA5 name="minus" size={10} color="#475569" />
                        </TouchableOpacity>
                        <Text className="text-sm font-semibold text-slate-800 w-8 text-center">{item.quantity}</Text>
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 items-center justify-center">
                          <FA5 name="plus" size={10} color="#475569" />
                        </TouchableOpacity>
                      </View>
                      <View className="items-end">
                        <Text className="text-base font-bold text-gray-900">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </Text>
                        {item.quantity > 1 && (
                          <Text className="text-xs text-gray-400">${item.unitPrice.toFixed(2)} c/u</Text>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Summary */}
        <View className="px-5 pb-4">
          <View className="bg-white rounded-2xl p-4 border border-slate-100">
            <Text className="text-xs tracking-widest uppercase text-gray-400 mb-4">Resumen del Pedido</Text>
            <PriceRow label="Subtotal" value={subtotal} />
            <View className="flex-row justify-between py-1">
              <Text className="text-xs text-gray-400">Envío</Text>
              <Text className="text-xs text-gray-400">{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</Text>
            </View>
            <PriceRow label="Impuestos (est.)" value={tax} />
            <View className="border-t border-gray-100 mt-2 pt-3">
              <PriceRow label="Total estimado" value={total} isTotal />
            </View>

            {/* Free shipping message */}
            {subtotal < 50 && (
              <View className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3">
                <Text className="text-xs text-gray-600">
                  <FA5 name="truck" size={10} color="#6b7280" /> ¡Agrega ${(50 - subtotal).toFixed(2)} más para posible envío gratis!
                </Text>
              </View>
            )}

            {/* Security badges */}
            <View className="mt-4 pt-4 border-t border-gray-100">
              <View className="flex-row items-center mb-1">
                <FA5 name="check" size={10} color="#059669" solid />
                <Text className="text-xs text-gray-600 ml-2">Compra 100% segura</Text>
              </View>
              <View className="flex-row items-center mb-1">
                <FA5 name="check" size={10} color="#059669" solid />
                <Text className="text-xs text-gray-600 ml-2">Devoluciones gratuitas en 30 días</Text>
              </View>
              <View className="flex-row items-center">
                <FA5 name="check" size={10} color="#059669" solid />
                <Text className="text-xs text-gray-600 ml-2">Garantía de satisfacción</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom */}
      <View className="px-5 py-4 bg-white border-t border-slate-100" style={{ paddingBottom: insets.bottom + 16 }}>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-slate-500">Total estimado</Text>
          <Text className="text-2xl font-bold text-slate-800">${total.toFixed(2)}</Text>
        </View>
        <Button
          title="Proceder al pago"
          onPress={() => navigation.navigate('Checkout', { subtotal, shipping, discount: 0, tax, total })}
          size="lg"
          fullWidth
        />
        <TouchableOpacity onPress={() => navigation.navigate('HomeTab')} className="mt-2 py-2 items-center">
          <Text className="text-sm text-gray-500">Continuar comprando</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
