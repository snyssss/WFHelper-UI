import React, {
  PropsWithChildren,
  ReactElement,
  createContext,
  useContext,
} from 'react';

export interface LoadProviderProps {
  loading: boolean;
}

const LoadContext = createContext<LoadProviderProps>({} as LoadProviderProps);

const LoadProvider = ({
  children,
  ...props
}: PropsWithChildren<LoadProviderProps>): ReactElement => {
  const { loading } = useContext(LoadContext);

  return (
    <LoadContext.Provider
      value={{
        ...props,
        loading: loading || props.loading,
      }}
    >
      {children}
    </LoadContext.Provider>
  );
};

const useLoading = (): boolean => {
  const { loading } = useContext(LoadContext);

  return loading || false;
};

export default LoadProvider;

export { LoadContext, useLoading };
