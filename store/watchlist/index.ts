// Import persist from zustand middleware
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TokenType } from "@/types/token.type";

interface WatchlistState {
  watchlist: TokenType[];
  addToWatchlist: (token: TokenType) => void;
  removeFromWatchlist: (tokenId: string) => void;
}

const useWatchlistStore = create(
  persist<WatchlistState>(
    (set, get) => ({
      watchlist: [],

      addToWatchlist: (token) => {
        const { watchlist } = get();
        if (
          token.data &&
          !watchlist.some((w) => w.data && w.data[0].id === token.data![0].id)
        ) {
          set({ watchlist: [...watchlist, token] });
        }
      },

      removeFromWatchlist: (tokenId) => {
        const { watchlist } = get();
        set({
          watchlist: watchlist.filter(
            (token) => token.data && token.data[0].id !== tokenId
          ),
        });
      },
    }),
    {
      name: "watchlist-storage", // unique name of the store in local storage
      getStorage: () => localStorage,
    }
  )
);

export default useWatchlistStore;
