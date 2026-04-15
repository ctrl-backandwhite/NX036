import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockCategories, mockProducts, mockUser, mockNotifications } from '../../data/mockData';
import { ProductCard } from '../../components/ProductCard';
import { CategoryCard } from '../../components/CategoryCard';
import { SectionHeader, Badge } from '../../components/Shared';

export function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const unreadNotifications = mockNotifications.filter(n => !n.isRead).length;
  const featuredProducts = mockProducts.filter(p => p.discount);
  const popularProducts = mockProducts.filter(p => p.rating >= 4.5);

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-sm text-slate-500">¡Hola de nuevo! 👋</Text>
          <Text className="text-xl font-bold text-slate-800">{mockUser.firstName} {mockUser.lastName}</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="relative" onPress={() => navigation.navigate('Notifications')}>
            <Text className="text-2xl">🔔</Text>
            <Badge count={unreadNotifications} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileTab')}
            className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center">
            <Text className="text-lg font-bold text-indigo-600">
              {mockUser.firstName[0]}{mockUser.lastName[0]}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Search')}
        className="mx-5 mt-4 flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 py-3.5">
        <Text className="text-lg mr-3">🔍</Text>
        <Text className="text-base text-slate-400">¿Qué estás buscando?</Text>
      </TouchableOpacity>

      {/* Loyalty Points Banner */}
      <TouchableOpacity
        onPress={() => navigation.navigate('ProfileTab', { screen: 'LoyaltyPoints' })}
        className="mx-5 mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 flex-row items-center justify-between"
        style={{ backgroundColor: '#4F46E5' }}>
        <View>
          <Text className="text-white/80 text-xs font-medium">Tus puntos de fidelidad</Text>
          <Text className="text-white text-2xl font-bold mt-0.5">{mockUser.loyaltyPoints.toLocaleString()} pts</Text>
          <Text className="text-white/70 text-xs mt-1">Nivel {mockUser.loyaltyTier.toUpperCase()} 🏆</Text>
        </View>
        <View className="bg-white/20 rounded-xl px-4 py-2">
          <Text className="text-white text-sm font-semibold">Canjear →</Text>
        </View>
      </TouchableOpacity>

      {/* Categories */}
      <View className="mt-6 px-5">
        <SectionHeader
          title="Categorías"
          action="Ver todas"
          onAction={() => navigation.navigate('Categories')}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-5">
        {mockCategories.slice(0, 6).map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            variant="chip"
            onPress={() => navigation.navigate('CategoryProducts', { category })}
          />
        ))}
      </ScrollView>

      {/* Flash Deals */}
      {featuredProducts.length > 0 && (
        <View className="mt-6">
          <View className="px-5">
            <SectionHeader title="🔥 Ofertas Flash" action="Ver más" onAction={() => {}} />
          </View>
          <FlatList
            data={featuredProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-3.5"
            renderItem={({ item }) => (
              <View className="w-44">
                <ProductCard
                  product={item}
                  onPress={() => navigation.navigate('ProductDetail', { product: item })}
                  onFavoriteToggle={() => {}}
                />
              </View>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )}

      {/* Popular Products */}
      <View className="mt-6 px-5">
        <SectionHeader title="⭐ Más Populares" action="Ver todos" onAction={() => {}} />
        {popularProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            variant="horizontal"
            onPress={() => navigation.navigate('ProductDetail', { product })}
            onFavoriteToggle={() => {}}
          />
        ))}
      </View>

      {/* Recently Viewed */}
      <View className="mt-6 px-5 pb-6">
        <SectionHeader title="🕐 Vistos Recientemente" />
        <FlatList
          data={mockProducts.slice(0, 4)}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="w-44">
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
              />
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </ScrollView>
  );
}
