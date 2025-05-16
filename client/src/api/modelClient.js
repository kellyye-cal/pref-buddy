import axios from 'axios';
import useAuth from '../hooks/useAuth';

const modelClient = axios.create({
    baseURL: process.env.MODEL_URL || 'http://localhost:8000'
})

export const useAxiosInterceptors = () => {
    const {clearAuthState} = useAuth();

    modelClient.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response && error.response.status === 403) {
            clearAuthState(); // Clear auth state and redirect on 403
          }
          return Promise.reject(error);
        }
      );

    return modelClient;
}

export default modelClient; 