import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('customerToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (token) {
                try {
                    // Inject token
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const res = await api.get('/customers/profile');
                    setUser(res.data.profile);
                } catch (error) {
                    console.error('Failed to fetch profile', error);
                    logout();
                }
            } else {
                delete api.defaults.headers.common['Authorization'];
                setUser(null);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [token]);

    const login = async (email, password) => {
        const res = await api.post('/customers/login', { email, password });
        return res.data; // will return message about OTP
    };

    const verifyLogin = async (email, otp) => {
        const res = await api.post('/customers/verify-login', { email, otp });
        localStorage.setItem('customerToken', res.data.token);
        setToken(res.data.token);
        return res.data;
    };

    const signup = async (userData) => {
        const res = await api.post('/customers/signup', userData);
        return res.data; // will return message about OTP
    };

    const verifySignup = async (userData) => {
        const res = await api.post('/customers/verify-signup', userData);
        localStorage.setItem('customerToken', res.data.token);
        setToken(res.data.token);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('customerToken');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, verifyLogin, verifySignup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
