import axios from 'axios';
import { getAccessToken } from './token';

class ApiAxiosManager {
    constructor(
        baseURL = process.env.REACT_APP_LOCALHOST_URL || 'http://localhost:5000'
    ) {
        this.axiosInstance = axios.create({
            baseURL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async get(endpoint, config = {}) {
        try {
            const token = getAccessToken();
            const response = await this.axiosInstance.get(endpoint, {
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: token ? `Bearer ${token}` : '',
                },
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async post(endpoint, data = {}, config = {}) {
        try {
            const response = await this.axiosInstance.post(
                endpoint,
                data,
                config
            );
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    handleError(error) {
        console.error('[API ERROR]', error?.response?.data || error.message);
    }
}

const Api = new ApiAxiosManager();

export default Api;
