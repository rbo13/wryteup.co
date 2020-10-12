const authURL = process.env.REACT_APP_AUTH_URL;

const localStorageKey = '__auth_provider_token__';

async function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

function handleUserResponse({data, success}) {
  if (data !== undefined) {
    window.localStorage.setItem(localStorageKey, data.token);
    return data;
  }
  return null;
}

function login({email, password}) {
  return client('login', {
    email_address: email,
    password,
  }).then(handleUserResponse);
}

function register({email, password}) {
  return client('signup', {
    email_address: email,
    password,
  }).then(handleUserResponse);
}

function signout() {
  return window.fetch(`${authURL}/logout`, {
    method: 'GET',
  });
}

async function logout() {
  signout()
      .then((res) => {
        if (!res.ok) {
          return Promise.reject(new Error('Cannot logout'));
        }
        return res.json();
      })
      .then(() => {
        window.localStorage.removeItem(localStorageKey);
        window.localStorage.clear();
      });
}


async function client(endpoint, data) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  return window.fetch(`${authURL}/${endpoint}`, config)
      .then(async (response) => {
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          return data;
        }
        return Promise.reject(data);
      });
}


export {
  getToken,
  login,
  register,
  logout,
  localStorageKey,
};
