import { getHost } from './getHost';
import { getAuthToken, getAuthUser } from './localStorage/auth';

/**
 * This function fulffils an async request
 * 
 * @param url - URL of a server (without host)
 * @param method - the method of the request
 * @param data - the body of the request
 * @param paramHeaders - headers of the request
 * @param addUserInfo - this flag indicates whether add info about the current user
 */
const useFetch = async (
  url: string,
  method: string = 'GET',
  data: any = null,
  paramHeaders: {[key: string]: string} = {},
  addUserInfo: boolean = false
) => {

  const host = getHost();

  // Define body of the request
  if (data) {
    data = JSON.stringify(data);
  }
  // Define headers of the request
  const headers = defineHeaders(paramHeaders, addUserInfo);
  // Execute the request
  const response = await fetch(`${host}${url}`, {
      method,
      headers,
      body: data
    });
  // Get data from the response
  const responseData = await response.json();
  // Get status
  const status = response.status;

  // Return
  return { data: responseData, status };
}

/**
 * This function returns a multi-map names to values.
 * It defines headers for a request.
 * 
 * Also it can add info about the current user.
 * It gets the token and id of the user and add these to headers.
 * 
 * @param paramHeaders 
 * @param addUserInfo 
 */
const defineHeaders = (
  paramHeaders: {[key: string]: string},
  addUserInfo: boolean
): {[key: string]: string} => {

  const headers: { [key: string]: string } = {};
  
  // Add 'Content-Type'
  headers['Content-Type'] = 'application/json';

  // Add user info
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

  // Copy data from paramHeaders - may realize at will

  // Return
  return headers;
}

export {
  useFetch
};
