import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const url = config.url;

    return {
      ...config,
      url: `/api/${url}`,
    };
  },
);

/**
 * Create
 */
export const create = axios.post;

/**
 * Read
 */
export const read = axios.get;
