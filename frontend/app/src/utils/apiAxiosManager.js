import axios from 'axios';
import { getAccessToken } from './token';

class ApiAxiosManager {
    constructor(
        baseURL = process.env.REACT_APP_LOCALHOST_URL || 'http://localhost:5000'
    ) {
        // We only need ONE instance. Axios will automatically adjust for files.
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

    // Updated POST method: Added Token and dynamic header handling
    async post(endpoint, data = {}, config = {}) {
        try {
            const token = getAccessToken();
            const isFormData = data instanceof FormData;

            const dynamicHeaders = {
                ...config.headers,
                Authorization: token ? `Bearer ${token}` : '',
            };

            if (isFormData) {
                dynamicHeaders['Content-Type'] = undefined;
            }

            const response = await this.axiosInstance.post(endpoint, data, {
                ...config,
                headers: dynamicHeaders,
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async patch(endpoint, data = {}, config = {}) {
        try {
            const token = getAccessToken();
            const response = await this.axiosInstance.patch(endpoint, data, {
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

    async delete(endpoint, config = {}) {
        try {
            const token = getAccessToken();
            const response = await this.axiosInstance.delete(endpoint, {
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

    handleError(error) {
        console.error('[API ERROR]', error?.response?.data || error.message);
    }
}

const Api = new ApiAxiosManager();

export default Api;
