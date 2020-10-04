import React from 'react';
import {reducer, ACTION_LOGIN, ACTION_SIGNUP} from './reducer';

const initialState = {
  authenticated: false,
  user: Object.assign({}, null),
  authToken: '',
};

const GlobalContext = React.createContext(initialState);
GlobalContext.displayName = 'GlobalContext';

const AppProvider = ({children}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const userLogin = ({email, password}) => {
    dispatch({
      type: ACTION_LOGIN,
      payload: {
        email,
        password,
      },
    });
  };

  const userSignup = ({email, password}) => {
    dispatch({
      type: ACTION_SIGNUP,
      payload: {
        email,
        password,
      },
    });
  };

  return (
    <GlobalContext.Provider
      value={{
        user: state.user,
        authToken: state.authToken,
        authenticated: state.authenticated,
        userLogin,
        userSignup,
      }}
    >
      { children }
    </GlobalContext.Provider>
  );
};

export {GlobalContext, AppProvider};
