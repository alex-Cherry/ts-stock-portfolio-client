import { getHost } from './getHost';
import { getAuthToken, getAuthUser } from './localStorage/auth';

const useFetch = async (
  url: string,
  method: string = 'GET',
  data: any = null,
  paramHeaders: {[key: string]: string} = {},
  addUserInfo: boolean = false
) => {

  const host = getHost();

  // define body of a request
  if (data) {
    data = JSON.stringify(data);
  }

  // define headers of a request
  const headers = defineHeaders(paramHeaders, addUserInfo);

  const response = await fetch(`${host}${url}`, {
      method,
      headers,
      body: data
    });
  const responseData = await response.json();
  const status = response.status;

  return { data: responseData, status };
}

const defineHeaders = (
  paramHeaders: {[key: string]: string},
  addUserInfo: boolean
): {[key: string]: string} => {

  const headers: { [key: string]: string } = {};
  
  // add 'Content-Type'
  headers['Content-Type'] = 'application/json';

  // add user info
  if (addUserInfo) {
    // token
    const token = getAuthToken();
    if (token) {
      headers['authorization-token'] = token;
    }
    // userId
    const user = getAuthUser();
    if (user) {
      headers['authorization-userid'] = user.id;
    }
  }

  // copy data from paramHeaders

  return headers;
}

export {
  useFetch
};
