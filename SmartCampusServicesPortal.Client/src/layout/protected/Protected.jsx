import { Navigate, Outlet, useLocation} from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { Box } from '@mui/material';
import Navigation from "@/layout/protected/Navigation.jsx";

export default function Protected() {
    const location = useLocation();
    const { authenticated, user} = useAuth();
    
    if (!user && !authenticated) {
        return (
            <Navigate
                to={constantRoutes.auth.login}
                state={{ from: location }}
                replace
            />
        );
    }
    
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Navigation />

            <Box sx={{flexGrow: 1, p: { xs: 2, sm: 3 }}}>
                <Box >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
