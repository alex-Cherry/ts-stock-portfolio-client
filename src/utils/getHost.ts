/**
 * Returns the address of the server app
 */
export const getHost = (): string => {
  return '' + process.env.REACT_APP_HOST;
}