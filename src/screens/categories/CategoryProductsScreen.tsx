import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockProducts } from '../../data/mockData';
import { ProductCard } from '../../components/ProductCard';
import type { Category } from '../../types';

export function CategoryProductsScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const category: Category = route.params.category;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const products = mockProducts.filter(p => p.categoryId === category.id);

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3 flex-row items-center justify-between bg-white border-b border-slate-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <Text className="text-2xl text-slate-600">←</Text>
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-slate-800">{category.name}</Text>
            <Text className="text-xs text-slate-500">{category.productCount} productos</Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100' : 'bg-slate-100'}`}>
            <Text className="text-sm">▦</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100' : 'bg-slate-100'}`}>
            <Text className="text-sm">☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subcategories */}
      {category.subcategories && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="bg-white border-b border-slate-100"
          contentContainerClassName="px-5 py-3">
          <TouchableOpacity
            onPress={() => setSelectedSubcategory(null)}
            className={`px-4 py-2 rounded-full mr-2 ${
              !selectedSubcategory ? 'bg-indigo-600' : 'bg-slate-100'
            }`}>
            <Text className={`text-sm font-medium ${!selectedSubcategory ? 'text-white' : 'text-slate-600'}`}>
              Todos
            </Text>
          </TouchableOpacity>
          {category.subcategories.map(sub => (
            <TouchableOpacity
              key={sub.id}
              onPress={() => setSelectedSubcategory(sub.id)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedSubcategory === sub.id ? 'bg-indigo-600' : 'bg-slate-100'
              }`}>
              <Text className={`text-sm font-medium ${selectedSubcategory === sub.id ? 'text-white' : 'text-slate-600'}`}>
                {sub.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Sort & Filter Bar */}
      <View className="flex-row px-5 py-3 gap-3">
        <TouchableOpacity className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
          <Text className="text-sm mr-1">↕️</Text>
          <Text className="text-sm text-slate-600">Ordenar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
          <Text className="text-sm mr-1">⚙️</Text>
          <Text className="text-sm text-slate-600">Filtrar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
          <Text className="text-sm text-slate-600">€ Precio</Text>
        </TouchableOpacity>
      </View>

      {/* Products */}
      {viewMode === 'grid' ? (
        <FlatList
          data={products}
          numColumns={2}
          contentContainerClassName="px-3.5 pb-6"
          renderItem={({ item }) => (
            <View className="flex-1">
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                onFavoriteToggle={() => {}}
              />
            </View>
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View className="items-center py-16">
              <Text className="text-5xl mb-3">{category.icon}</Text>
              <Text className="text-lg font-semibold text-slate-600">No hay productos</Text>
              <Text className="text-sm text-slate-400 mt-1">Pronto añadiremos más productos a esta categoría</Text>
            </View>
          }
        />
      ) : (
        <ScrollView className="px-5 pb-6" showsVerticalScrollIndicator={false}>
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              variant="horizontal"
              onPress={() => navigation.navigate('ProductDetail', { product })}
              onFavoriteToggle={() => {}}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
