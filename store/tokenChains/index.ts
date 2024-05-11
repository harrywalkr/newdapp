import { create } from "zustand";

// Updated type for a single token chain with new properties
type TokenChain = {
  id: number;
  name: string;
  symbol: string;
  icon: string; // Icon URL for the token
  url: string; // URL for token data or trends
};

// Define the type for the store's state
interface TokenChainState {
  availableChains: TokenChain[];
  selectedChain: TokenChain;
  setSelectedChain: (id: number) => void;
  addChain: (tokenChain: TokenChain) => void;
  removeChain: (id: number) => void;
}

// Create the store
const useTokenChainStore = create<TokenChainState>((set, get) => ({
  availableChains: [
    // Example initial chains updated with new properties
    {
      id: 1,
      name: "Ethereum",
      symbol: "ETH",
      icon: "/ETH.png",
      url: "eth",
    },
    {
      id: 2,
      name: "Binance Smart Chain",
      symbol: "BSC",
      icon: "/BSC.png",
      url: "bsc",
    },
    {
      id: 3,
      name: "Polygon",
      symbol: "MATIC",
      icon: "/MATIC.png",
      url: "polygon",
    },
    {
      id: 4,
      name: "Arbitrum",
      symbol: "ARB",
      icon: "/ARB.png",
      url: "arbitrum",
    },
    {
      id: 5,
      name: "Optimism",
      symbol: "OPT",
      icon: "/OPT.png",
      url: "optimism",
    },
    {
      id: 6,
      name: "Base",
      symbol: "BASE",
      icon: "/BASE.png",
      url: "base",
    },
    {
      id: 7,
      name: "Solana",
      symbol: "SOL",
      icon: "/SOL.png",
      url: "sol",
    },
  ],
  selectedChain: {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    icon: "/ETH.png",
    url: "eth",
  },

  // Method to set the selected chain by its ID
  setSelectedChain: (id) => {
    const chain = get().availableChains.find((chain) => chain.id === id);
    set({ selectedChain: chain });
  },

  // Method to add a new chain to the list of available chains
  addChain: (tokenChain) =>
    set((state) => ({
      availableChains: [...state.availableChains, tokenChain],
    })),

  // Method to remove a chain from the list of available chains by its ID
  removeChain: (id) =>
    set((state) => ({
      availableChains: state.availableChains.filter((chain) => chain.id !== id),
    })),
}));

export default useTokenChainStore;
