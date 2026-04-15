import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockCategories } from '../../data/mockData';
import { CategoryCard } from '../../components/CategoryCard';

export function CategoriesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-slate-800">Categorías</Text>
        <Text className="text-sm text-slate-500 mt-1">Explora todas nuestras categorías</Text>
      </View>

      {/* Featured Category Banner */}
      <TouchableOpacity
        className="mx-5 mt-4 bg-indigo-600 rounded-2xl p-5 flex-row items-center justify-between"
        onPress={() => navigation.navigate('CategoryProducts', { category: mockCategories[0] })}>
        <View className="flex-1">
          <Text className="text-white/80 text-xs font-medium uppercase">Destacado</Text>
          <Text className="text-white text-xl font-bold mt-1">Electrónica</Text>
          <Text className="text-white/70 text-sm mt-1">Hasta 30% de descuento</Text>
        </View>
        <Text className="text-5xl">📱</Text>
      </TouchableOpacity>

      {/* All Categories Grid */}
      <View className="px-5 mt-6 pb-6">
        <Text className="text-lg font-bold text-slate-800 mb-4">Todas las categorías</Text>
        <View className="flex-row flex-wrap justify-between">
          {mockCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={() => navigation.navigate('CategoryProducts', { category })}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
