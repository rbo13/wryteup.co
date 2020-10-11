import {
  ACTION_REQUEST_LOGIN,
  ACTION_LOGOUT,
  ACTION_LOGIN_SUCCESS,
  ACTION_LOGIN_ERROR,
} from './reducer';

const ROOT_URL = 'http://localhost:9001';

export async function loginUser(dispatch, loginPayload) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(loginPayload),
  };

  try {
    dispatch({
      type: ACTION_REQUEST_LOGIN,
    });
    const response = await window.fetch(`${ROOT_URL}/login`, requestOptions);
    const value = await response.json();

    if (data.success) {
      dispatch({
        type: ACTION_LOGIN_SUCCESS,
        payload: value,
      });
      window.localStorage.setItem('authUser', JSON.stringify(value.data));
      window.localStorage.setItem('authToken', JSON.stringify(value.token));
      return value.data;
    }
    dispatch({
      type: ACTION_LOGIN_ERROR,
      error: data.message,
    });
    console.error(data.message);
    return;
  } catch (error) {
    dispatch({
      type: ACTION_LOGIN_ERROR,
      error: error,
    });
    console.error(error);
  }
};

export async function logout(dispatch) {
  dispatch({
    type: ACTION_LOGOUT,
  });
}

