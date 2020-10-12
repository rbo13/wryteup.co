import React from 'react';
import {queryCache} from 'react-query';
import * as auth from '../auth-provider';
import {client} from '../utils/api-client';
import {useAsync} from '../utils/hooks';
import {FullPageError} from '../screens/FullPageError';

async function bootstrapAppData() {
  let user = null;
  const token = await auth.getToken();
  if (token) {
    const response = await client('bootstrap', {token});
    if (response.success) {
      queryCache.setQueryData('user-info', response.data, {
        staleTime: 5000,
      });
      user = response.data;
    }
  }
  return user;
}

const AuthContext = React.createContext();
AuthContext.displayName = 'AuthContext';

function AuthProvider(props) {
  const {
    data: user,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync();

  React.useEffect(() => {
    const appDataPromise = bootstrapAppData();
    run(appDataPromise);
  }, [run]);

  const login = React.useCallback(
      (form) => auth.login(form).then((user) => setData(user)),
      [setData],
  );
  const signup = React.useCallback(
      (form) => auth.register(form).then((user) => setData(user)),
      [setData],
  );
  const logout = React.useCallback(() => {
    auth.logout();
    queryCache.clear();
    setData(null);
  }, [setData]);

  const value = React.useMemo(() => ({
    user,
    login,
    logout,
    signup,
  }), [
    login,
    logout,
    signup,
    user,
  ]);

  if (isLoading || isIdle) {
    return <div> I am still loading </div>;
  }

  if (isError) {
    return <FullPageError error={error} />;
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />;
  }

  throw new Error(`Unhandled status: ${status}`);
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

function useClient() {
  const {user} = useAuth();
  // const token = user.token;
  const token = user?.token;
  return React.useCallback(
      (endpoint, config) => client(endpoint, {...config, token}),
      [token],
  );
}

export {
  AuthProvider,
  useAuth,
  useClient,
};

