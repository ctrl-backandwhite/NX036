import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockProducts, mockCategories } from '../../data/mockData';
import { ProductCard } from '../../components/ProductCard';

const recentSearches = ['iPhone', 'Nike', 'Sofá', 'Sérum facial', 'MacBook'];
const trendingSearches = ['AirPods Pro', 'Samsung Galaxy', 'Yoga Mat', 'Kindle', 'Crema hidratante'];

export function SearchScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const results = query.length > 0
    ? mockProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      {/* Search Header */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-2xl text-slate-600">←</Text>
          </TouchableOpacity>
          <View className="flex-1 flex-row items-center bg-slate-100 rounded-xl px-4 py-2.5">
            <Text className="text-lg mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-base text-slate-800"
              placeholder="Buscar productos, marcas..."
              placeholderTextColor="#94A3B8"
              value={query}
              onChangeText={(text) => { setQuery(text); setIsSearching(text.length > 0); }}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => { setQuery(''); setIsSearching(false); }}>
                <Text className="text-slate-400 text-lg">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {isSearching ? (
        /* Search Results */
        <FlatList
          data={results}
          contentContainerClassName="px-5 pt-4 pb-6"
          ListHeaderComponent={
            <Text className="text-sm text-slate-500 mb-3">{results.length} resultado{results.length !== 1 ? 's' : ''} para "{query}"</Text>
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              variant="horizontal"
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
              onFavoriteToggle={() => {}}
            />
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View className="items-center py-16">
              <Text className="text-5xl mb-4">🔍</Text>
              <Text className="text-lg font-semibold text-slate-700">Sin resultados</Text>
              <Text className="text-sm text-slate-500 text-center mt-1">
                No encontramos productos para "{query}".{'\n'}Prueba con otro término.
              </Text>
            </View>
          }
        />
      ) : (
        <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          <Text className="text-base font-bold text-slate-800 mb-3">Búsquedas recientes</Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {recentSearches.map(term => (
              <TouchableOpacity
                key={term}
                onPress={() => { setQuery(term); setIsSearching(true); }}
                className="flex-row items-center bg-white border border-slate-200 rounded-full px-3 py-2">
                <Text className="text-xs text-slate-400 mr-1.5">🕐</Text>
                <Text className="text-sm text-slate-600">{term}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Trending */}
          <Text className="text-base font-bold text-slate-800 mb-3">🔥 Tendencias</Text>
          {trendingSearches.map((term, index) => (
            <TouchableOpacity
              key={term}
              onPress={() => { setQuery(term); setIsSearching(true); }}
              className="flex-row items-center py-3 border-b border-slate-100">
              <Text className={`text-base font-bold mr-3 ${index < 3 ? 'text-indigo-600' : 'text-slate-400'}`}>
                {index + 1}
              </Text>
              <Text className="text-base text-slate-700">{term}</Text>
            </TouchableOpacity>
          ))}

          {/* Popular Categories */}
          <Text className="text-base font-bold text-slate-800 mt-6 mb-3">Categorías populares</Text>
          <View className="flex-row flex-wrap gap-2 pb-6">
            {mockCategories.slice(0, 6).map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => navigation.navigate('CategoryProducts', { category: cat })}
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 items-center"
                style={{ width: '48%' }}>
                <Text className="text-2xl mb-1">{cat.icon}</Text>
                <Text className="text-sm font-medium text-slate-700">{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
