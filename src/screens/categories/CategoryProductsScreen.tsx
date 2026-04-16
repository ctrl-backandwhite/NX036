import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../services/api';
import { ProductCard } from '../../components/ProductCard';
import type { Category } from '../../types';
import FA5 from 'react-native-vector-icons/FontAwesome5';

export function CategoryProductsScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const category: Category = route.params.category;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts({ categoryId: String(category.id) })
      .then(data => setProducts(data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category.id]);

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3 flex-row items-center justify-between bg-white border-b border-slate-100">
        <View className="flex-row items-center flex-1 mr-3">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <FA5 name="arrow-left" size={18} color="#475569" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-slate-800" numberOfLines={1}>{category.name}</Text>
            <Text className="text-xs text-slate-500">{products.length} productos</Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setViewMode('grid')}
            className={`p-2.5 rounded-lg ${viewMode === 'grid' ? 'bg-gray-800' : 'bg-slate-100'}`}>
            <FA5 name="th-large" size={14} color={viewMode === 'grid' ? '#ffffff' : '#64748b'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            className={`p-2.5 rounded-lg ${viewMode === 'list' ? 'bg-gray-800' : 'bg-slate-100'}`}>
            <FA5 name="list" size={14} color={viewMode === 'list' ? '#ffffff' : '#64748b'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Subcategories */}
      {category.subcategories && (
        <View className="bg-white border-b border-slate-100">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12 }}>
            <TouchableOpacity
              onPress={() => setSelectedSubcategory(null)}
              className={`px-4 py-2 rounded-full mr-2.5 ${!selectedSubcategory ? 'bg-gray-800' : 'bg-slate-100'}`}>
              <Text className={`text-sm font-medium ${!selectedSubcategory ? 'text-white' : 'text-slate-600'}`}>
                Todos
              </Text>
            </TouchableOpacity>
            {category.subcategories.map(sub => (
              <TouchableOpacity
                key={sub.id}
                onPress={() => setSelectedSubcategory(sub.id)}
                className={`px-4 py-2 rounded-full mr-2.5 ${selectedSubcategory === sub.id ? 'bg-gray-800' : 'bg-slate-100'}`}>
                <Text
                  className={`text-sm font-medium ${selectedSubcategory === sub.id ? 'text-white' : 'text-slate-600'}`}
                  numberOfLines={1}>
                  {sub.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Sort & Filter Bar */}
      <View className="flex-row px-5 py-3 gap-3">
        <TouchableOpacity className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
          <FA5 name="sort" size={12} color="#64748b" style={{ marginRight: 4 }} />
          <Text className="text-sm text-slate-600">Ordenar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
          <FA5 name="sliders-h" size={12} color="#64748b" style={{ marginRight: 4 }} />
          <Text className="text-sm text-slate-600">Filtrar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
          <Text className="text-sm text-slate-600">€ Precio</Text>
        </TouchableOpacity>
      </View>

      {/* Products */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1f2937" />
          <Text className="text-slate-400 mt-3 text-sm">Cargando productos...</Text>
        </View>
      ) : viewMode === 'grid' ? (
        <FlatList
          data={products}
          numColumns={2}
          contentContainerClassName="px-3.5 pb-6"
          renderItem={({ item }) => (
            <View className="flex-1">
              <ProductCard
                product={item}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}

              />
            </View>
          )}
          keyExtractor={(item: any) => String(item.id)}
          ListEmptyComponent={
            <View className="items-center py-16">
              <FA5 name={category.icon || 'box'} size={40} color="#94a3b8" solid style={{ marginBottom: 12 }} />
              <Text className="text-lg font-semibold text-slate-600">No hay productos</Text>
              <Text className="text-sm text-slate-400 mt-1">Pronto añadiremos más productos a esta categoría</Text>
            </View>
          }
        />
      ) : (
        <ScrollView className="px-5 pb-6" showsVerticalScrollIndicator={false}>
          {products.map((product: any) => (
            <ProductCard
              key={String(product.id)}
              product={product}
              variant="horizontal"
              onPress={() => navigation.navigate('ProductDetail', { product })}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
