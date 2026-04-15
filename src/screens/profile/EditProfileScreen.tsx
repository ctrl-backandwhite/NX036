import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockUser } from '../../data/mockData';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export function EditProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
    phone: mockUser.phone,
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
      style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Text className="text-2xl text-slate-600">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Editar perfil</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <View className="items-center mb-8">
          <View className="relative">
            <View className="w-24 h-24 bg-indigo-100 rounded-full items-center justify-center">
              <Text className="text-3xl font-bold text-indigo-600">
                {form.firstName[0]}{form.lastName[0]}
              </Text>
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full items-center justify-center border-2 border-white">
              <Text className="text-sm">📷</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-indigo-600 font-semibold mt-2">Cambiar foto</Text>
        </View>

        {/* Form */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input label="Nombre" value={form.firstName} onChangeText={v => updateField('firstName', v)} />
          </View>
          <View className="flex-1">
            <Input label="Apellido" value={form.lastName} onChangeText={v => updateField('lastName', v)} />
          </View>
        </View>
        <Input
          label="Correo electrónico"
          value={form.email}
          onChangeText={v => updateField('email', v)}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="✉️"
        />
        <Input
          label="Teléfono"
          value={form.phone}
          onChangeText={v => updateField('phone', v)}
          keyboardType="phone-pad"
          leftIcon="📞"
        />

        {/* Account info */}
        <View className="bg-slate-100 rounded-2xl p-4 mt-4 mb-6">
          <Text className="text-sm font-semibold text-slate-600 mb-2">Información de la cuenta</Text>
          <View className="flex-row justify-between py-1">
            <Text className="text-sm text-slate-500">Miembro desde</Text>
            <Text className="text-sm text-slate-700">{new Date(mockUser.memberSince).toLocaleDateString('es-ES')}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text className="text-sm text-slate-500">Verificado</Text>
            <Text className="text-sm text-emerald-600">{mockUser.isVerified ? '✅ Sí' : '❌ No'}</Text>
          </View>
          <View className="flex-row justify-between py-1">
            <Text className="text-sm text-slate-500">Nivel de fidelidad</Text>
            <Text className="text-sm text-amber-600 font-semibold">🏆 {mockUser.loyaltyTier.toUpperCase()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Save */}
      <View className="px-5 py-4 bg-white border-t border-slate-100" style={{ paddingBottom: insets.bottom + 16 }}>
        <Button title="Guardar cambios" onPress={() => navigation.goBack()} size="lg" fullWidth />
      </View>
    </KeyboardAvoidingView>
  );
}
