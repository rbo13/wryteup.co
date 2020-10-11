import {queryCache} from 'react-query';
import * as auth from '../auth-provider';
const apiURL = process.env.REACT_APP_API_URL;

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
          await auth.logout();
          window.location.assign(window.location);
          return Promise.reject(new Error({
            message: 'Please re-authenticate.',
          }));
        }
        const data = await response.json();
        if (response.ok) {
          return data;
        }
        return Promise.reject(data);
      });
}

export {client};
