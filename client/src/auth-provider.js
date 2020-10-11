const localStorageKey = '__auth_provider_token__';

async function getToken() {
  return window.localStorage.getItem(localStorageKey);
}

function handleUserResponse({data, success}) {
  console.log(data);
  console.log(success);
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

async function logout() {
  window.localStorage.removeItem(localStorageKey);
  window.localStorage.clear();
}

const authURL = process.env.REACT_APP_AUTH_URL;

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
