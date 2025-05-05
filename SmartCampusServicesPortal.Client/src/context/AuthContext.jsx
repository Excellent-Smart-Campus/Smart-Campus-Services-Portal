import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Success, Error } from '@/helper/toasters';
import { errorMessages } from '@/utils/errorMessages';
import ApiClient from "@/service/ApiClient";
import {constantRoutes} from "@/utils/constantRoutes.jsx";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};
export function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userPermissions, setUserPermissions] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    
    const checkAuth = useCallback(async () => {
        setLoading(true);
        try {
            const response = await ApiClient.instance.getUserAuthenticated();
            if (!response.isAuthenticated) return;
            setAuthenticated(response.isAuthenticated);
            setUser(response.user);
            setUserPermissions(response.userActions);
        } finally {
            setLoading(false);
        }
    }, []);
    
    const getProfile = useCallback(async () => {
        setLoading(true);
        try {
            const response = await ApiClient.instance.getProfile();
            setProfile(response);
        } finally {
            setLoading(false);
        }
    },[]);
    
    const login = useCallback(async (email, password) => {
        setLoading(true);
        setErrors({});
        try {
            const response = await ApiClient.instance.login(email, password);

            if (!response.success) {
                setErrors({ general: response.message });
                return;
            }
            Success(response.message);
            await checkAuth();
            navigate(constantRoutes.protected.index);
        } catch {
            setErrors({ general: errorMessages.error });
        } finally {
            setLoading(false);
        }
    }, [checkAuth, navigate]);
    
    const logout = useCallback(async () => {
        const response = await ApiClient.instance.logout();
        if (response.success) {
            setUser(null);
            setAuthenticated(false);
            setUserPermissions([]);
        }
    }, [setUser, setAuthenticated, setUserPermissions]);

    const canAccess = (action) => {
        console.log(action);
        console.log(userPermissions);
        return authenticated && userPermissions.some(action => action?.actionId === action);
    };
    
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

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
                profile,
                canAccess,
                getProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
