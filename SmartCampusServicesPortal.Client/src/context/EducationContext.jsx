import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ApiClient from "@/service/ApiClient.jsx";
import { useAuth } from "@/context/AuthContext";
import {userActions} from "@/utils/authEnums.jsx"; // adjust path if needed

const EducationContext = createContext();
export const useEducation = () => {
    return useContext(EducationContext);
};

export function EducationProvider({ children }){
    const { authenticated, canAccess} = useAuth();
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState([]);
    const [timeTable, setTimeTable] = useState({});
    const [enrolledError, setEnrolledError] = useState(null);
    const [timeTableError, setTimeTableError] = useState(null);
    
    const getEnrolled = useCallback(async () => {
        try {
            const response = await ApiClient.instance.getEnrolledSubject();
            setEnrolled(response);
        } catch (error){
            setEnrolledError(error?.message || "An error occurred while fetching enrolled subjects.");
        }
    }, []);

    const getTimeTable = useCallback(async () => {
        try {
            const response = await ApiClient.instance.getTimeTable();
            setTimeTable(response);
        } catch (error) {
            setEnrolledError(error?.message || "An error occurred while fetching the timetable.");
        }
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
            const viewTimeTable = canAccess(userActions.VIEW_TIMETABLE);
            const enrolledSubject = canAccess(userActions.STUDENT_ENROLLMENT_SUBJECT);

         
                fetchData();
      
        }
    }, [authenticated, getEnrolled, getTimeTable]);
    
    return (
        <EducationContext.Provider
            value={{
                loading,
                enrolled,
                timeTable,
                enrolledError,
                timeTableError
            }}
        >
            {children}
        </EducationContext.Provider>
    );
}

EducationProvider.propTypes = {
    children: PropTypes.node.isRequired
};