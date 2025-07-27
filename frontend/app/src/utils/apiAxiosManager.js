import axios from 'axios';

class ApiAxiosManager {
    constructor(
        baseURL = process.env.REACT_APP_LOCAL_NETWORK_URL ||
            'http://localhost:5000'
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
            const response = await this.axiosInstance.get(endpoint, config);
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
