import { auth } from './auth';

// Waydroid usa 192.168.240.1 para acceder al host; emulador estándar usa 10.0.2.2
const BASE_URL = __DEV__ ? 'http://192.168.240.1:9000/api/v1' : 'https://api.example.com/api/v1';

// ============ HTTP helpers ============

function baseHeaders(): Record<string, string> {
    return { 'Content-Type': 'application/json', ...auth.headers() };
}

/** Proactively refresh expired tokens before making requests */
async function ensureFreshToken(): Promise<void> {
    if (auth.isLoggedIn() && auth.isTokenExpired()) {
        await auth.refreshToken();
    }
}

async function get<T>(path: string): Promise<T> {
    await ensureFreshToken();
    const res = await fetch(`${BASE_URL}${path}`, { headers: baseHeaders() });
    if (res.status === 401 && auth.isLoggedIn()) {
        const refreshed = await auth.refreshToken();
        if (refreshed) {
            const retry = await fetch(`${BASE_URL}${path}`, { headers: baseHeaders() });
            if (!retry.ok) throw new Error(`HTTP ${retry.status} GET ${path}`);
            return retry.json() as Promise<T>;
        }
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} GET ${path}`);
    return res.json() as Promise<T>;
}

async function post<T>(path: string, body?: unknown): Promise<T> {
    await ensureFreshToken();
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST', headers: baseHeaders(),
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} POST ${path}`);
    return res.json() as Promise<T>;
}

async function put<T>(path: string, body?: unknown): Promise<T> {
    await ensureFreshToken();
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'PUT', headers: baseHeaders(),
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} PUT ${path}`);
    return res.json() as Promise<T>;
}

async function patch<T>(path: string, body?: unknown): Promise<T> {
    await ensureFreshToken();
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'PATCH', headers: baseHeaders(),
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} PATCH ${path}`);
    return res.json() as Promise<T>;
}

async function del(path: string): Promise<void> {
    await ensureFreshToken();
    const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: baseHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status} DELETE ${path}`);
}

// ============ Tipos paginados ============

interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

function qs(params: Record<string, string | number | boolean | undefined>): string {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== '') q.set(k, String(v));
    }
    const s = q.toString();
    return s ? `?${s}` : '';
}

// ============ Mappers backend → app types ============

function mapProduct(raw: any) {
    const images = raw.productImageSet
        ? raw.productImageSet.split(',').filter(Boolean)
        : raw.bigImage ? [raw.bigImage] : [];
    return {
        id: String(raw.id),
        name: raw.name ?? '',
        description: raw.description ?? '',
        price: raw.sellPriceRaw ?? 0,
        originalPrice: raw.costPriceRaw && raw.costPriceRaw > raw.sellPriceRaw
            ? raw.costPriceRaw : undefined,
        discount: undefined as number | undefined,
        images,
        image: raw.bigImage ?? images[0] ?? '',
        categoryId: raw.categoryId ?? '',
        rating: 0,
        reviewCount: 0,
        inStock: (raw.listedNum ?? 0) > 0,
        stockQuantity: raw.listedNum ?? 0,
        brand: raw.brandName ?? '',
        sku: raw.sku ?? '',
        tags: [] as string[],
        specifications: [] as { label: string; value: string }[],
        isFavorite: false,
        currencySymbol: raw.currencySymbol ?? '$',
    };
}

function mapCategory(raw: any) {
    const icons: Record<string, string> = {
        'Pet Supplies': 'paw',
        'Home Improvement': 'tools',
        'Consumer Electronics': 'laptop',
        'Home, Garden & Furniture': 'couch',
        'Phones & Accessories': 'mobile-alt',
        'Toys, Kids & Babies': 'baby-carriage',
        'Bags & Shoes': 'shopping-bag',
        "Women's Clothing": 'tshirt',
        "Men's Clothing": 'tshirt',
        'Sports & Outdoors': 'running',
        'Beauty & Health': 'spa',
        'Jewelry & Watches': 'gem',
        'Computer & Office': 'desktop',
        'Automobiles & Motorcycles': 'car',
        'Video Games': 'gamepad',
        'Books': 'book',
        'Food & Groceries': 'apple-alt',
        'Electrónica': 'laptop',
        'Ropa': 'tshirt',
        'Hogar': 'couch',
        'Deportes': 'running',
        'Belleza': 'spa',
        'Libros': 'book',
        'Juguetes': 'baby-carriage',
        'Alimentos': 'apple-alt',
    };
    return {
        id: String(raw.id),
        name: raw.name ?? '',
        icon: icons[raw.name] ?? 'box',
        image: '',
        productCount: raw.productCount ?? 0,
        subcategories: (raw.subCategories ?? []).map((sub: any) => ({
            id: String(sub.id),
            name: sub.name ?? '',
            productCount: sub.productCount ?? 0,
        })),
    };
}

function mapCartItem(raw: any) {
    return {
        id: String(raw.id),
        productId: String(raw.productId),
        productName: raw.productName ?? raw.name ?? '',
        productImage: raw.productImage ?? raw.imageUrl ?? raw.bigImage ?? '',
        unitPrice: raw.unitPrice ?? raw.price ?? 0,
        quantity: raw.quantity ?? 1,
        variantId: raw.variantId ?? null,
        selectedAttrs: raw.selectedAttrs ?? null,
    };
}

function mapOrder(raw: any) {
    return {
        id: String(raw.id),
        orderNumber: raw.orderNumber ?? `ORD-${raw.id}`,
        status: (raw.status ?? 'pending').toLowerCase().replace(/ /g, '_'),
        items: (raw.items ?? raw.orderItems ?? []).map((it: any) => ({
            id: String(it.id),
            productId: String(it.productId),
            productName: it.productName ?? it.name ?? '',
            productImage: it.imageUrl ?? '',
            price: it.unitPrice ?? it.price ?? 0,
            quantity: it.quantity ?? 1,
            size: it.size,
            color: it.color,
        })),
        shippingAddress: raw.shippingAddress ?? {
            id: '', label: '', fullName: '', street: '',
            city: '', state: '', zipCode: '', country: '', phone: '', isDefault: false,
        },
        paymentMethod: raw.paymentMethod ?? {
            id: '', type: 'credit_card', label: '', isDefault: false,
        },
        subtotal: raw.subtotal ?? 0, shipping: raw.shippingCost ?? 0,
        tax: raw.tax ?? 0, discount: raw.discount ?? 0,
        loyaltyPointsUsed: raw.loyaltyPointsUsed ?? 0,
        loyaltyPointsEarned: raw.loyaltyPointsEarned ?? 0,
        giftCardAmount: raw.giftCardAmount ?? 0,
        total: raw.total ?? raw.totalAmount ?? 0,
        createdAt: raw.createdAt ?? raw.orderDate ?? '',
        estimatedDelivery: raw.estimatedDelivery ?? '',
        trackingNumber: raw.trackingNumber,
        trackingHistory: (raw.trackingHistory ?? []).map((ev: any) => ({
            id: String(ev.id), status: ev.status,
            description: ev.description ?? '', location: ev.location,
            timestamp: ev.timestamp ?? '', isCompleted: ev.isCompleted ?? false,
        })),
    };
}

function mapInvoice(raw: any) {
    return {
        id: String(raw.id),
        invoiceNumber: raw.invoiceNumber ?? `INV-${raw.id}`,
        orderId: String(raw.orderId ?? ''),
        orderNumber: raw.orderNumber ?? '',
        issuedDate: raw.issuedDate ?? raw.createdAt ?? '',
        dueDate: raw.dueDate ?? '',
        status: (raw.status ?? 'pending').toLowerCase() as 'paid' | 'pending' | 'overdue',
        subtotal: raw.subtotal ?? 0, shipping: raw.shipping ?? 0,
        tax: raw.tax ?? 0, discount: raw.discount ?? 0,
        total: raw.total ?? raw.totalAmount ?? 0,
        items: (raw.items ?? []).map((it: any) => ({
            description: it.description ?? it.productName ?? '',
            quantity: it.quantity ?? 1,
            unitPrice: it.unitPrice ?? it.price ?? 0,
            total: it.total ?? (it.unitPrice ?? 0) * (it.quantity ?? 1),
        })),
        billingAddress: raw.billingAddress ?? {
            id: '', label: '', fullName: '', street: '',
            city: '', state: '', zipCode: '', country: '', phone: '', isDefault: false,
        },
    };
}

// ============ API ============

export const api = {
    // ---- Catálogo público ----
    getCategories: async () => {
        const raw = await get<any[]>('/categories');
        return (raw ?? []).map(mapCategory);
    },

    getProducts: async (params?: { categoryId?: string; size?: number; page?: number; sortBy?: string; ascending?: boolean }) => {
        const q = qs({ categoryId: params?.categoryId, size: params?.size, page: params?.page, sortBy: params?.sortBy, ascending: params?.ascending });
        const result = await get<PageResponse<any>>(`/products${q}`);
        return (result.content ?? []).map(mapProduct);
    },

    getProductsPaged: async (params?: { categoryId?: string; size?: number; page?: number; sortBy?: string; ascending?: boolean }) => {
        const q = qs({ categoryId: params?.categoryId, size: params?.size, page: params?.page, sortBy: params?.sortBy, ascending: params?.ascending });
        const result = await get<PageResponse<any>>(`/products${q}`);
        return {
            products: (result.content ?? []).map(mapProduct),
            totalPages: result.totalPages ?? 1,
            currentPage: result.currentPage ?? 0,
            hasNext: result.hasNext ?? false,
            totalElements: result.totalElements ?? 0,
        };
    },

    getProduct: async (id: string) => {
        const raw = await get<any>(`/products/${id}`);
        return mapProduct(raw);
    },

    getProductVariants: (id: string) => get<any[]>(`/products/${id}/variants`),

    searchProducts: async (params: string | { q: string; categoryId?: string; brand?: string; minPrice?: number; maxPrice?: number; inStock?: boolean; sortBy?: string; page?: number; size?: number }) => {
        const p = typeof params === 'string' ? { q: params } : params;
        const q = qs({ q: p.q, brand: p.brand, minPrice: p.minPrice, maxPrice: p.maxPrice, inStock: p.inStock, sortBy: p.sortBy, page: p.page, size: p.size ?? 24 });
        // categoryId can be multi-value; append manually
        let url = `/public/search${q}`;
        if (typeof params !== 'string' && p.categoryId) {
            url += `&categoryId=${encodeURIComponent(p.categoryId)}`;
        }
        const raw = await get<any>(url);
        return {
            results: (raw.results ?? []).map(mapProduct),
            totalHits: raw.totalHits ?? 0,
            page: raw.page ?? 0,
            size: raw.size ?? 24,
        };
    },

    autocomplete: async (q: string, limit: number = 8) => {
        return get<{ text: string; pid?: string; imageUrl?: string; price?: number }[]>(
            `/public/search/autocomplete?q=${encodeURIComponent(q)}&limit=${limit}`,
        );
    },

    getBrands: () => get<any[]>('/brands'),

    // ---- Carrito (requiere auth) ----
    getCart: async () => {
        const raw = await get<any>('/cart');
        return {
            id: raw.id,
            items: (raw.items ?? []).map(mapCartItem),
            subtotal: raw.subtotal ?? 0,
            itemCount: raw.itemCount ?? 0,
        };
    },

    addToCart: (data: { productId: string; quantity: number; unitPrice: number; productName: string; productImage?: string; variantId?: string; selectedAttrs?: Record<string, string> }) =>
        post<any>('/cart/items', data),

    updateCartItem: (itemId: string, quantity: number) =>
        put<any>(`/cart/items/${itemId}`, { quantity }),

    removeCartItem: (itemId: string) => del(`/cart/items/${itemId}`),

    clearCart: () => del('/cart'),

    applyCoupon: (code: string) => post<any>('/cart/coupon', { code }),
    removeCoupon: () => del('/cart/coupon'),

    // ---- Pedidos (requiere auth) ----
    getOrders: async (params?: { page?: number; size?: number }) => {
        const q = qs({ page: params?.page, size: params?.size ?? 20 });
        const raw = await get<PageResponse<any>>(`/orders/me${q}`);
        return (raw.content ?? []).map(mapOrder);
    },

    getOrder: async (id: string) => {
        const raw = await get<any>(`/orders/${id}`);
        return mapOrder(raw);
    },

    createOrder: (data: any) => post<any>('/orders', data),

    getTracking: (orderId: string) => get<any>(`/orders/${orderId}/tracking`),

    // ---- Facturas (requiere auth) ----
    getInvoices: async (params?: { page?: number; size?: number }) => {
        const q = qs({ page: params?.page, size: params?.size ?? 20 });
        const raw = await get<PageResponse<any>>(`/invoices/me${q}`);
        return (raw.content ?? []).map(mapInvoice);
    },

    getInvoice: async (id: string) => {
        const raw = await get<any>(`/invoices/${id}`);
        return mapInvoice(raw);
    },

    // ---- Envío ----
    getShippingOptions: (country: string) =>
        get<any[]>(`/shipping/options?country=${encodeURIComponent(country)}`),

    // ---- Perfil (requiere auth) — backend devuelve 500, fallback a mock ----
    getProfile: () => get<any>('/profile/me'),
    updateProfile: (data: any) => put<any>('/profile/me', data),

    // ---- Direcciones (requiere auth) ----
    getAddresses: () => get<any[]>('/addresses'),
    createAddress: (data: any) => post<any>('/addresses', data),
    updateAddress: (id: string, data: any) => put<any>(`/addresses/${id}`, data),
    deleteAddress: (id: string) => del(`/addresses/${id}`),

    // ---- Métodos de pago (requiere auth) ----
    getPaymentMethods: () => get<any[]>('/payment-methods'),
    createPaymentMethod: (data: any) => post<any>('/payment-methods', data),
    deletePaymentMethod: (id: string) => del(`/payment-methods/${id}`),

    // ---- Favoritos (requiere auth) ----
    getFavorites: async (): Promise<string[]> => {
        const raw = await get<any>('/favorites?size=1000');
        const content = raw.content ?? raw ?? [];
        return content.map((f: any) => String(f.productId ?? f.id ?? f));
    },
    addFavorite: (productId: string) => post<any>(`/favorites/${productId}`, undefined),
    removeFavorite: (productId: string) => del(`/favorites/${productId}`),

    // ---- Slides / Promociones ----
    getActiveSlides: () => get<any[]>('/slides/active'),

    // ---- Notificaciones (requiere auth) ----
    getNotificationPrefs: () => get<any>('/notification-prefs'),
    updateNotificationPrefs: (data: any) => put<any>('/notification-prefs', data),
};
