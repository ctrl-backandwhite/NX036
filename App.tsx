import './global.css';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <AppNavigator />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
