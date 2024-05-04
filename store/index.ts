import create from "zustand";

// Define the type for a single token chain
type TokenChain = {
  id: number;
  name: string;
  symbol: string;
  // FIXME: add icons
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
    // Example initial chains
    { id: 1, name: "Ethereum", symbol: "ETH" },
    { id: 2, name: "Binance Smart Chain", symbol: "BSC" },
    { id: 3, name: "Polygon", symbol: "MATIC" },
  ],
  selectedChain: { id: 1, name: "Ethereum", symbol: "ETH" },

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
