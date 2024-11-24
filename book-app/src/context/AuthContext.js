import React, { createContext, useContext, useState } from 'react';

// Container for auth state and logic
const AuthContext = createContext();


// Wraps the entire app, making all components able to see auth data
const AuthProvider = ({ children }) => {

    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

    const login = (token) => {
        localStorage.setItem('authToken', token);
        setAuthToken(token);
    }

    const logout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
    }

    return (
        <AuthContext.Provider value={{ authToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

// Simplifies access to AuthContext
// Instead of calling useContext(AuthContext), can call useAuth()
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
