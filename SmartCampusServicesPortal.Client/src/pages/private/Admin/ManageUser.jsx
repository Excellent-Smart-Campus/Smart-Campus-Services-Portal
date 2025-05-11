import  {useState, useEffect } from 'react';
import { decodeId } from '@/utils/hashHelper';
import { useParams } from 'react-router-dom';
import { Box, useMediaQuery } from '@mui/material';
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { useAdmin } from  "@/context/AdminContext.jsx";
import CustomContainer from "@/components/CustomContainer.jsx";
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import ApiClient from '@/service/ApiClient';

const ManageUser = () => {
    const { viewUser, fetchSystemPermission, getSystemPermission } = useAdmin();
    const { userId } = useParams();
    const { canAccess } = useAuth();
    const [ aUser, setAUser ] = useState({});
    const [ user, setUser ] = useState(null);
    
    useEffect(() => {
        const fetchData = async() => {
            if (userId) {       
                const us = viewUser(decodeId(userId));
                setAUser(us);
                const response = await ApiClient.instance.getUser(decodeId(userId));
                setUser(response);
            }
        }
        
        fetchData();
    }, [userId]);

    console.log(aUser);

    return (
       <Box>
            <CustomContainer
                breadcrum={
                    <CustomBreadcrumb
                        items={[
                            { label: 'Admin', link: constantRoutes.protected.admin.index },
                            { label: 'Manage-users-groups', link: constantRoutes.protected.admin.manageUserAndGroups},
                            { label: 'View-user', link: constantRoutes.protected.admin.viewUser},
                        ]}
                    />
                }
                title={`Manage User: ${aUser?.displayName}`}
                children={
                    <Box sx={{ width: '100%'}}>
                        <>
                        </>
                    </Box>
                }

            />
        </Box>
    );
}

export default ManageUser;