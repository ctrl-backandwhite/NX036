import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'El correo es obligatorio';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white">
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-indigo-600 rounded-3xl items-center justify-center mb-4">
            <Text className="text-4xl">🛍️</Text>
          </View>
          <Text className="text-3xl font-bold text-slate-800">ShopNX</Text>
          <Text className="text-base text-slate-500 mt-1">Tu tienda favorita</Text>
        </View>

        {/* Form */}
        <Input
          label="Correo electrónico"
          placeholder="tu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="✉️"
          error={errors.email}
        />
        <Input
          label="Contraseña"
          placeholder="Tu contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon="🔒"
          error={errors.password}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          className="self-end mb-6">
          <Text className="text-sm font-semibold text-indigo-600">¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <Button title="Iniciar Sesión" onPress={handleLogin} size="lg" fullWidth />

        {/* Social Login */}
        <View className="mt-8">
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-slate-200" />
            <Text className="mx-4 text-sm text-slate-400">o continúa con</Text>
            <View className="flex-1 h-px bg-slate-200" />
          </View>

          <View className="flex-row justify-center gap-4">
            <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-slate-50 border border-slate-200 rounded-xl py-3">
              <Text className="text-xl mr-2">🔵</Text>
              <Text className="font-semibold text-slate-700">Google</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-slate-50 border border-slate-200 rounded-xl py-3">
              <Text className="text-xl mr-2">🍎</Text>
              <Text className="font-semibold text-slate-700">Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Register Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-slate-500">¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="font-semibold text-indigo-600">Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
