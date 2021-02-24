import React, { createContext, useContext } from 'react';
import { getClusterConfig } from '../utils/getClusterConfig';

export const ConfigContext = createContext({});

export const fromConfig = clusterConfig => endpoint => clusterConfig[endpoint];

export const ConfigProvider = ({ children }) => {
  const clusterConfig = getClusterConfig();
  return (
    <ConfigContext.Provider value={{ fromConfig: fromConfig(clusterConfig) }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
