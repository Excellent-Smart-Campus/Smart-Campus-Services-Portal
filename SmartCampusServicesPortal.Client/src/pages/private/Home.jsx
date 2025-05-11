import { Box} from '@mui/material';
import { userActions } from "@/utils/authEnums.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { Navigate } from "react-router-dom";
import AccessGuard from "@/components/AccessGuard.jsx";

import NotFound from "@/pages/NotFound.jsx";

function Home() { 
    const { currentDashboard } = useAuth();
    
    const renderDashboard = () => {
        switch (currentDashboard) {
            case userActions.STUDENT_DASHBOARD:
                return <Navigate to={constantRoutes.protected.student.index} />
            case userActions.LECTURE_DASHBOARD:
                return <Navigate to={constantRoutes.protected.lecturer.index} />
            case userActions.ADMIN_DASHBOARD:
                return <Navigate to={constantRoutes.protected.admin.index} />
            default:
                return <NotFound />;
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AccessGuard accessKey={currentDashboard}>
                {renderDashboard()}
            </AccessGuard>
        </Box>
    );
}

export default Home;