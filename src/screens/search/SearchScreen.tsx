import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../services/api';
import { ProductCard } from '../../components/ProductCard';
import FA5 from 'react-native-vector-icons/FontAwesome5';

const recentSearches = ['iPhone', 'Nike', 'Sofá', 'Sérum facial', 'MacBook'];

export function SearchScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => { });
  }, []);

  // Autocomplete
  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(() => {
      api.autocomplete(query).then(setSuggestions).catch(() => setSuggestions([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setIsSearching(true);
    setLoading(true);
    setSuggestions([]);
    api.searchProducts(q)
      .then(data => setResults(data.results ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      {/* Search Header */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FA5 name="arrow-left" size={18} color="#475569" />
          </TouchableOpacity>
          <View className="flex-1 flex-row items-center bg-slate-100 rounded-xl px-4 py-2.5">
            <FA5 name="search" size={16} color="#64748b" style={{ marginRight: 8 }} />
            <TextInput
              className="flex-1 text-base text-slate-800"
              placeholder="Buscar productos, marcas..."
              placeholderTextColor="#94A3B8"
              value={query}
              onChangeText={(text) => { setQuery(text); if (!text) { setIsSearching(false); setResults([]); } }}
              onSubmitEditing={() => doSearch(query)}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => { setQuery(''); setIsSearching(false); setResults([]); setSuggestions([]); }}>
                <Text className="text-slate-400 text-lg">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Autocomplete suggestions */}
      {suggestions.length > 0 && !isSearching && (
        <View className="bg-white border-b border-slate-100 px-5 py-2">
          {suggestions.slice(0, 6).map((s, i) => (
            <TouchableOpacity key={i} onPress={() => doSearch(s.text)} className="py-2 border-b border-slate-50">
              <Text className="text-sm text-slate-700">{s.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {isSearching ? (
        /* Search Results */
        loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#1f2937" />
          </View>
        ) : (
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

              />
            )}
            keyExtractor={(item: any) => String(item.id)}
            ListEmptyComponent={
              <View className="items-center py-16">
                <FA5 name="search" size={40} color="#94a3b8" style={{ marginBottom: 16 }} />
                <Text className="text-lg font-semibold text-slate-700">Sin resultados</Text>
                <Text className="text-sm text-slate-500 text-center mt-1">
                  No encontramos productos para "{query}".{'\n'}Prueba con otro término.
                </Text>
              </View>
            }
          />
        )
      ) : (
        <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          <Text className="text-base font-bold text-slate-800 mb-3">Búsquedas recientes</Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {recentSearches.map(term => (
              <TouchableOpacity
                key={term}
                onPress={() => doSearch(term)}
                className="flex-row items-center bg-white border border-slate-200 rounded-full px-3 py-2">
                <FA5 name="clock" size={10} color="#94a3b8" solid style={{ marginRight: 6 }} />
                <Text className="text-sm text-slate-600">{term}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Popular Categories */}
          <Text className="text-base font-bold text-slate-800 mt-2 mb-3">Categorías populares</Text>
          <View className="flex-row flex-wrap gap-2 pb-6">
            {categories.slice(0, 6).map((cat: any) => (
              <TouchableOpacity
                key={String(cat.id)}
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
