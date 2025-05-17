import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import PropTypes from 'prop-types';
import ApiClient from "@/service/ApiClient.jsx";

const AdminContext = createContext();
export const useAdmin = () => {
    return useContext(AdminContext);
};

export function AdminProvider({ children }){
    const { authenticated, canAccess } = useAuth();
    const [ getAllUsers, setAllUsers ] = useState([]);
    const [ getMaintenance, setMaintenance ] = useState([]);
    const [ adminBookings, setAdminBooking] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ getSystemPermission, setSystemPermission ] = useState([]);
    const [ getGroups, setGroups ] = useState([]);
    const [ getBookings, setGetBookings ] = useState([]);
    
    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const response = await ApiClient.instance.getAllUsers();
            setAllUsers(response);
        } finally{
            setLoading(false);
        }
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

    const fetchMaintenance = useCallback(async (stakeholder, statuses) => {
        setLoading(true);
        try {
            const response = await ApiClient.instance.getMaintenance(stakeholder, statuses);
            setMaintenance(response);
        } finally{
            setLoading(false);
        }
    }, []);
    
    const fetchAdminRoomBookings = useCallback( async () => {
        setLoading(true)
        try {
            const response = await ApiClient.instance.getRoomBookingForAdmin();
            setAdminBooking(response);
        } finally{
            setLoading(false);
        }
    }, []);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await ApiClient.instance.getStakeholderBookings();
            setGetBookings(response);
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
                getSystemPermission, 
                fetchSystemPermission,
                getGroups,
                viewGroup,
                viewUser,
                fetchAllUsers,
                fetchGroups,
                loading,
                setLoading,
                getMaintenance,
                fetchMaintenance,
                fetchBookings,
                getBookings,
                fetchAdminRoomBookings,
                adminBookings
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

AdminProvider.propTypes = {
    children: PropTypes.node.isRequired
};