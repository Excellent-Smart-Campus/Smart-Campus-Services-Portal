import { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Badge, MenuItem, Menu} from '@mui/material';
import { useAuth } from '@/context/AuthContext.jsx';
import { useNavigate } from "react-router-dom";
import { useEducation } from "@/context/EducationContext.jsx";
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';

const Navigation = ({handleDrawer}) => {
    const {user, logout} = useAuth();
    const { notificationsCount } = useEducation()
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifAnchorEl, setNotifAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

    const navigate = useNavigate();

    const isMenuOpen = Boolean(anchorEl);
    const isNotifMenuOpen = Boolean(notifAnchorEl);

    const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleNotifMenuOpen = (event) => setNotifAnchorEl(event.currentTarget);
    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };
    const handleNotifMenuClose = () => setNotifAnchorEl(null);
    const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);


    const renderProfileMenu = (
        <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
                  <MenuItem size="large" color="inherit" sx={{flexDirection: 'column', display: 'flex', alignItems: 'start'}}>
                <p>{user?.name}</p>
                <p>{user?.userName}</p>
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate(constantRoutes.protected.profile); }}>Profile</MenuItem>
            <MenuItem onClick={logout}>Log Out</MenuItem>
        </Menu>
    );

    const renderNotifMenu = (
        <Menu
            anchorEl={notifAnchorEl}
            open={isNotifMenuOpen}
            onClose={handleNotifMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <MenuItem onClick={() => {navigate(constantRoutes.protected.notification);}}> You have {notificationsCount} new notifications</MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky" component="nav">
                <Toolbar>
                    <IconButton onClick={handleDrawer} color="inherit" edge="start" sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>

                    <Typography onClick={() => {navigate(constantRoutes.protected.index)}} variant="h6" component="div">
                        Smart Campus Portal
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton size="large" color="inherit" onClick={handleNotifMenuOpen}>
                            <Badge badgeContent={notificationsCount} color="error">
                                <NotificationsIcon sx={{ fontSize: 30 }} />
                            </Badge>
                        </IconButton>

                        <Box
                            onClick={handleProfileMenuOpen}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                p: 1,
                                borderRadius: 1,
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', ml: 1 }}>
                                <Typography variant="h6" noWrap>{user?.name}</Typography>
                            </Box>
                            <AccountCircle sx={{ fontSize: 30 }} />
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {renderProfileMenu}
            {renderNotifMenu}
        </Box>
    );
};

export default Navigation