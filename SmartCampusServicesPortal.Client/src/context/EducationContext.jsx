import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ApiClient from "@/service/ApiClient.jsx";
import { useAuth } from "@/context/AuthContext";
import { userActions } from "@/utils/authEnums.jsx";

const EducationContext = createContext();
export const useEducation = () => {
    return useContext(EducationContext);
};

export function EducationProvider({ children }){
    const { authenticated, canAccess, loading, setLoading} = useAuth();
    const [ titles, setTitles ] = useState([]);
    const [enrolled, setEnrolled] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [timeTable, setTimeTable] = useState({});
    const [enrolledError, setEnrolledError] = useState(null);
    const [registeredStakeholders, setRegisteredStakeholders ] = useState([]);
    
    const getEnrolled = useCallback(async () => {
        try {
            const response = await ApiClient.instance.getEnrolledSubject();
            setEnrolled(response);
        } catch (error){
            setEnrolledError(error?.message || "An error occurred while fetching enrolled subjects.");
        }
    }, []);
    
    const getNotifications = useCallback(async () => {
        try {
            const response = await ApiClient.instance.getNotifications();
            setNotifications(response);
            const unreadCount = response.filter(n => !n.isRead).length;
            setNotificationsCount(unreadCount);
        } catch (error){
            setEnrolledError(error?.message || "An error occurred while fetching enrolled subjects.");
        }
    }, []);
    
    const fetchRegisteredStakeholders = useCallback(async (stakeholderTypes) => {
        setLoading(true);
        try {
            const response = await ApiClient.instance.getRegisteredStakeholders(stakeholderTypes);
            setRegisteredStakeholders(response);
        } catch (error){
            setEnrolledError(error?.message || "An error occurred while registered stakeholders.");
        }finally {
            setLoading(false);
        }
    }, []);

    const getTimeTable = useCallback(async () => {
        try {
            const response = await ApiClient.instance.getTimeTable();
            setTimeTable(response);
        } catch (error){
            setEnrolledError(error?.message || "An error occurred while registered stakeholders.");
        }
    }, []);

    const getTitles = useCallback(async () => {
        try {
            const response = await ApiClient.instance.getUserTitles();
            setTitles(response);
        } catch (error){
            setEnrolledError(error?.message || "An error occurred while registered stakeholders.");
        }
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    getEnrolled(), 
                    getTimeTable(), 
                    getTitles(),
                    getNotifications(),
                ]);
            }finally {
                setLoading(false)
            }
        };

        if (authenticated) {
            fetchData();
        }
    }, [authenticated, getEnrolled, getTimeTable, getTitles, getNotifications]);
    
    return (
        <EducationContext.Provider
            value={{
                enrolled,
                timeTable,
                enrolledError,
                fetchRegisteredStakeholders,
                registeredStakeholders,
                notifications,
                titles,
                notificationsCount,
                loading,
                getNotifications
            }}
        >
            {children}
        </EducationContext.Provider>
    );
}

EducationProvider.propTypes = {
    children: PropTypes.node.isRequired
};