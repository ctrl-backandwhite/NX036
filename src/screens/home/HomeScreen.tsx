import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { ProductCard } from '../../components/ProductCard';
import { CategoryCard } from '../../components/CategoryCard';
import { SectionHeader } from '../../components/Shared';
import { PromoMosaic, type Slide } from '../../components/PromoMosaic';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 12;
const GRID_PADDING = 20;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;
const PAGE_SIZE = 24;

export function HomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const firstName = user?.firstName ?? 'Usuario';
  const lastName = user?.lastName ?? '';
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`;

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const paginationRef = useRef({ page: 0, hasNext: false, loading: false });

  useEffect(() => {
    Promise.all([api.getCategories(), api.getProductsPaged({ page: 0, size: PAGE_SIZE }), api.getActiveSlides().catch(() => [])])
      .then(([cats, pagedResult, activeSlides]) => {
        setSlides(activeSlides ?? []);
        setCategories(cats ?? []);
        setProducts(pagedResult.products);
        setHasNext(pagedResult.hasNext);
        setPage(0);
        paginationRef.current = { page: 0, hasNext: pagedResult.hasNext, loading: false };
        setFeaturedProducts((pagedResult.products).filter((p: any) => p.discount));
      })
      .catch(() => {
        setCategories([]);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadMore = useCallback(async () => {
    const ref = paginationRef.current;
    if (ref.loading || !ref.hasNext) return;
    ref.loading = true;
    setLoadingMore(true);
    try {
      const nextPage = ref.page + 1;
      const result = await api.getProductsPaged({ page: nextPage, size: PAGE_SIZE });
      setProducts(prev => [...prev, ...result.products]);
      setHasNext(result.hasNext);
      setPage(nextPage);
      ref.page = nextPage;
      ref.hasNext = result.hasNext;
    } catch {
      // silently fail
    } finally {
      setLoadingMore(false);
      // Cooldown: keep ref.loading true for 1.5s to prevent rapid-fire page loads
      setTimeout(() => { ref.loading = false; }, 1500);
    }
  }, []);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
    if (distanceFromBottom < 200) {
      loadMore();
    }
  }, [loadMore]);

  const handleSlidePress = useCallback((slide: Slide) => {
    // Parse link params to navigate to filtered products
    if (slide.link) {
      const params = new URLSearchParams(slide.link.replace(/^\/?\?/, ''));
      const category = params.get('category');
      if (category) {
        const found = categories.find((c: any) => c.name === category);
        if (found) {
          navigation.navigate('CategoryProducts', { category: found });
          return;
        }
      }
    }
    // Default: go to search
    navigation.navigate('Search');
  }, [categories, navigation]);

  // Build product rows (pairs) for manual grid — memoized to avoid recalc on unrelated re-renders
  const productRows = useMemo(() => {
    const rows: any[][] = [];
    for (let i = 0; i < products.length; i += 2) {
      rows.push(products.slice(i, i + 2));
    }
    return rows;
  }, [products]);

  if (loading) {
    return (
      <View className="flex-1 bg-muted items-center justify-center" style={{ paddingTop: insets.top }}>
        <ActivityIndicator size="large" color="#1f2937" />
        <Text className="text-muted-foreground mt-3 text-sm">Cargando tienda...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-muted"
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={200}
    >
      {/* Header */}
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between bg-white border-b border-border">
        <View>
          <Text className="text-sm text-muted-foreground">¡Hola de nuevo!</Text>
          <Text className="text-xl font-bold text-primary">{firstName} {lastName}</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity className="relative" onPress={() => navigation.navigate('Notifications')}>
            <FA5 name="bell" size={22} color="#1f2937" solid />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileTab')}
            className="w-10 h-10 bg-secondary rounded-full items-center justify-center">
            <Text className="text-lg font-bold text-primary">
              {initials}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Search')}
        className="mx-5 mt-4 flex-row items-center bg-white border border-border rounded-lg px-4 py-3.5">
        <FA5 name="search" size={16} color="#6b7280" />
        <Text className="text-base text-muted-foreground ml-3">¿Qué estás buscando?</Text>
      </TouchableOpacity>

      {/* Categories */}
      <View className="mt-6 px-5">
        <SectionHeader
          title="Categorías"
          action="Ver todas"
          onAction={() => navigation.navigate('CategoriesTab')}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-5">
        {categories.slice(0, 8).map((category: any) => (
          <CategoryCard
            key={String(category.id)}
            category={category}
            variant="chip"
            onPress={() => navigation.navigate('CategoryProducts', { category })}
          />
        ))}
      </ScrollView>

      {/* Promo Mosaic */}
      {slides.length > 0 && (
        <View className="mt-4">
          <PromoMosaic slides={slides} onSlidePress={handleSlidePress} />
        </View>
      )}

      {/* Flash Deals */}
      {featuredProducts.length > 0 && (
        <View className="mt-6">
          <View className="px-5">
            <SectionHeader title="Ofertas Flash" action="Ver más" onAction={() => { }} />
          </View>
          <FlatList
            data={featuredProducts.slice(0, 6)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-3.5"
            renderItem={({ item }) => (
              <View className="w-44">
                <ProductCard
                  product={item}
                  onPress={() => navigation.navigate('ProductDetail', { product: item })}
                />
              </View>
            )}
            keyExtractor={(item: any) => `flash-${item.id}`}
          />
        </View>
      )}

      {/* Products Grid */}
      <View className="mt-6 px-5">
        <SectionHeader title="Productos" action="" onAction={() => { }} />
      </View>
      <View style={{ paddingHorizontal: GRID_PADDING }}>
        {productRows.map((row) => (
          <View key={`row-${row[0]?.id}`} style={{ flexDirection: 'row', gap: GRID_GAP, marginBottom: GRID_GAP }}>
            {row.map((item: any) => (
              <View key={String(item.id)}>
                <ProductCard
                  product={item}
                  cardWidth={CARD_WIDTH}
                  onPress={() => navigation.navigate('ProductDetail', { product: item })}
                />
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Footer */}
      {loadingMore && (
        <View className="items-center py-6">
          <ActivityIndicator size="small" color="#1f2937" />
          <Text className="text-muted-foreground mt-2 text-xs">Cargando más productos...</Text>
        </View>
      )}
      <View className="h-8" />
    </ScrollView>
  );
}
