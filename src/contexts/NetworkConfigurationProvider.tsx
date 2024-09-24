// src/contexts/NetworkConfigurationProvider.tsx

"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface NetworkConfigurationContextProps {
  networkConfiguration: string;
  setNetworkConfiguration: (network: string) => void;
}

const NetworkConfigurationContext = createContext<NetworkConfigurationContextProps | undefined>(undefined);

export const useNetworkConfiguration = () => {
  const context = useContext(NetworkConfigurationContext);
  if (!context) {
    throw new Error('useNetworkConfiguration must be used within a NetworkConfigurationProvider');
  }
  return context;
};

export const NetworkConfigurationProvider = ({ children }: { children: ReactNode }) => {
  const [networkConfiguration, setNetworkConfiguration] = useState('mainnet-beta');

  return (
    <NetworkConfigurationContext.Provider value={{ networkConfiguration, setNetworkConfiguration }}>
      {children}
    </NetworkConfigurationContext.Provider>
  );
};
