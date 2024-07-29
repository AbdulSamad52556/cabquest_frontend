import axios from 'axios';

const httpClient = axios.create({
    baseURL: 'http://localhost:9637',
    withCredentials: true
});

httpClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('daccessToken') || localStorage.getItem('aaccessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('drefreshToken') || localStorage.getItem('arefreshToken');
        
        // Check if error.response is defined and has a status
        if (error.response && error.response.status === 401 && refreshToken) {
            try {
                const response = await axios.post('http://localhost:9637/auth/refresh', {
                    refresh_token: refreshToken
                });

                if (response.status === 200) {
                    const newAccessToken = response.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);

                    // Update the original request with the new access token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Retry the original request
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                console.error('Failed to refresh token', refreshError);
                // Handle refresh token expiration (e.g., redirect to login)
                localStorage.removeItem('accessToken');
                localStorage.removeItem('daccessToken');
                localStorage.removeItem('aaccessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('drefreshToken');
                localStorage.removeItem('arefreshToken');
                localStorage.removeItem('name');
                localStorage.removeItem('dname');
                localStorage.removeItem('aname');
                localStorage.removeItem('isadmin');
                localStorage.removeItem('isdriver');
                localStorage.removeItem('loading');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default httpClient;
