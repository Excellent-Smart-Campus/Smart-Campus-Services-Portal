import { Navigate, Outlet, useLocation} from "react-router-dom";
import { useState } from 'react';
import { useAuth } from "@/context/AuthContext.jsx";
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { Toolbar  } from '@mui/material';
import { Box } from '@mui/material';
import Navigation from "@/layout/protected/Navigation.jsx";

export default function Protected({ window }) {
    const location = useLocation();
    const { authenticated, user} = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prev) => !prev);
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
            <Navigation handleDrawerToggle={handleDrawerToggle}/>

            <Box sx={{flexGrow: 1, p: { xs: 2, sm: 3 }}}>
                <Box >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
