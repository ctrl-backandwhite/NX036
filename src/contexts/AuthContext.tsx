import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { auth, type AuthData } from '../services/auth';

interface AuthContextType {
    user: AuthData | null;
    isLoggedIn: boolean;
    /** Start OAuth2 PKCE flow — returns the authorization URL to open */
    getAuthorizationUrl: () => Promise<{ url: string; state: string }>;
    /** Complete OAuth2 flow — exchange code for tokens */
    handleAuthCallback: (code: string, state: string) => Promise<AuthData>;
    logout: () => Promise<void>;
    ready: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoggedIn: false,
    getAuthorizationUrl: async () => { throw new Error('Not init'); },
    handleAuthCallback: async () => { throw new Error('Not init'); },
    logout: async () => { },
    ready: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthData | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        auth.init().then(u => { setUser(u); setReady(true); });
    }, []);

    const getAuthorizationUrl = async () => {
        return auth.getAuthorizationUrl();
    };

    const handleAuthCallback = async (code: string, state: string) => {
        const u = await auth.exchangeCode(code, state);
        setUser(u);
        return u;
    };

    const logout = async () => {
        await auth.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, getAuthorizationUrl, handleAuthCallback, logout, ready }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
