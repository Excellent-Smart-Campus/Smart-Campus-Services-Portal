import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { getErrorMessageFromResponse } from '@/utils/getErrorMessageFromResponse.jsx';
import { Error, Success } from '@/helper/Toasters.jsx'; 
import PropTypes from 'prop-types';
import ApiClient from "@/service/ApiClient";
import {userActions} from "@/utils/authEnums.jsx";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};
export function AuthProvider({ children }){
    const [currentDashboard, setCurrentDashboard] = useState(null);
    const [profile, setProfile] = useState({});
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userPermissions, setUserPermissions] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const dashboardPriority = [ 
        userActions.ADMIN_DASHBOARD, userActions.LECTURE_DASHBOARD, userActions.STUDENT_DASHBOARD,
    ];

    const navigate = useNavigate();
    const checkAuth = useCallback(async () => {
        setLoading(true);
        try {
            const response = await ApiClient.instance.getUserAuthenticated();
            if (!response.isAuthenticated) return;
            const profileResponse = await ApiClient.instance.getProfile();
            setProfile(profileResponse);
            setAuthenticated(response.isAuthenticated);
            setUser(response.user);
            setUserPermissions(response.userActions);
            const currentD = dashboardPriority.find(d =>
                response.userActions?.some(action => action.actionId === d)
            );
            setCurrentDashboard(currentD)
        } finally {
            setLoading(false);
        }
    }, []);
    

    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const response = await ApiClient.instance.login(email, password);
            Success(response.message);
            await checkAuth();
            
            navigate(constantRoutes.protected.index);
        } catch (e) {
            Error(getErrorMessageFromResponse(e));
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
            setCurrentDashboard(null);
        }
    }, [setUser, setAuthenticated, setUserPermissions, setCurrentDashboard]);

    const canAccess = (action) => {
        const actionIdNumber = Number(action);  // Convert the action to number
        const hasPermission = userPermissions.some(permission => {
            const permissionActionId = Number(permission?.actionId); // Convert permission actionId to number
            return permissionActionId === actionIdNumber;  // Compare the two numbers
        });
        return authenticated && hasPermission;
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
                logout,
                setLoading,
                user,
                canAccess,
                profile,
                currentDashboard
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired
};