import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useApi<T>(
    fetcher: () => Promise<T>,
    deps: any[] = [],
): UseApiState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(() => {
        setLoading(true);
        setError(null);
        fetcher()
            .then(setData)
            .catch(e => setError(e?.message ?? 'Error desconocido'))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => { load(); }, [load]);

    return { data, loading, error, refetch: load };
}
