// loading.provider.tsx
import React, { createContext, useContext } from "react";
import useLoadingStore from "./loading.store";

const LoadingContext = createContext(null);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const loadingState = useLoadingStore();

  return (
    <LoadingContext.Provider value={loadingState}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return useContext(LoadingContext);
};
