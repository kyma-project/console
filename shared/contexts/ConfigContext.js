import React, { createContext, useContext } from 'react';

export const ConfigContext = createContext({});

const DEFAULT_PREFIX = 'REACT_APP_';

export const configFromEnvVariables = (env, prefix, fallback = {}) =>
  Object.keys(env).reduce(
    (acc, prop) =>
      prop.startsWith(prefix)
        ? { ...acc, [prop.replace(prefix, '')]: env[prop] }
        : acc,
    fallback,
  );

const fromConfig = clusterConfig => endpoint => clusterConfig[endpoint];

export const ConfigProvider = ({
  env = process.env,
  children,
  prefix = DEFAULT_PREFIX,
}) => {
  const config = configFromEnvVariables(env, prefix, window.clusterConfig);
  return (
    <ConfigContext.Provider value={{ fromConfig: fromConfig(config) }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
