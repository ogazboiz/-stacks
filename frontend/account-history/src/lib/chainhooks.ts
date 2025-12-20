import { ChainhooksClient, CHAINHOOKS_BASE_URL, type ChainhookDefinition } from '@hirosystems/chainhooks-client';

/**
 * Get the chainhooks client instance
 * Uses environment variables for configuration
 */
export function getChainhooksClient() {
  const apiKey = process.env.NEXT_PUBLIC_CHAINHOOKS_API_KEY;
  const network = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet';
  
  const baseUrl = network === 'mainnet' 
    ? CHAINHOOKS_BASE_URL.mainnet 
    : CHAINHOOKS_BASE_URL.testnet;

  return new ChainhooksClient({
    baseUrl,
    ...(apiKey && { apiKey }),
  });
}

/**
 * Check if chainhooks API is available
 */
export async function checkChainhooksStatus() {
  try {
    const client = getChainhooksClient();
    const status = await client.getStatus();
    return { available: true, status };
  } catch (error) {
    console.error('Chainhooks API not available:', error);
    return { available: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get all chainhooks with pagination
 */
export async function getAllChainhooks(limit = 20, offset = 0) {
  try {
    const client = getChainhooksClient();
    return await client.getChainhooks({ limit, offset });
  } catch (error) {
    console.error('Error fetching chainhooks:', error);
    throw error;
  }
}

/**
 * Get a specific chainhook by UUID
 */
export async function getChainhook(uuid: string) {
  try {
    const client = getChainhooksClient();
    return await client.getChainhook(uuid);
  } catch (error) {
    console.error('Error fetching chainhook:', error);
    throw error;
  }
}

/**
 * Register a new chainhook
 */
export async function registerChainhook(definition: ChainhookDefinition) {
  try {
    const client = getChainhooksClient();
    return await client.registerChainhook(definition);
  } catch (error) {
    console.error('Error registering chainhook:', error);
    throw error;
  }
}

/**
 * Enable or disable a chainhook
 */
export async function toggleChainhook(uuid: string, enabled: boolean) {
  try {
    const client = getChainhooksClient();
    await client.enableChainhook(uuid, enabled);
  } catch (error) {
    console.error('Error toggling chainhook:', error);
    throw error;
  }
}

/**
 * Delete a chainhook
 */
export async function deleteChainhook(uuid: string) {
  try {
    const client = getChainhooksClient();
    await client.deleteChainhook(uuid);
  } catch (error) {
    console.error('Error deleting chainhook:', error);
    throw error;
  }
}

