import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { Alert, ToastAndroid, Platform } from 'react-native';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

export interface CartItemDto {
    id: string;
    productId: string;
    productName: string;
    productImage: string | null;
    unitPrice: number;
    quantity: number;
    variantId: string | null;
    selectedAttrs: Record<string, string> | null;
}

interface CartContextType {
    items: CartItemDto[];
    isLoading: boolean;
    addToCart: (product: { id: string; name: string; price: number; image?: string }, quantity?: number) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
    items: [],
    isLoading: false,
    addToCart: () => { },
    removeFromCart: () => { },
    updateQuantity: () => { },
    clearCart: () => { },
    getTotalItems: () => 0,
    getTotalPrice: () => 0,
    refreshCart: async () => { },
});

function showToast(message: string) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const { isLoggedIn } = useAuth();
    const [items, setItems] = useState<CartItemDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshCart = useCallback(async () => {
        if (!isLoggedIn) { setItems([]); return; }
        setIsLoading(true);
        try {
            const cart = await api.getCart();
            setItems(cart.items ?? []);
        } catch {
            // silently fail — cart might not exist yet
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = useCallback((product: { id: string; name: string; price: number; image?: string }, quantity = 1) => {
        // Optimistic: check if product already in cart
        const existing = items.find(i => i.productId === product.id);
        if (existing) {
            // Optimistic update quantity
            setItems(prev => prev.map(i =>
                i.productId === product.id
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
            ));
            // Backend sync
            api.updateCartItem(existing.id, existing.quantity + quantity)
                .then(() => refreshCart())
                .catch(() => {
                    // Rollback
                    setItems(prev => prev.map(i =>
                        i.productId === product.id
                            ? { ...i, quantity: i.quantity - quantity }
                            : i
                    ));
                });
        } else {
            // Optimistic add
            const tempItem: CartItemDto = {
                id: `temp_${Date.now()}`,
                productId: product.id,
                productName: product.name,
                productImage: product.image ?? null,
                unitPrice: product.price,
                quantity,
                variantId: null,
                selectedAttrs: null,
            };
            setItems(prev => [...prev, tempItem]);

            // Backend sync
            api.addToCart({
                productId: product.id,
                quantity,
                unitPrice: product.price,
                productName: product.name,
                productImage: product.image,
            })
                .then(() => refreshCart())
                .catch(() => {
                    // Rollback
                    setItems(prev => prev.filter(i => i.id !== tempItem.id));
                });
        }
        showToast('Producto agregado al carrito');
    }, [items, refreshCart]);

    const removeFromCart = useCallback((itemId: string) => {
        const removed = items.find(i => i.id === itemId);
        // Optimistic remove
        setItems(prev => prev.filter(i => i.id !== itemId));

        api.removeCartItem(itemId)
            .then(() => refreshCart())
            .catch(() => {
                // Rollback
                if (removed) setItems(prev => [...prev, removed]);
            });
        showToast('Producto eliminado del carrito');
    }, [items, refreshCart]);

    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }
        const prev = items.find(i => i.id === itemId);
        const oldQty = prev?.quantity ?? 1;

        // Optimistic update
        setItems(prevItems => prevItems.map(i =>
            i.id === itemId ? { ...i, quantity } : i
        ));

        api.updateCartItem(itemId, quantity)
            .then(() => refreshCart())
            .catch(() => {
                // Rollback
                setItems(prevItems => prevItems.map(i =>
                    i.id === itemId ? { ...i, quantity: oldQty } : i
                ));
            });
    }, [items, removeFromCart, refreshCart]);

    const clearCart = useCallback(() => {
        const backup = [...items];
        setItems([]);
        api.clearCart().catch(() => setItems(backup));
    }, [items]);

    const getTotalItems = useCallback(() =>
        items.reduce((sum, i) => sum + i.quantity, 0)
        , [items]);

    const getTotalPrice = useCallback(() =>
        items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
        , [items]);

    return (
        <CartContext.Provider value={{
            items, isLoading, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice, refreshCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
