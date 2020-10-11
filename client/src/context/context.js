import React from 'react';
import { initialState, AuthReducer } from './reducer';

const AuthStateContext = React.createContext();
AuthStateContext.displayName = 'AuthStateContext';

const AuthDispatchContext = React.createContext();
AuthDispatchContext.displayName = 'AuthDispatchContext';

export function useAuthState() {
  const context = React.useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
}

export function useAuthDispatch() {
  const context = React.useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used withing a AuthProvider');
  }
  return context;
}


export const AuthProvider = ({children}) => {
  const [user, dispatch] = React.useReducer(AuthReducer, initialState);

  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
