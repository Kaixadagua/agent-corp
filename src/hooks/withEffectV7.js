import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * usewithEffectV7 Hook
 * Enhanced React hook with full functionality
 * @module hooks/usewithEffectV7
 * @version 2.0.0
 */

/**
 * usewithEffectV7 - Custom React hook
 * @param {*} initialValue - Initial value
 * @param {Object} options - Hook options
 * @returns {Object} Hook state and methods
 */
export function usewithEffectV7(initialValue = null, options = {}) {
  // Configuration
  const config = useMemo(() => ({
    debounce: 0,
    persist: false,
    storageKey: null,
    ...options
  }), [options]);

  // State
  const [data, setData] = useState(() => {
    if (config.persist && config.storageKey) {
      try {
        const stored = localStorage.getItem(config.storageKey);
        return stored ? JSON.parse(stored) : initialValue;
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);
  
  // Refs
  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (config.persist && config.storageKey && data !== null) {
      try {
        localStorage.setItem(config.storageKey, JSON.stringify(data));
      } catch (err) {
        console.warn('usewithEffectV7: Failed to persist data', err);
      }
    }
  }, [data, config.persist, config.storageKey]);

  /**
   * Execute operation with loading state
   */
  const execute = useCallback(async (operation, operationOptions = {}) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    setIsStale(false);
    
    const executeOperation = async () => {
      try {
        const result = await operation({
          signal: abortControllerRef.current.signal,
          ...operationOptions
        });
        
        setData(result);
        return result;
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('usewithEffectV7: Operation aborted');
          return null;
        }
        
        setError(err.message || 'Unknown error');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    // Debounce if configured
    if (config.debounce > 0) {
      return new Promise((resolve, reject) => {
        debounceTimerRef.current = setTimeout(() => {
          executeOperation().then(resolve).catch(reject);
        }, config.debounce);
      });
    }
    
    return executeOperation();
  }, [config.debounce]);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setData(initialValue);
    setError(null);
    setLoading(false);
    setIsStale(false);
    
    if (config.persist && config.storageKey) {
      localStorage.removeItem(config.storageKey);
    }
  }, [initialValue, config.persist, config.storageKey]);

  /**
   * Refresh data (mark as stale and re-fetch)
   */
  const refresh = useCallback(() => {
    setIsStale(true);
  }, []);

  /**
   * Update data manually
   */
  const update = useCallback((updater) => {
    if (typeof updater === 'function') {
      setData(prev => updater(prev));
    } else {
      setData(updater);
    }
  }, []);

  return {
    // State
    data,
    loading,
    error,
    isStale,
    
    // Actions
    execute,
    reset,
    refresh,
    update,
    setData
  };
}

// Default export
export default usewithEffectV7;

// Named exports for specific use cases
export const usewithEffectV7WithCache = (initialValue, options) => 
  usewithEffectV7(initialValue, { ...options, persist: true });

export const usewithEffectV7WithDebounce = (initialValue, delay, options) =>
  usewithEffectV7(initialValue, { ...options, debounce: delay });
