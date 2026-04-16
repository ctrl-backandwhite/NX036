import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import FA5 from 'react-native-vector-icons/FontAwesome5';

export function ForgotPasswordScreen({ navigation }: any) {
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSendCode = () => {
    if (!email) { setError('Ingresa tu correo electrónico'); return; }
    setError('');
    setStep('code');
  };

  const handleVerifyCode = () => {
    if (code.length < 6) { setError('Ingresa el código de 6 dígitos'); return; }
    setError('');
    setStep('reset');
  };

  const handleResetPassword = () => {
    if (!newPassword || newPassword.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
    if (newPassword !== confirmPassword) { setError('Las contraseñas no coinciden'); return; }
    setError('');
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white">
      <ScrollView
        contentContainerClassName="flex-grow px-6 py-8"
        keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <FA5 name="arrow-left" size={18} color="#475569" />
        </TouchableOpacity>

        {step === 'email' && (
          <>
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                <FA5 name="lock" size={32} color="#1f2937" solid />
              </View>
              <Text className="text-2xl font-bold text-slate-800">¿Olvidaste tu contraseña?</Text>
              <Text className="text-sm text-slate-500 text-center mt-2">
                Ingresa tu correo electrónico y te enviaremos un código de verificación.
              </Text>
            </View>

            <Input
              label="Correo electrónico"
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<FA5 name="envelope" size={14} color="#64748b" solid />}
              error={error}
            />

            <Button title="Enviar Código" onPress={handleSendCode} size="lg" fullWidth className="mt-4" />
          </>
        )}

        {step === 'code' && (
          <>
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                <FA5 name="envelope-open-text" size={32} color="#1f2937" solid />
              </View>
              <Text className="text-2xl font-bold text-slate-800">Verificar código</Text>
              <Text className="text-sm text-slate-500 text-center mt-2">
                Hemos enviado un código de 6 dígitos a{'\n'}
                <Text className="font-semibold text-slate-700">{email}</Text>
              </Text>
            </View>

            <Input
              label="Código de verificación"
              placeholder="000000"
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
              maxLength={6}
              error={error}
            />

            <Button title="Verificar" onPress={handleVerifyCode} size="lg" fullWidth className="mt-4" />

            <TouchableOpacity className="items-center mt-6">
              <Text className="text-sm text-slate-500">
                ¿No recibiste el código?{' '}
                <Text className="font-semibold text-gray-800">Reenviar</Text>
              </Text>
            </TouchableOpacity>
          </>
        )}

        {step === 'reset' && (
          <>
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-4">
                <FA5 name="key" size={32} color="#1f2937" solid />
              </View>
              <Text className="text-2xl font-bold text-slate-800">Nueva contraseña</Text>
              <Text className="text-sm text-slate-500 text-center mt-2">
                Crea una nueva contraseña segura para tu cuenta.
              </Text>
            </View>

            <Input
              label="Nueva contraseña"
              placeholder="Mínimo 8 caracteres"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              leftIcon={<FA5 name="lock" size={14} color="#64748b" solid />}
            />
            <Input
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              leftIcon={<FA5 name="lock" size={14} color="#64748b" solid />}
              error={error}
            />

            <Button title="Cambiar Contraseña" onPress={handleResetPassword} size="lg" fullWidth className="mt-4" />
          </>
        )}

        {/* Progress indicator */}
        <View className="flex-row justify-center mt-8 gap-2">
          {['email', 'code', 'reset'].map((s, i) => (
            <View key={s} className={`h-1.5 rounded-full ${s === step ? 'w-8 bg-gray-800' : i < ['email', 'code', 'reset'].indexOf(step) ? 'w-4 bg-gray-300' : 'w-4 bg-slate-200'
              }`} />
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
