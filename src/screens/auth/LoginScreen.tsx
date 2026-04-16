import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';

export function LoginScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [webviewVisible, setWebviewVisible] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  const { getAuthorizationUrl, handleAuthCallback } = useAuth();
  const pendingStateRef = useRef<string | null>(null);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { url, state } = await getAuthorizationUrl();
      pendingStateRef.current = state;
      setAuthUrl(url);
      setWebviewVisible(true);
    } catch (e: any) {
      setError(e?.message || 'No se pudo iniciar la autenticación');
      setLoading(false);
    }
  };

  const closeWebview = () => {
    setWebviewVisible(false);
    setAuthUrl('');
    setLoading(false);
    pendingStateRef.current = null;
  };

  const handleNavigationChange = useCallback(async (navState: WebViewNavigation) => {
    const { url } = navState;
    if (!url.startsWith('nx036://auth/callback')) return;

    setWebviewVisible(false);

    try {
      const params = new URL(url).searchParams;
      const code = params.get('code');
      const state = params.get('state');
      const errorParam = params.get('error');

      if (errorParam) {
        setError(`Error de autenticación: ${errorParam}`);
        setLoading(false);
        return;
      }

      if (!code || !state) {
        setError('Respuesta de autenticación incompleta');
        setLoading(false);
        return;
      }

      if (pendingStateRef.current && state !== pendingStateRef.current) {
        setError('Estado de autenticación inválido');
        setLoading(false);
        return;
      }

      await handleAuthCallback(code, state);
      navigation.replace('Main');
    } catch (e: any) {
      setError(e?.message || 'Error al completar el inicio de sesión');
    } finally {
      setLoading(false);
      pendingStateRef.current = null;
    }
  }, [handleAuthCallback, navigation]);

  return (
    <>
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-10"
        className="flex-1 bg-gray-50"
        keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-gray-800 rounded-3xl items-center justify-center mb-4">
            <FA5 name="store" size={36} color="#ffffff" solid />
          </View>
          <Text className="text-3xl font-bold text-slate-800">NX036</Text>
          <Text className="text-base text-slate-500 mt-1">Tu tienda favorita</Text>
        </View>

        {/* Error message */}
        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <Text className="text-red-700 text-sm text-center">{error}</Text>
          </View>
        ) : null}

        {/* Login button */}
        {loading && !webviewVisible ? (
          <View className="items-center py-4">
            <ActivityIndicator size="large" color="#1f2937" />
            <Text className="text-sm text-slate-500 mt-3">Completando inicio de sesión...</Text>
          </View>
        ) : (
          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            size="lg"
            fullWidth
          />
        )}

        {/* Info */}
        <View className="mt-6 items-center">
          <Text className="text-xs text-slate-400 text-center">
            Inicia sesión de forma segura con tu cuenta
          </Text>
        </View>

        {/* Register Link */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-slate-500">¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="font-semibold text-gray-800">Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* OAuth2 WebView Modal */}
      <Modal visible={webviewVisible} animationType="slide" onRequestClose={closeWebview}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }}>
            <TouchableOpacity onPress={closeWebview} style={{ padding: 8 }}>
              <FA5 name="times" size={18} color="#475569" />
            </TouchableOpacity>
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#1e293b' }}>Iniciar sesión</Text>
            <View style={{ width: 34 }} />
          </View>
          {authUrl ? (
            <WebView
              source={{ uri: authUrl }}
              onNavigationStateChange={handleNavigationChange}
              onShouldStartLoadWithRequest={(request) => {
                if (request.url.startsWith('nx036://auth/callback')) {
                  handleNavigationChange(request as any);
                  return false;
                }
                // Block external font requests that hang without internet
                if (request.url.includes('fonts.googleapis.com') || request.url.includes('fonts.gstatic.com')) {
                  return false;
                }
                return true;
              }}
              injectedJavaScript={`
                // Remove Google Fonts links that block rendering without internet
                document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]').forEach(el => el.remove());
                true;
              `}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              mixedContentMode="always"
              allowsInlineMediaPlayback
              setSupportMultipleWindows={false}
              renderLoading={() => (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#1f2937" />
                </View>
              )}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error:', nativeEvent.description);
              }}
            />
          ) : null}
        </SafeAreaView>
      </Modal>
    </>
  );
}
