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
    const { authenticated, canAccess, setLoading} = useAuth();
    const [enrolled, setEnrolled] = useState([]);
    const [timeTable, setTimeTable] = useState({});
    const [enrolledError, setEnrolledError] = useState(null);
    
    const getEnrolled = useCallback(async () => {
        try {
            const response = await ApiClient.instance.getEnrolledSubject();
            setEnrolled(response);
        } catch (error){
            setEnrolledError(error?.message || "An error occurred while fetching enrolled subjects.");
        }
    }, []);

    const getTimeTable = useCallback(async () => {
        const response = await ApiClient.instance.getTimeTable();
        setTimeTable(response);
    }, []);

    const getSubjectDetails = useCallback(async  () => {
        try {
            const response = await ApiClient.instance.getTimeTable();
            setTimeTable(response);
        } catch (error) {
            setEnrolledError(error?.message || "An error occurred while fetching the timetable.");
        }
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([getEnrolled(), getTimeTable()]);
            setLoading(false);
        };

        if (authenticated) {
            fetchData();
        }
    }, [authenticated, getEnrolled, getTimeTable]);
    
    return (
        <EducationContext.Provider
            value={{
                enrolled,
                timeTable,
                enrolledError
            }}
        >
            {children}
        </EducationContext.Provider>
    );
}

EducationProvider.propTypes = {
    children: PropTypes.node.isRequired
};