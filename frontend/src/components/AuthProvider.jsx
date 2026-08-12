// src/components/Authprovider.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "../components/AxiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("/user/me", { withCredentials: true });
                if (response.data.user) setCurrentUser(response.data.user);
            } catch (error) {
                setCurrentUser(null);
                console.error('Not logged in', error);
            }
        };
        checkAuth();
    }, []);

    const signup = async (username, firstName, lastName, password) => {
        try {
            const response = await axios.post('/user/signup', { username, firstName, lastName, password }, { withCredentials: true });
            if (response.data.user) {
                setCurrentUser(response.data.user);
            }
            return response;
        } catch (error) {
            if (error.response) {
                console.error('Signup failed: ', error.response.data);
            } else if (error.request) {
                console.error('Signup failed: No response received', error.request);
            } else {
                console.error('Signup failed: ', error.message);
            }
            throw error;
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post("/user/signin", { username, password }, { withCredentials: true });
            if (response.data.user) {
                setCurrentUser(response.data.user);
            }
            return response;
        } catch (error) {
            if (error.response) {
                console.error('Login failed: ', error.response.data);
            } else if (error.request) {
                console.error('Login failed: No response received', error.request);
            } else {
                console.error('Login failed: ', error.message);
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            const response = await axios.post('/user/logout', {}, { withCredentials: true });
            setCurrentUser(null);
            return response.data;
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

