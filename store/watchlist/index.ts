import { create } from "zustand";
import { TokenType } from "@/types/token.type";

interface WatchlistState {
  watchlist: TokenType[];
  addToWatchlist: (token: TokenType) => void;
  removeFromWatchlist: (tokenId: string) => void;
}

const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlist: [],

  addToWatchlist: (token) => {
    const { watchlist } = get();
    // Check if the token is already in the watchlist based on an assumed unique identifier, e.g., token.data[0].id
    if (
      token.data &&
      !watchlist.some((w) => w.data && w.data[0].id === token.data![0].id)
    ) {
      set({ watchlist: [...watchlist, token] });
    }
  },

  removeFromWatchlist: (tokenId) => {
    const { watchlist } = get();
    // Filter out the token based on its id
    set({
      watchlist: watchlist.filter(
        (token) => token.data && token.data[0].id !== tokenId
      ),
    });
  },
}));

export default useWatchlistStore;
