import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',  // REMEMBER!!!: Image upload does not use this type!
    },
});

export default axiosInstance;