import { create } from "zustand";

export type TokenChain = {
  id: number;
  name: string;
  symbol: string;
  nativeTokenName: string;
  icon: string;
  url: string;
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
    {
      id: 1,
      nativeTokenName: "eth",
      name: "Ethereum",
      symbol: "eth",
      icon: "ETH.png",
      url: "eth",
    },
    {
      id: 7,
      nativeTokenName: "sol",
      name: "Solana",
      symbol: "solana",
      icon: "SOL.png",
      url: "sol",
    },
    {
      id: 6,
      nativeTokenName: "weth",
      name: "Base",
      symbol: "base",
      icon: "BASE.png",
      url: "base",
    },
    {
      id: 2,
      nativeTokenName: "bnb",
      name: "Binance Smart Chain",
      symbol: "bsc",
      icon: "BSC.png",
      url: "bsc",
    },
    // {
    //   id: 3,
    // nativeTokenName: "matic",
    //   name: "Polygon",
    //   symbol: "matic",
    //   icon: "/MATIC.png",
    //   url: "polygon",
    // },
    {
      id: 4,
      nativeTokenName: "weth",
      name: "Arbitrum",
      symbol: "arbitrum",
      icon: "ARB.png",
      url: "arbitrum",
    },
    {
      id: 5,
      nativeTokenName: "weth",
      name: "Optimism",
      symbol: "optimism",
      icon: "OPT.png",
      url: "optimism",
    },
  ],
  selectedChain: {
    id: 1,
    nativeTokenName: "eth",
    name: "Ethereum",
    symbol: "eth",
    icon: "ETH.png",
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
