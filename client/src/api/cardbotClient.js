import axios from 'axios';
import useAuth from '../hooks/useAuth';

const cardbotClient = axios.create({
    baseURL: process.env.CARDBOT_URL || 'http://localhost:5001'
})
export const useAxiosInterceptors = () => {
    const {clearAuthState} = useAuth();

    cardbotClient.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response && error.response.status === 403) {
            clearAuthState(); // Clear auth state and redirect on 403
          }
          return Promise.reject(error);
        }
      );

    return cardbotClient;
}

export default cardbotClient; 