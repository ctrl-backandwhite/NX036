import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockNotifications } from '../../data/mockData';

const typeConfig: Record<string, { icon: string; color: string }> = {
  order: { icon: '📦', color: 'bg-blue-100' },
  promotion: { icon: '🏷️', color: 'bg-red-100' },
  loyalty: { icon: '🏆', color: 'bg-amber-100' },
  system: { icon: '⚙️', color: 'bg-slate-100' },
};

export function NotificationsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Text className="text-2xl text-slate-600">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Notificaciones</Text>
      </View>

      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        {mockNotifications.map(notification => {
          const config = typeConfig[notification.type];
          return (
            <TouchableOpacity
              key={notification.id}
              className={`bg-white rounded-2xl p-4 mb-3 border ${notification.isRead ? 'border-slate-100' : 'border-indigo-200 bg-indigo-50/30'}`}>
              <View className="flex-row">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${config.color}`}>
                  <Text className="text-lg">{config.icon}</Text>
                </View>
                <View className="flex-1 ml-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-slate-800">{notification.title}</Text>
                    {!notification.isRead && <View className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
                  </View>
                  <Text className="text-sm text-slate-600 mt-1">{notification.message}</Text>
                  <Text className="text-xs text-slate-400 mt-2">
                    {new Date(notification.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
