import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDataFromApi } from './api';

// Fetches a single endpoint. Pass null to skip.
export const useApi = (url) => {
  const [state, setState] = useState({ data: null, loading: !!url, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!url) {
      setState({ data: null, loading: false, error: null });
      return undefined;
    }
    let active = true;
    setState({ data: null, loading: true, error: null });
    getDataFromApi(url)
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: null, loading: false, error }));
    return () => {
      active = false;
    };
  }, [url, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { ...state, retry };
};

// Fetches a list endpoint and follows `cursorNext` to load further pages.
export const usePaginatedApi = (url, listKey = 'contents') => {
  const [state, setState] = useState({ items: [], meta: null, cursor: null, loading: !!url, error: null });
  const activeUrl = useRef(url);

  const load = useCallback(async (cursor) => {
    if (!url) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await getDataFromApi(cursor ? `${url}&cursor=${encodeURIComponent(cursor)}` : url);
      if (activeUrl.current !== url) return;
      const page = data?.[listKey] || [];
      setState((s) => ({
        items: cursor ? [...s.items, ...page] : page,
        meta: cursor ? s.meta : data,
        cursor: data?.cursorNext || null,
        loading: false,
        error: null,
      }));
    } catch (error) {
      if (activeUrl.current === url) setState((s) => ({ ...s, loading: false, error }));
    }
  }, [url, listKey]);

  useEffect(() => {
    activeUrl.current = url;
    setState({ items: [], meta: null, cursor: null, loading: !!url, error: null });
    load(null);
  }, [url, load]);

  const { items, cursor, loading } = state;
  const loadMore = useCallback(() => {
    if (cursor && !loading) load(cursor);
  }, [cursor, loading, load]);
  const retry = useCallback(() => load(items.length ? cursor : null), [items.length, cursor, load]);

  return { ...state, hasMore: !!cursor, loadMore, retry };
};

export const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
};

// The sidebar slides in as a drawer on the watch page and on narrow screens,
// and is docked (full or mini rail) everywhere else.
export const useSidebarMode = () => {
  const { pathname } = useLocation();
  const isWide = useMediaQuery('(min-width: 1100px)');
  return pathname.startsWith('/video') || !isWide ? 'overlay' : 'docked';
};

export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} - YouTube Clone` : 'YouTube Clone';
  }, [title]);
};

export const useTheme = () => {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
  }, [theme]);
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return [theme, toggleTheme];
};
