import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import { mockUser } from '../../data/mockData';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';


export function SecurityScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(mockUser.twoFactorEnabled);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const securityScore = (mockUser.isVerified ? 25 : 0) + (twoFactorEnabled ? 35 : 0) + (biometricEnabled ? 20 : 0) + 20; // 20 base for password

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="px-5 pt-4 pb-3 bg-white border-b border-slate-100 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <FA5 name="arrow-left" size={18} color="#475569" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-800">Seguridad</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Security Score */}
        <View className="mx-5 mt-4 bg-white rounded-2xl p-5 border border-slate-100">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <FA5 name="shield-alt" size={16} color="#1f2937" solid />
              <Text className="text-base font-semibold text-slate-800 ml-2">Nivel de seguridad</Text>
            </View>
            <Text className={`text-lg font-bold ${securityScore >= 80 ? 'text-emerald-600' : securityScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
              {securityScore}%
            </Text>
          </View>
          <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <View
              className={`h-full rounded-full ${securityScore >= 80 ? 'bg-emerald-500' : securityScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${securityScore}%` }}
            />
          </View>
          <Text className="text-xs text-slate-500 mt-2">
            {securityScore >= 80 ? '¡Excelente! Tu cuenta está muy protegida.' :
              securityScore >= 50 ? 'Bueno, pero puedes mejorar la seguridad.' :
                'Recomendamos activar más opciones de seguridad.'}
          </Text>
        </View>

        {/* Account Verification */}
        <View className="mx-5 mt-4 bg-white rounded-2xl overflow-hidden border border-slate-100">
          <View className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3">
                <FA5 name="check-circle" size={18} color="#047857" solid />
              </View>
              <View className="flex-1">
                <Text className="text-base text-slate-800">Cuenta verificada</Text>
                <Text className="text-xs text-slate-500">Email y teléfono verificados</Text>
              </View>
            </View>
            <View className="bg-emerald-100 px-2 py-0.5 rounded-full">
              <Text className="text-xs text-emerald-700 font-semibold">Verificada</Text>
            </View>
          </View>
        </View>

        {/* Change Password */}
        <View className="mx-5 mt-4 bg-white rounded-2xl overflow-hidden border border-slate-100">
          <TouchableOpacity
            onPress={() => setShowChangePassword(!showChangePassword)}
            className="p-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
                <FA5 name="key" size={16} color="#374151" solid />
              </View>
              <View>
                <Text className="text-base text-slate-800">Cambiar contraseña</Text>
                <Text className="text-xs text-slate-500">Última actualización hace 3 meses</Text>
              </View>
            </View>
            <Text className="text-slate-400">{showChangePassword ? '⌄' : '›'}</Text>
          </TouchableOpacity>

          {showChangePassword && (
            <View className="px-4 pb-4 border-t border-slate-100 pt-3">
              <Input
                label="Contraseña actual"
                placeholder=""
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                leftIcon={<FA5 name="lock" size={14} color="#64748b" solid />}
              />
              <Input
                label="Nueva contraseña"
                placeholder="Mínimo 8 caracteres"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                leftIcon={<FA5 name="key" size={14} color="#64748b" solid />}
              />
              <Input
                label="Confirmar nueva contraseña"
                placeholder=""
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                leftIcon={<FA5 name="key" size={14} color="#64748b" solid />}
              />
              <Button title="Actualizar contraseña" onPress={() => setShowChangePassword(false)} fullWidth className="mt-2" />
            </View>
          )}
        </View>

        {/* Two Factor Auth */}
        <View className="mx-5 mt-4 bg-white rounded-2xl p-4 border border-slate-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <FA5 name="mobile-alt" size={18} color="#7e22ce" solid />
              </View>
              <View className="flex-1">
                <Text className="text-base text-slate-800">Verificación en 2 pasos</Text>
                <Text className="text-xs text-slate-500">
                  {twoFactorEnabled ? 'Activada via SMS' : 'Añade una capa extra de seguridad'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`w-12 h-7 rounded-full justify-center px-0.5 ${twoFactorEnabled ? 'bg-gray-800' : 'bg-slate-300'}`}>
              <View className={`w-6 h-6 bg-white rounded-full shadow-sm ${twoFactorEnabled ? 'self-end' : 'self-start'}`} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Biometric */}
        <View className="mx-5 mt-3 bg-white rounded-2xl p-4 border border-slate-100">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <FA5 name="fingerprint" size={18} color="#2563eb" solid />
              </View>
              <View className="flex-1">
                <Text className="text-base text-slate-800">Acceso biométrico</Text>
                <Text className="text-xs text-slate-500">Huella digital / Face ID</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setBiometricEnabled(!biometricEnabled)}
              className={`w-12 h-7 rounded-full justify-center px-0.5 ${biometricEnabled ? 'bg-gray-800' : 'bg-slate-300'}`}>
              <View className={`w-6 h-6 bg-white rounded-full shadow-sm ${biometricEnabled ? 'self-end' : 'self-start'}`} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Sessions */}
        <View className="mx-5 mt-4 bg-white rounded-2xl p-4 border border-slate-100">
          <View className="flex-row items-center mb-3">
            <FA5 name="mobile-alt" size={14} color="#1f2937" solid />
            <Text className="text-base font-semibold text-slate-800 ml-2">Sesiones activas</Text>
          </View>
          <View className="bg-emerald-50 rounded-xl p-3 mb-2 flex-row items-center border border-emerald-200">
            <FA5 name="mobile-alt" size={18} color="#047857" solid />
            <View className="flex-1 ml-3">
              <Text className="text-sm font-medium text-slate-800">Este dispositivo</Text>
              <Text className="text-xs text-slate-500">iPhone 16 Pro · Madrid, España</Text>
              <Text className="text-xs text-emerald-600">Sesión actual</Text>
            </View>
          </View>
          <View className="bg-slate-50 rounded-xl p-3 flex-row items-center">
            <FA5 name="laptop" size={18} color="#475569" solid />
            <View className="flex-1 ml-3">
              <Text className="text-sm font-medium text-slate-800">Chrome · macOS</Text>
              <Text className="text-xs text-slate-500">Último acceso: hace 2 horas</Text>
            </View>
            <TouchableOpacity className="bg-red-100 px-2 py-1 rounded-lg">
              <Text className="text-xs text-red-600 font-semibold">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login History */}
        <View className="mx-5 mt-4 bg-white rounded-2xl p-4 border border-slate-100 mb-6">
          <View className="flex-row items-center mb-3">
            <FA5 name="history" size={14} color="#1f2937" solid />
            <Text className="text-base font-semibold text-slate-800 ml-2">Últimos accesos</Text>
          </View>
          {[
            { date: 'Hoy 14:30', device: 'iPhone 16 Pro', location: 'Madrid', success: true },
            { date: 'Hoy 09:15', device: 'Chrome · macOS', location: 'Madrid', success: true },
            { date: 'Ayer 22:00', device: 'Desconocido', location: 'Barcelona', success: false },
          ].map((entry, index) => (
            <View key={index} className={`flex-row items-center py-2.5 ${index > 0 ? 'border-t border-slate-100' : ''}`}>
              <FA5 name={entry.success ? 'check-circle' : 'times-circle'} size={12} color={entry.success ? '#10b981' : '#ef4444'} solid />
              <View className="flex-1 ml-3">
                <Text className="text-sm text-slate-700">{entry.device}</Text>
                <Text className="text-xs text-slate-400">{entry.date} · {entry.location}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Danger Zone */}
        <View className="mx-5 mb-8">
          <Text className="text-xs font-semibold text-red-400 uppercase mb-2 ml-1">Zona de peligro</Text>
          <TouchableOpacity className="bg-white rounded-2xl p-4 border border-red-200 flex-row items-center">
            <FA5 name="exclamation-triangle" size={18} color="#dc2626" solid />
            <View className="flex-1 ml-3">
              <Text className="text-base text-red-600 font-medium">Eliminar cuenta</Text>
              <Text className="text-xs text-slate-500">Esta acción es irreversible</Text>
            </View>
            <Text className="text-red-400">›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
