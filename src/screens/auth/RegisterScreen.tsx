import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleRegister = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName) newErrors.firstName = 'El nombre es obligatorio';
    if (!form.lastName) newErrors.lastName = 'El apellido es obligatorio';
    if (!form.email) newErrors.email = 'El correo es obligatorio';
    if (!form.phone) newErrors.phone = 'El teléfono es obligatorio';
    if (!form.password) newErrors.password = 'La contraseña es obligatoria';
    if (form.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (!acceptTerms) newErrors.terms = 'Debes aceptar los términos';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white">
      <ScrollView
        contentContainerClassName="px-6 py-8"
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
          <Text className="text-2xl text-slate-600">←</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-slate-800 mb-1">Crear cuenta</Text>
        <Text className="text-base text-slate-500 mb-8">
          Completa tus datos para empezar a comprar
        </Text>

        {/* Form */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Input
              label="Nombre"
              placeholder="María"
              value={form.firstName}
              onChangeText={v => updateField('firstName', v)}
              error={errors.firstName}
            />
          </View>
          <View className="flex-1">
            <Input
              label="Apellido"
              placeholder="García"
              value={form.lastName}
              onChangeText={v => updateField('lastName', v)}
              error={errors.lastName}
            />
          </View>
        </View>

        <Input
          label="Correo electrónico"
          placeholder="tu@email.com"
          value={form.email}
          onChangeText={v => updateField('email', v)}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="✉️"
          error={errors.email}
        />

        <Input
          label="Teléfono"
          placeholder="+34 612 345 678"
          value={form.phone}
          onChangeText={v => updateField('phone', v)}
          keyboardType="phone-pad"
          leftIcon="📞"
          error={errors.phone}
        />

        <Input
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          value={form.password}
          onChangeText={v => updateField('password', v)}
          secureTextEntry
          leftIcon="🔒"
          error={errors.password}
        />

        <Input
          label="Confirmar contraseña"
          placeholder="Repite tu contraseña"
          value={form.confirmPassword}
          onChangeText={v => updateField('confirmPassword', v)}
          secureTextEntry
          leftIcon="🔒"
          error={errors.confirmPassword}
        />

        {/* Password strength */}
        {form.password.length > 0 && (
          <View className="mb-4 -mt-2">
            <View className="flex-row gap-1 mb-1">
              <View className={`flex-1 h-1 rounded-full ${form.password.length >= 2 ? 'bg-red-400' : 'bg-slate-200'}`} />
              <View className={`flex-1 h-1 rounded-full ${form.password.length >= 5 ? 'bg-amber-400' : 'bg-slate-200'}`} />
              <View className={`flex-1 h-1 rounded-full ${form.password.length >= 8 ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              <View className={`flex-1 h-1 rounded-full ${form.password.length >= 12 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
            </View>
            <Text className="text-xs text-slate-400">
              {form.password.length < 5 ? 'Débil' : form.password.length < 8 ? 'Media' : form.password.length < 12 ? 'Fuerte' : 'Muy fuerte'}
            </Text>
          </View>
        )}

        {/* Terms */}
        <TouchableOpacity
          onPress={() => setAcceptTerms(!acceptTerms)}
          className="flex-row items-start mb-6">
          <View className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 items-center justify-center ${
            acceptTerms ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
          }`}>
            {acceptTerms && <Text className="text-white text-xs">✓</Text>}
          </View>
          <Text className="flex-1 text-sm text-slate-600">
            Acepto los{' '}
            <Text className="text-indigo-600 font-semibold">Términos y Condiciones</Text>
            {' '}y la{' '}
            <Text className="text-indigo-600 font-semibold">Política de Privacidad</Text>
          </Text>
        </TouchableOpacity>
        {errors.terms && <Text className="text-red-500 text-xs -mt-4 mb-4">{errors.terms}</Text>}

        <Button title="Crear Cuenta" onPress={handleRegister} size="lg" fullWidth />

        {/* Login Link */}
        <View className="flex-row justify-center mt-6 mb-8">
          <Text className="text-slate-500">¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="font-semibold text-indigo-600">Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
