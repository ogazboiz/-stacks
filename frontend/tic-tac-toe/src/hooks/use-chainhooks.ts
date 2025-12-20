"use client";

import { useEffect, useState } from 'react';
import {
  checkChainhooksStatus,
  getAllChainhooks,
  getChainhook,
  registerChainhook,
  toggleChainhook,
  deleteChainhook,
} from '@/lib/chainhooks';
import type { Chainhook, ChainhookDefinition, ApiStatusResponse } from '@hirosystems/chainhooks-client';

export function useChainhooks() {
  const [status, setStatus] = useState<ApiStatusResponse | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [chainhooks, setChainhooks] = useState<Chainhook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check API status on mount
  useEffect(() => {
    async function checkStatus() {
      const result = await checkChainhooksStatus();
      setIsAvailable(result.available);
      if (result.available && result.status) {
        setStatus(result.status);
      } else {
        setError(result.error || 'Chainhooks API not available');
      }
    }
    checkStatus();
  }, []);

  // Load chainhooks
  async function loadChainhooks(limit = 20, offset = 0) {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllChainhooks(limit, offset);
      setChainhooks(response.results);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chainhooks';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Get a specific chainhook
  async function loadChainhook(uuid: string) {
    setLoading(true);
    setError(null);
    try {
      const chainhook = await getChainhook(uuid);
      return chainhook;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chainhook';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Register a new chainhook
  async function handleRegisterChainhook(definition: ChainhookDefinition) {
    setLoading(true);
    setError(null);
    try {
      const result = await registerChainhook(definition);
      // Reload chainhooks after registration
      await loadChainhooks();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register chainhook';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Toggle chainhook enabled state
  async function handleToggleChainhook(uuid: string, enabled: boolean) {
    setLoading(true);
    setError(null);
    try {
      await toggleChainhook(uuid, enabled);
      // Reload chainhooks after toggle
      await loadChainhooks();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle chainhook';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Delete a chainhook
  async function handleDeleteChainhook(uuid: string) {
    setLoading(true);
    setError(null);
    try {
      await deleteChainhook(uuid);
      // Reload chainhooks after deletion
      await loadChainhooks();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete chainhook';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    status,
    isAvailable,
    chainhooks,
    loading,
    error,
    loadChainhooks,
    loadChainhook,
    registerChainhook: handleRegisterChainhook,
    toggleChainhook: handleToggleChainhook,
    deleteChainhook: handleDeleteChainhook,
  };
}

