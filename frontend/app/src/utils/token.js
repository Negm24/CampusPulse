export const getAccessToken = () =>
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token');

export const removeAccessToken = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
};

export const logout = (navigate) => {
    removeAccessToken();
    if (navigate) {
        navigate('/login');
    } else {
        window.location.href = '/login'; // Fallback if no navigate is passed
    }
};
