/**
 * Returns an object with query params from a search string.
 * The resulting object stores pairs of key-value,
 *  where key - a parameter name,
 *        value - a parameter value
 * 
 * @param search - the query string
 */
export const getQueryParams = (search: string) => {
  // Copy the address
  let localSearch = search;
  // Find the question mark.
  // If it is, leave the part after it
  if (localSearch.substring(0, 1) === '?') {
    localSearch = localSearch.substring(1);
  }
  // Form the structure of the result
  const result: { [key: string]: any } = {};
  // The parameters differ from each other with "&".
  localSearch.split('&').forEach(i => {
    // The key and the value are separated with "="
    const item = i.split('=');
    // If there is the key, so it's a boolean parameter.
    //  And if it's included in the search string, its value = "true"
    if (item.length === 1 && item[0]) {
      result[item[0]] = true
    // If it's a pait of key-value,
    //  the key is in the first element, the value is in the second
    } else if (item.length >= 2) {
      result[item[0]] = item[1]
    }
  })

  return result;
}

/**
 * The function returns the parameter value from a search string.
 * 
 * @param search - the query string
 * @param param - the name of the parameter that you want to find
 */
export const getParamFromQueryParams = (search: string, param: string): string => {
  const params = getQueryParams(search);
  return (param in params) ? params[param] : '';
}
