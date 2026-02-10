export const storage = {
    // Token management
    setToken: (token) => {
        localStorage.setItem('access', token);
    },

    getToken: () => {
        return localStorage.getItem('access');
    },

    removeToken: () => {
        localStorage.removeItem('access');
    },

    // Hospital management
    setHospitalId: (id) => {
        localStorage.setItem('hospitalId', id);
    },

    getHospitalId: () => {
        return localStorage.getItem('hospitalId');
    },

    removeHospitalId: () => {
        localStorage.removeItem('hospitalId');
    },

    // User data
    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    removeUser: () => {
        localStorage.removeItem('user');
    },

    // Clear all
    clearAll: () => {
        localStorage.clear();
    },
};