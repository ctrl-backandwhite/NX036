import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import FA5 from 'react-native-vector-icons/FontAwesome5';

export function EditProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: '',
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const initials = `${form.firstName[0] ?? ''}${form.lastName[0] ?? ''}`;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
      style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <FA5 name="arrow-left" size={18} color="#475569" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Editar perfil</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" keyboardShouldPersistTaps="handled">
        {/* Avatar */}
        <View className="items-center mb-8">
          <View className="relative">
            <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center">
              <Text className="text-3xl font-bold text-gray-800">
                {initials}
              </Text>
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-gray-800 rounded-full items-center justify-center border-2 border-white">
              <FA5 name="camera" size={12} color="#ffffff" solid />
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-800 font-semibold mt-2">Cambiar foto</Text>
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
          leftIcon={<FA5 name="envelope" size={14} color="#64748b" solid />}
        />
        <Input
          label="Teléfono"
          value={form.phone}
          onChangeText={v => updateField('phone', v)}
          keyboardType="phone-pad"
          leftIcon={<FA5 name="phone-alt" size={14} color="#64748b" solid />}
        />

        {/* Account info */}
        <View className="bg-slate-100 rounded-2xl p-4 mt-4 mb-6">
          <Text className="text-sm font-semibold text-slate-600 mb-2">Información de la cuenta</Text>
          <View className="flex-row justify-between py-1">
            <Text className="text-sm text-slate-500">Email</Text>
            <Text className="text-sm text-slate-700">{user?.email ?? '-'}</Text>
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
