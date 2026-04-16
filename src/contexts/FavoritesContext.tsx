import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { ToastAndroid, Platform } from 'react-native';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
    favoriteIds: string[];
    isLoading: boolean;
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (productId: string) => void;
    refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType>({
    favoriteIds: [],
    isLoading: false,
    isFavorite: () => false,
    toggleFavorite: () => { },
    refreshFavorites: async () => { },
});

function showToast(message: string) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const { isLoggedIn } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshFavorites = useCallback(async () => {
        if (!isLoggedIn) { setFavoriteIds([]); return; }
        setIsLoading(true);
        try {
            const ids = await api.getFavorites();
            setFavoriteIds(ids);
        } catch {
            // silently fail
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        refreshFavorites();
    }, [refreshFavorites]);

    const isFavorite = useCallback((productId: string) => {
        return favoriteIds.includes(productId);
    }, [favoriteIds]);

    const toggleFavorite = useCallback((productId: string) => {
        if (!isLoggedIn) {
            showToast('Inicia sesión para agregar favoritos');
            return;
        }

        const removing = favoriteIds.includes(productId);

        // Optimistic update
        setFavoriteIds(prev =>
            removing
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );

        const action = removing
            ? api.removeFavorite(productId)
            : api.addFavorite(productId);

        action
            .then(() => refreshFavorites())
            .catch(() => {
                // Rollback
                setFavoriteIds(prev =>
                    removing
                        ? [...prev, productId]
                        : prev.filter(id => id !== productId)
                );
            });

        showToast(removing ? 'Eliminado de favoritos' : 'Agregado a favoritos');
    }, [favoriteIds, isLoggedIn, refreshFavorites]);

    return (
        <FavoritesContext.Provider value={{ favoriteIds, isLoading, isFavorite, toggleFavorite, refreshFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}
