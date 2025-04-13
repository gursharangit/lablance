// lib/solana-config.ts

// Default Solana cluster to use
export type SolanaCluster = 'mainnet-beta' | 'devnet' | 'testnet';

interface SolanaConfig {
  cluster: SolanaCluster;
  endpoint: string;
  explorerBaseUrl: string;
  confirmationTimeoutSeconds: number;
}

// Function to get Helius RPC URL
export const getHeliusRpcUrl = (apiKey: string | undefined, cluster: SolanaCluster = 'devnet'): string => {
  if (!apiKey) {
    // Fallback to public RPC endpoints if no API key is provided
    return getDefaultRpcUrl(cluster);
  }
  return `https://${cluster}.helius-rpc.com/?api-key=${apiKey}`;
};

// Default RPCs - use as fallback
export const getDefaultRpcUrl = (cluster: SolanaCluster = 'devnet'): string => {
  switch (cluster) {
    case 'mainnet-beta':
      return 'https://api.mainnet-beta.solana.com';
    case 'devnet':
      return 'https://api.devnet.solana.com';
    case 'testnet':
      return 'https://api.testnet.solana.com';
    default:
      return 'https://api.devnet.solana.com';
  }
};

// Get Solana explorer URL for a transaction
export const getExplorerUrl = (signature: string, cluster: SolanaCluster = 'devnet'): string => {
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
};

// Get your Solana configuration
export const getSolanaConfig = (): SolanaConfig => {
  // Get environment variable for Helius API key
  const heliusApiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
  
  // Determine which cluster to use (default to devnet for safety)
  const cluster: SolanaCluster = (process.env.NEXT_PUBLIC_SOLANA_CLUSTER as SolanaCluster) || 'devnet';
  
  return {
    cluster,
    endpoint: heliusApiKey ? getHeliusRpcUrl(heliusApiKey, cluster) : getDefaultRpcUrl(cluster),
    explorerBaseUrl: 'https://explorer.solana.com',
    confirmationTimeoutSeconds: 45, // Increase from default 30 seconds
  };
};

// Export singleton config
export const solanaConfig = getSolanaConfig();
