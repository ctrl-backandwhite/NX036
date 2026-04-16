import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import { api } from '../../services/api';
import { CategoryCard } from '../../components/CategoryCard';

export function CategoriesScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories()
      .then(data => setCategories(data ?? []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = categories[0];

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-slate-800">Categorías</Text>
        <Text className="text-sm text-slate-500 mt-1">Explora todas nuestras categorías</Text>
      </View>

      {loading ? (
        <View className="items-center py-12">
          <ActivityIndicator size="large" color="#1f2937" />
        </View>
      ) : (
        <>
          {/* Featured Category Banner */}
          {featured && (
            <TouchableOpacity
              className="mx-5 mt-4 bg-gray-800 rounded-2xl p-5 flex-row items-center justify-between"
              onPress={() => navigation.navigate('CategoryProducts', { category: featured })}>
              <View className="flex-1">
                <Text className="text-white/80 text-xs font-medium uppercase">Destacado</Text>
                <Text className="text-white text-xl font-bold mt-1">{featured.name}</Text>
                <Text className="text-white/70 text-sm mt-1">Hasta 30% de descuento</Text>
              </View>
              <FA5 name={featured.icon} size={40} color="#ffffff" solid />
            </TouchableOpacity>
          )}

          {/* All Categories Grid */}
          <View className="px-5 mt-6 pb-6">
            <Text className="text-lg font-bold text-slate-800 mb-4">Todas las categorías</Text>
            <View className="flex-row flex-wrap justify-between">
              {categories.map((category: any) => (
                <CategoryCard
                  key={String(category.id)}
                  category={category}
                  onPress={() => navigation.navigate('CategoryProducts', { category })}
                />
              ))}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}
