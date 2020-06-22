import axios from 'axios';
import { getHost } from '../../utils/getHost';
// import interceptors
// import interceptors from "./interceptors";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const instance = axios.create({
  // baseURL: process.env.REACT_APP_BASE_URL
  headers: {
    'Content-Type': 'application/json'
  },
  baseURL: getHost(),
  cancelToken: source.token,
  validateStatus: status => {
    return status < 500;
  }
});

// interceptors(instance);
export { source as axiosSource };
export default instance;