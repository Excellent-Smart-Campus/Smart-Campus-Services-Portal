import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import PropTypes from 'prop-types';
import ApiClient from "@/service/ApiClient.jsx";

const AdminContext = createContext();
export const useAdmin = () => {
    return useContext(AdminContext);
};

export function AdminProvider({ children }){
    const { authenticated, canAccess, setLoading} = useAuth();
    const [getAllUsers, setAllUsers] = useState([]);
    const [getGroupActions, setGroupActions] = useState([]);
    const [getSystemPermission, setSystemPermission] = useState([]);
    const [getGroups, setGroups] = useState([]);
    
    const fetchAllUsers = async () => {
        const response = await ApiClient.instance.getAllUsers();
        setAllUsers(response);
    };
    
    const fetchSystemPermission = useCallback(async () => {
        try {
            setLoading(true);
            const response = await ApiClient.instance.getSystemPermission();
            setSystemPermission(response);
        } finally{
            setLoading(false);
        }
    }, []);

    const fetchGroups = useCallback(async (groupId) => {
        try {
            setLoading(true);
            const response = await ApiClient.instance.getGroup(groupId);
            setGroups(response);
        } finally{
            setLoading(false);
        }
    }, []);

    const viewGroup = groupId => {
        return getGroups.find(group => group.groupId === Number(groupId));
    };

    const viewUser = stakeholderId => {
        return getAllUsers.find(user => user.stakeholderId === Number(stakeholderId));
    };
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchSystemPermission(), fetchGroups()]);
            setLoading(false);
        };

        if(authenticated){
            fetchData();
        }
    },[authenticated, fetchSystemPermission, fetchGroups]);

    return (
        <AdminContext.Provider
            value={{
                getAllUsers,
                getGroupActions,
                getSystemPermission, 
                fetchSystemPermission,
                getGroups,
                viewGroup,
                viewUser,
                fetchAllUsers,
                fetchGroups
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

AdminProvider.propTypes = {
    children: PropTypes.node.isRequired
};