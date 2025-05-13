import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import PropTypes from 'prop-types';
import ApiClient from "@/service/ApiClient.jsx";
import {userActions} from "@/utils/authEnums.jsx";

const ServiceContext = createContext();
export const useService = () => {
    return useContext(ServiceContext);
};

export function ServiceProvider({ children }){
    const { authenticated, setLoading} = useAuth();
    const [getAvailableRoom, setAvailableRoom] = useState(null);
    const [rooms, setRooms] = useState([]);

    const getRooms = useCallback(async () => {
        try {
            setLoading(true);
            const response = await ApiClient.instance.getRooms();
            setRooms(response);
        } finally{
            setLoading(false);
        }
    }, []);
    
    const availableBooking = useCallback(async (year, month) => {
        try {
            setLoading(true);
            const response = await ApiClient.instance.availableBooking(year, month);
            setAvailableRoom(response);
        } finally{
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if(authenticated){
            getRooms();
        }
    },[authenticated]);
    
    return (
        <ServiceContext.Provider
            value={{
                getAvailableRoom,
                availableBooking,
                rooms
            }}
        >
            {children}
        </ServiceContext.Provider>
    );
}

ServiceProvider.propTypes = {
    children: PropTypes.node.isRequired
};