import { useState } from 'react';
import { Navigate, Outlet, useLocation} from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { Box } from '@mui/material';
import Navigation from "@/layout/protected/Navigation.jsx";
import AppDrawer from "@/layout/protected/AppDrawer.jsx";

export default function Protected(props) {
    const { window } = props;
    const location = useLocation();
    const { authenticated, user} = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

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
            <Navigation handleDrawer={handleDrawerToggle} />
            <AppDrawer handleDrawer={handleDrawerToggle} mobileOpen={mobileOpen} window={window} />
            <Box component="main" sx={{flexGrow: 1, p: { xs: 2, sm: 3 }}}>
                <Outlet />
            </Box>
        </Box>
    );
}
