import AsyncStorage from '@react-native-async-storage/async-storage';

// ============ OAuth2 Constants ============

const GATEWAY_URL = __DEV__ ? 'http://192.168.240.1:9000' : 'https://api.example.com';
const CLIENT_ID = 'ecommerce-mobile';
const REDIRECT_URI = 'nx036://auth/callback';
const SCOPES = 'openid';

const AUTHORIZE_URL = `${GATEWAY_URL}/oauth2/authorize`;
const TOKEN_URL = `${GATEWAY_URL}/oauth2/token`;

// AsyncStorage keys
const ACCESS_TOKEN_KEY = 'nx036_access_token';
const REFRESH_TOKEN_KEY = 'nx036_refresh_token';
const TOKEN_TYPE_KEY = 'nx036_token_type';
const TOKEN_EXPIRES_AT_KEY = 'nx036_token_expires_at';
const USER_DATA_KEY = 'nx036_user_data';

// ============ PKCE Utilities ============

function generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
    }
    for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
    }
    return result;
}

/** SHA-256 hash using a simple JS implementation (no crypto module needed) */
async function sha256(plain: string): Promise<ArrayBuffer> {
    // Use a basic implementation for React Native
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    // Try native crypto if available
    if (typeof globalThis.crypto?.subtle?.digest === 'function') {
        return globalThis.crypto.subtle.digest('SHA-256', data);
    }
    // Fallback: use a JS SHA-256 implementation
    return sha256js(data);
}

/** Minimal SHA-256 for environments without crypto.subtle */
function sha256js(data: Uint8Array): ArrayBuffer {
    const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
    ];
    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
    let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
    const len = data.length;
    const bitLen = len * 8;
    const padLen = ((56 - (len + 1) % 64) + 64) % 64;
    const totalLen = len + 1 + padLen + 8;
    const buf = new Uint8Array(totalLen);
    buf.set(data);
    buf[len] = 0x80;
    const view = new DataView(buf.buffer);
    view.setUint32(totalLen - 4, bitLen, false);
    for (let off = 0; off < totalLen; off += 64) {
        const w = new Int32Array(64);
        for (let i = 0; i < 16; i++) w[i] = view.getInt32(off + i * 4, false);
        for (let i = 16; i < 64; i++) {
            const s0 = (rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3));
            const s1 = (rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10));
            w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
        }
        let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
        for (let i = 0; i < 64; i++) {
            const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
            const ch = (e & f) ^ (~e & g);
            const t1 = (h + S1 + ch + K[i] + w[i]) | 0;
            const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const t2 = (S0 + maj) | 0;
            h = g; g = f; f = e; e = (d + t1) | 0;
            d = c; c = b; b = a; a = (t1 + t2) | 0;
        }
        h0 = (h0 + a) | 0; h1 = (h1 + b) | 0; h2 = (h2 + c) | 0; h3 = (h3 + d) | 0;
        h4 = (h4 + e) | 0; h5 = (h5 + f) | 0; h6 = (h6 + g) | 0; h7 = (h7 + h) | 0;
    }
    const result = new ArrayBuffer(32);
    const rv = new DataView(result);
    rv.setInt32(0, h0, false); rv.setInt32(4, h1, false);
    rv.setInt32(8, h2, false); rv.setInt32(12, h3, false);
    rv.setInt32(16, h4, false); rv.setInt32(20, h5, false);
    rv.setInt32(24, h6, false); rv.setInt32(28, h7, false);
    return result;
}

function rotr(n: number, d: number): number {
    return (n >>> d) | (n << (32 - d));
}

function base64urlEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ============ Token Response ============

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    id_token?: string;
}

// ============ Auth Data ============

export interface AuthData {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    nickName?: string;
    roles?: string[];
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresAt: number;
}

// ============ JWT Parsing ============

function parseJwt(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
        const jsonPayload = decodeURIComponent(
            atob(padded)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

// ============ PKCE State ============

let pkceState: { verifier: string; state: string } | null = null;

// ============ Auth Service ============

let currentAuth: AuthData | null = null;

export const auth = {
    /** Initialize auth from persistent storage */
    init: async (): Promise<AuthData | null> => {
        try {
            const stored = await AsyncStorage.getItem(USER_DATA_KEY);
            if (stored) {
                currentAuth = JSON.parse(stored);
                // Check if token is expired
                if (currentAuth && currentAuth.expiresAt < Date.now() - 30000) {
                    // Try to refresh
                    const refreshed = await auth.refreshToken();
                    if (!refreshed) {
                        await auth.logout();
                        return null;
                    }
                }
                return currentAuth;
            }
        } catch { }
        return null;
    },

    /** Generate PKCE authorization URL for WebView */
    getAuthorizationUrl: async (): Promise<{ url: string; state: string }> => {
        const verifier = generateRandomString(64);
        const state = generateRandomString(32);
        const nonce = generateRandomString(32);
        const challengeBuffer = await sha256(verifier);
        const challenge = base64urlEncode(challengeBuffer);

        pkceState = { verifier, state };

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            scope: SCOPES,
            response_mode: 'query',
            state,
            nonce,
            code_challenge: challenge,
            code_challenge_method: 'S256',
        });

        return {
            url: `${AUTHORIZE_URL}?${params.toString()}`,
            state,
        };
    },

    /** Exchange authorization code for tokens */
    exchangeCode: async (code: string, returnedState: string): Promise<AuthData> => {
        if (!pkceState || pkceState.state !== returnedState) {
            throw new Error('Invalid state parameter');
        }

        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            code,
            redirect_uri: REDIRECT_URI,
            code_verifier: pkceState.verifier,
        });

        const res = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            credentials: 'include',
            body: body.toString(),
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(`Token exchange failed: ${res.status} ${error}`);
        }

        const tokens: TokenResponse = await res.json();
        pkceState = null;

        return auth._storeTokens(tokens);
    },

    /** Refresh the access token */
    refreshToken: async (): Promise<boolean> => {
        if (!currentAuth?.refreshToken) return false;

        try {
            const body = new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: CLIENT_ID,
                refresh_token: currentAuth.refreshToken,
            });

            const res = await fetch(TOKEN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                credentials: 'include',
                body: body.toString(),
            });

            if (!res.ok) return false;

            const tokens: TokenResponse = await res.json();
            await auth._storeTokens(tokens);
            return true;
        } catch {
            return false;
        }
    },

    /** Store tokens and extract user info from JWT */
    _storeTokens: async (tokens: TokenResponse): Promise<AuthData> => {
        const jwt = parseJwt(tokens.access_token);
        const authData: AuthData = {
            userId: jwt?.id ?? jwt?.sub ?? '',
            email: jwt?.email ?? jwt?.sub ?? '',
            firstName: jwt?.firstName ?? jwt?.given_name ?? '',
            lastName: jwt?.lastName ?? jwt?.family_name ?? '',
            nickName: jwt?.nickName ?? '',
            roles: jwt?.roles ?? jwt?.authorities ?? [],
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenType: tokens.token_type ?? 'Bearer',
            expiresAt: Date.now() + (tokens.expires_in ?? 3600) * 1000,
        };

        currentAuth = authData;
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(authData));
        return authData;
    },

    /** Logout — clear all stored tokens */
    logout: async (): Promise<void> => {
        currentAuth = null;
        await Promise.all([
            AsyncStorage.removeItem(USER_DATA_KEY),
            AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
            AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
            AsyncStorage.removeItem(TOKEN_TYPE_KEY),
            AsyncStorage.removeItem(TOKEN_EXPIRES_AT_KEY),
        ]);
    },

    /** Get current auth data */
    get: (): AuthData | null => currentAuth,

    /** Check if token is expired (with 30s buffer) */
    isTokenExpired: (): boolean => {
        if (!currentAuth) return true;
        return Date.now() >= currentAuth.expiresAt - 30000;
    },

    /** Get authentication headers for API requests — matches web's authFetch pattern */
    headers: (): Record<string, string> => {
        const h: Record<string, string> = {
            // nxFetch header — same as web
            'X-nx036-auth': `NX036.${btoa(`${CLIENT_ID}:${Date.now()}`)}`,
            'X-Currency': 'USD',
        };
        if (currentAuth?.accessToken) {
            h['Authorization'] = `${currentAuth.tokenType ?? 'Bearer'} ${currentAuth.accessToken}`;
        }
        return h;
    },

    isLoggedIn: (): boolean => currentAuth !== null,

    /** Constants for WebView auth */
    AUTHORIZE_URL,
    TOKEN_URL,
    CLIENT_ID,
    REDIRECT_URI,
    GATEWAY_URL,
};
