import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockGiftCards } from '../../data/mockData';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import FA5 from 'react-native-vector-icons/FontAwesome5';

const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Activa', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  used: { label: 'Usada', color: 'text-slate-600', bg: 'bg-slate-100' },
  expired: { label: 'Expirada', color: 'text-red-700', bg: 'bg-red-100' },
};

export function GiftCardsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [newCode, setNewCode] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);

  const activeCards = mockGiftCards.filter(gc => gc.status === 'active');
  const otherCards = mockGiftCards.filter(gc => gc.status !== 'active');
  const totalBalance = activeCards.reduce((sum, gc) => sum + gc.balance, 0);

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <FA5 name="arrow-left" size={18} color="#475569" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Tarjetas de Regalo</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Total Balance */}
        <View className="mx-5 mt-4 bg-gradient-to-br rounded-3xl p-6 items-center" style={{ backgroundColor: '#1f2937' }}>
          <FA5 name="gift" size={40} color="#ffffff" solid style={{ marginBottom: 12 }} />
          <Text className="text-white/70 text-sm">Balance total disponible</Text>
          <Text className="text-white text-4xl font-bold mt-1">€{totalBalance.toFixed(2)}</Text>
          <Text className="text-white/50 text-xs mt-2">{activeCards.length} tarjeta{activeCards.length !== 1 ? 's' : ''} activa{activeCards.length !== 1 ? 's' : ''}</Text>
        </View>

        {/* Add Gift Card */}
        <View className="mx-5 mt-4">
          <TouchableOpacity
            onPress={() => setShowAddCard(!showAddCard)}
            className="bg-white rounded-2xl p-4 border border-slate-100 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <FA5 name="plus" size={14} color="#1f2937" style={{ marginRight: 8 }} />
              <Text className="text-base font-semibold text-gray-800">Añadir tarjeta de regalo</Text>
            </View>
            <Text className="text-slate-400">{showAddCard ? '⌄' : '›'}</Text>
          </TouchableOpacity>

          {showAddCard && (
            <View className="bg-white rounded-2xl p-4 mt-2 border border-slate-100">
              <Input
                label="Código de la tarjeta"
                placeholder="GIFT-XXXX-XXXX"
                value={newCode}
                onChangeText={setNewCode}
                autoCapitalize="characters"
                leftIcon={<FA5 name="gift" size={14} color="#64748b" solid />}
              />
              <Button title="Canjear tarjeta" onPress={() => setShowAddCard(false)} fullWidth />
            </View>
          )}
        </View>

        {/* Active Gift Cards */}
        {activeCards.length > 0 && (
          <View className="mx-5 mt-6">
            <Text className="text-base font-semibold text-slate-800 mb-3">Tarjetas activas</Text>
            {activeCards.map(card => {
              const usedPercentage = ((card.originalAmount - card.balance) / card.originalAmount) * 100;
              return (
                <View key={card.id} className="bg-white rounded-2xl p-4 mb-3 border border-slate-100">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <FA5 name="gift" size={18} color="#d97706" solid style={{ marginRight: 8 }} />
                      <Text className="text-sm font-semibold text-slate-800">{card.code}</Text>
                    </View>
                    <View className={`px-2.5 py-1 rounded-full ${statusStyle[card.status].bg}`}>
                      <Text className={`text-xs font-semibold ${statusStyle[card.status].color}`}>
                        {statusStyle[card.status].label}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-baseline justify-between mb-2">
                    <View>
                      <Text className="text-2xl font-bold text-slate-800">€{card.balance.toFixed(2)}</Text>
                      <Text className="text-xs text-slate-400">de €{card.originalAmount.toFixed(2)}</Text>
                    </View>
                  </View>

                  {/* Usage bar */}
                  <View className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <View
                      className="h-full bg-gray-800 rounded-full"
                      style={{ width: `${100 - usedPercentage}%` }}
                    />
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-400">
                      Válida hasta: {new Date(card.expiryDate).toLocaleDateString('es-ES')}
                    </Text>
                    {card.lastUsed && (
                      <Text className="text-xs text-slate-400">
                        Último uso: {new Date(card.lastUsed).toLocaleDateString('es-ES')}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Other Cards */}
        {otherCards.length > 0 && (
          <View className="mx-5 mt-4 mb-8">
            <Text className="text-base font-semibold text-slate-800 mb-3">Historial</Text>
            {otherCards.map(card => (
              <View key={card.id} className="bg-white rounded-xl p-3 mb-2 flex-row items-center justify-between border border-slate-100 opacity-60">
                <View className="flex-row items-center">
                  <FA5 name="gift" size={14} color="#64748b" solid style={{ marginRight: 8 }} />
                  <View>
                    <Text className="text-sm text-slate-700">{card.code}</Text>
                    <Text className="text-xs text-slate-400">€{card.originalAmount.toFixed(2)}</Text>
                  </View>
                </View>
                <View className={`px-2 py-0.5 rounded-full ${statusStyle[card.status].bg}`}>
                  <Text className={`text-xs ${statusStyle[card.status].color}`}>{statusStyle[card.status].label}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
