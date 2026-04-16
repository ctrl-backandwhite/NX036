import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockUser, mockLoyaltyTransactions, loyaltyTiers } from '../../data/mockData';
import FA5 from 'react-native-vector-icons/FontAwesome5';

const transactionTypeConfig: Record<string, { icon: string; color: string; sign: string }> = {
  earned: { icon: 'arrow-up', color: 'text-emerald-600', sign: '+' },
  redeemed: { icon: 'arrow-down', color: 'text-red-600', sign: '' },
  expired: { icon: 'clock', color: 'text-slate-400', sign: '' },
  bonus: { icon: 'star', color: 'text-amber-600', sign: '+' },
};

export function LoyaltyPointsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const currentTier = loyaltyTiers.find(t => t.name === mockUser.loyaltyTier)!;
  const nextTier = loyaltyTiers[loyaltyTiers.indexOf(currentTier) + 1];
  const progressToNext = nextTier
    ? ((mockUser.loyaltyPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  const tierColors: Record<string, string> = {
    bronze: 'bg-amber-700',
    silver: 'bg-slate-400',
    gold: 'bg-amber-500',
    platinum: 'bg-slate-700',
  };

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <FA5 name="arrow-left" size={18} color="#475569" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Puntos de Fidelidad</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Points Card */}
        <View className="mx-5 mt-4 bg-gray-800 rounded-3xl p-6 overflow-hidden">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white/70 text-sm">Puntos disponibles</Text>
              <Text className="text-white text-4xl font-bold mt-1">{mockUser.loyaltyPoints.toLocaleString()}</Text>
              <Text className="text-white/60 text-sm mt-1">
                = €{(mockUser.loyaltyPoints * 0.01).toFixed(2)} en descuentos
              </Text>
            </View>
            <View className="items-center">
              <View className={`w-16 h-16 rounded-full items-center justify-center ${tierColors[mockUser.loyaltyTier]}`}>
                <FA5 name="trophy" size={28} color="#d97706" solid />
              </View>
              <Text className="text-white font-bold text-sm mt-1 uppercase">{mockUser.loyaltyTier}</Text>
            </View>
          </View>

          {/* Progress to next tier */}
          {nextTier && (
            <View className="mt-6">
              <View className="flex-row justify-between mb-1">
                <Text className="text-white/70 text-xs uppercase">{currentTier.name}</Text>
                <Text className="text-white/70 text-xs uppercase">{nextTier.name}</Text>
              </View>
              <View className="h-2 bg-white/20 rounded-full overflow-hidden">
                <View className="h-full bg-white rounded-full" style={{ width: `${Math.min(progressToNext, 100)}%` }} />
              </View>
              <Text className="text-white/60 text-xs mt-1.5 text-center">
                {(nextTier.minPoints - mockUser.loyaltyPoints).toLocaleString()} puntos para {nextTier.name}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="flex-row px-5 mt-4 gap-3">
          <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 items-center border border-slate-100">
            <FA5 name="gift" size={20} color="#1f2937" solid style={{ marginBottom: 4 }} />
            <Text className="text-sm font-semibold text-slate-700">Canjear</Text>
            <Text className="text-xs text-slate-400">Por descuentos</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 items-center border border-slate-100">
            <FA5 name="mobile-alt" size={20} color="#1f2937" solid style={{ marginBottom: 4 }} />
            <Text className="text-sm font-semibold text-slate-700">Mi QR</Text>
            <Text className="text-xs text-slate-400">En tienda</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-white rounded-2xl p-4 items-center border border-slate-100">
            <FA5 name="bullseye" size={20} color="#1f2937" solid style={{ marginBottom: 4 }} />
            <Text className="text-sm font-semibold text-slate-700">Misiones</Text>
            <Text className="text-xs text-slate-400">Gana más</Text>
          </TouchableOpacity>
        </View>

        {/* Current Tier Benefits */}
        <View className="mx-5 mt-4 bg-white rounded-2xl p-4 border border-slate-100">
          <Text className="text-base font-semibold text-slate-800 mb-3">
            <FA5 name="gem" size={14} color="#1e293b" solid /> Beneficios nivel {currentTier.name.charAt(0).toUpperCase() + currentTier.name.slice(1)}
          </Text>
          {currentTier.benefits.map((benefit, index) => (
            <View key={index} className="flex-row items-center py-2">
              <Text className="text-emerald-500 mr-2">✓</Text>
              <Text className="text-sm text-slate-600">{benefit}</Text>
            </View>
          ))}
          <Text className="text-xs text-gray-800 mt-2">Multiplicador actual: x{currentTier.multiplier}</Text>
        </View>

        {/* All Tiers */}
        <View className="mx-5 mt-4">
          <Text className="text-base font-semibold text-slate-800 mb-3">Todos los niveles</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {loyaltyTiers.map(tier => (
              <View
                key={tier.name}
                className={`w-40 rounded-2xl p-4 mr-3 border ${tier.name === mockUser.loyaltyTier ? 'border-gray-800 bg-gray-50' : 'border-slate-200 bg-white'
                  }`}>
                <View className={`w-10 h-10 rounded-full items-center justify-center mb-2 ${tierColors[tier.name]}`}>
                  <FA5 name="trophy" size={16} color="#d97706" solid />
                </View>
                <Text className="text-sm font-bold text-slate-800 capitalize">{tier.name}</Text>
                <Text className="text-xs text-slate-500 mt-0.5">{tier.minPoints.toLocaleString()}+ pts</Text>
                <Text className="text-xs text-gray-800 mt-1">x{tier.multiplier} puntos</Text>
                {tier.name === mockUser.loyaltyTier && (
                  <View className="bg-gray-800 px-2 py-0.5 rounded-full mt-2 self-start">
                    <Text className="text-white text-[10px] font-bold">TU NIVEL</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Transaction History */}
        <View className="mx-5 mt-6 mb-8">
          <Text className="text-base font-semibold text-slate-800 mb-3">Historial de movimientos</Text>
          {mockLoyaltyTransactions.map(transaction => {
            const config = transactionTypeConfig[transaction.type];
            return (
              <View key={transaction.id} className="bg-white rounded-xl p-3 mb-2 flex-row items-center border border-slate-100">
                <View className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center mr-3">
                  <FA5 name={config.icon} size={14} color="#64748b" solid />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-slate-700">{transaction.description}</Text>
                  <Text className="text-xs text-slate-400">{new Date(transaction.date).toLocaleDateString('es-ES')}</Text>
                </View>
                <Text className={`text-sm font-bold ${config.color}`}>
                  {config.sign}{transaction.points}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
