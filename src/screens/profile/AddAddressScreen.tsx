import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import type { Address } from '../../types';
import FA5 from 'react-native-vector-icons/FontAwesome5';

export function AddAddressScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const existingAddress: Address | undefined = route.params?.address;
  const isEditing = !!existingAddress;

  const [form, setForm] = useState({
    label: existingAddress?.label || '',
    fullName: existingAddress?.fullName || '',
    street: existingAddress?.street || '',
    city: existingAddress?.city || '',
    state: existingAddress?.state || '',
    zipCode: existingAddress?.zipCode || '',
    country: existingAddress?.country || 'España',
    phone: existingAddress?.phone || '',
    isDefault: existingAddress?.isDefault || false,
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const labels = ['Casa', 'Oficina', 'Otro'];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
      style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <FA5 name="arrow-left" size={18} color="#475569" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">
          {isEditing ? 'Editar dirección' : 'Nueva dirección'}
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" keyboardShouldPersistTaps="handled">
        {/* Label selection */}
        <Text className="text-sm font-medium text-slate-700 mb-2">Etiqueta</Text>
        <View className="flex-row gap-2 mb-4">
          {labels.map(label => (
            <TouchableOpacity
              key={label}
              onPress={() => updateField('label', label)}
              className={`px-4 py-2 rounded-full border ${form.label === label ? 'border-gray-800 bg-gray-50' : 'border-slate-200 bg-white'
                }`}>
              <Text className={`text-sm ${form.label === label ? 'text-gray-800 font-semibold' : 'text-slate-600'}`}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input label="Nombre completo" placeholder="María García" value={form.fullName} onChangeText={v => updateField('fullName', v)} leftIcon={<FA5 name="user" size={14} color="#64748b" solid />} />
        <Input label="Dirección" placeholder="Calle, número, piso..." value={form.street} onChangeText={v => updateField('street', v)} leftIcon={<FA5 name="map-marker-alt" size={14} color="#64748b" solid />} />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input label="Ciudad" placeholder="Madrid" value={form.city} onChangeText={v => updateField('city', v)} />
          </View>
          <View className="flex-1">
            <Input label="Provincia" placeholder="Madrid" value={form.state} onChangeText={v => updateField('state', v)} />
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input label="Código postal" placeholder="28001" value={form.zipCode} onChangeText={v => updateField('zipCode', v)} keyboardType="numeric" />
          </View>
          <View className="flex-1">
            <Input label="País" placeholder="España" value={form.country} onChangeText={v => updateField('country', v)} />
          </View>
        </View>

        <Input label="Teléfono" placeholder="+34 612 345 678" value={form.phone} onChangeText={v => updateField('phone', v)} keyboardType="phone-pad" leftIcon={<FA5 name="phone-alt" size={14} color="#64748b" solid />} />

        {/* Default toggle */}
        <TouchableOpacity
          onPress={() => setForm(prev => ({ ...prev, isDefault: !prev.isDefault }))}
          className="flex-row items-center justify-between bg-white rounded-xl p-4 border border-slate-200 mb-8">
          <Text className="text-base text-slate-700">Usar como dirección predeterminada</Text>
          <View className={`w-12 h-7 rounded-full justify-center px-0.5 ${form.isDefault ? 'bg-gray-800' : 'bg-slate-300'}`}>
            <View className={`w-6 h-6 bg-white rounded-full shadow-sm ${form.isDefault ? 'self-end' : 'self-start'}`} />
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View className="px-5 py-4 bg-white border-t border-slate-100" style={{ paddingBottom: insets.bottom + 16 }}>
        <Button title={isEditing ? 'Guardar cambios' : 'Añadir dirección'} onPress={() => navigation.goBack()} size="lg" fullWidth />
      </View>
    </KeyboardAvoidingView>
  );
}
