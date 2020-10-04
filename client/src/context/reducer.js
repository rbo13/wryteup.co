import {login, signup} from '../services/api_request';

const ACTION_LOGIN = 'USER_LOGIN';
const ACTION_SIGNUP = 'USER_SIGNUP';
const ACTION_SET_AUTH_TOKEN = 'AUTH_TOKEN';
const ACTION_SET_USER = 'SET_USER';

const reducer = async (state, action) => {
  switch (action.type) {
    case ACTION_LOGIN: {
      // do client request...
      const {email, password} = action.payload;
      await login({
        email,
        password,
      });
      break;
    }
    case ACTION_SIGNUP: {
      const {email, password} = action.payload;
      await signup({
        email,
        password,
      });
      break;
    }
    case 'SET_AUTH_TOKEN': {
      return {
        ...state,
        authenticated: true,
        authToken: action.payload,
      };
    }
    case ACTION_SET_USER: {
      return {
        ...state,
        authenticated: true,
        user: action.user,
      };
    }
    default:
      return state;
  }
};

export {
  reducer,
  ACTION_LOGIN,
  ACTION_SIGNUP,
  ACTION_SET_AUTH_TOKEN,
  ACTION_SET_USER,
};
