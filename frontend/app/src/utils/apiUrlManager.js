class ApiUrlManager {
    constructor() {
        this.baseurl = 'http://localhost:5000';
        this.localNeworkUrl = 'http://192.168.1.4:5000';
    }
    setBaseUrl(newUrl) {
        this.baseurl = newUrl;
    }
    getBaseUrl() {
        return this.baseurl;
    }
    getlocalNetworkUrl() {
        return this.localNeworkUrl;
    }
    getFullUrl(endpoint) {
        return `${this.baseurl}${endpoint}`;
    }
}

const apiUrlManager = new ApiUrlManager();

Object.freeze(apiUrlManager);

export default apiUrlManager;
