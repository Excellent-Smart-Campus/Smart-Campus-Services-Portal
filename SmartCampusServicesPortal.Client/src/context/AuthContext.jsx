import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiClient from "@/service/ApiClient";
import { Success, Error } from '@/helper/toasters';
import { errorMessages } from '@/utils/errorMessages';
import {userActions} from "@/utils/authEnums.jsx";

const AuthContext = createContext();

export function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userPermissions, setUserPermissions] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    
    const login = async (email, password) => {
        setLoading(true);
        setErrors({});
        try {
            const response = await ApiClient.instance.login(email, password);

            if (!response.success) {
                setErrors({ general: response.message });
                return;
            }
            Success(response.message);
        } catch {
            setErrors({ general: errorMessages.error });
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        const response = await ApiClient.instance.logout();
        if (response.success) {
            setUser(null);
            setAuthenticated(false);
            setUserPermissions([]);
        }
    };
    
    return (
        <AuthContext.Provider
            value={{
                authenticated,
                login,
                loading,
                errors,
                logout,
                setErrors,
                setLoading,
                user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    return useContext(AuthContext);
};