import {queryCache} from 'react-query';
const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:9001';

async function login({email, password}) {
  const endpoint = 'login';
  const data = {
    email_address: email,
    password: password,
  };
  const loginResponse = await client(endpoint, {data});
  console.log(`The response from login: ${loginResponse}`);
  return loginResponse;
}

async function signup({email, password}) {
  const endpoint = 'signup';
  const data = {
    email_address: email,
    password,
  };
  return client(endpoint, {data});
}

async function client(
    endpoint,
    {data, token, headers: customHeaders, ...customConfig} = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json; charset=utf-8' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  };

  return window.fetch(`${apiURL}/${endpoint}`, config)
      .then(async (response) => {
        if (response.status === 401) {
          queryCache.clear();
          window.localStorage.clear();
          return Promise.reject(new Error(
              {
                message: 'Please login again to continue',
              },
          ));
        }
        const data = await response.json();
        if (!response.ok) {
          return Promise.reject(
              new Error(data.message),
          );
        }

        return data;
      });
}

export {
  client,
  login,
  signup,
};
