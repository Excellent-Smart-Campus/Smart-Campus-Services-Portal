import { useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Badge, MenuItem, Menu} from '@mui/material';
import { useAuth } from '@/context/AuthContext.jsx';
import { useNavigate } from "react-router-dom";
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';

const Navigation = () => {
    const {user, logout} = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const navigate = useNavigate();

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };
    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={logout}>Log Out</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem sx={{flexDirection: 'column', display: 'flex', alignItems: 'start'}}>
                <p>{user?.name}</p>
                <p>{user?.userName}</p>
            </MenuItem>

            <MenuItem onClick={() => navigate(constantRoutes.protected.profile)}>
                <p>Profile</p>
            </MenuItem>
            <MenuItem onClick={logout}>
                <p>Log Out</p>
            </MenuItem>
        </Menu>
    );
    
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        sx={{ mr: 2, display: { sm: 'none' } }} 
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" color="inherit" component="div">
                        Smart Campus Portal
                    </Typography>
                    <Box sx={{flexGrow: 1}}/>
                    <Box sx={{display: 'flex'}}>
                        <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon sx={{fontSize: 30}}/> </Badge>
                        </IconButton>

                        <Box onClick={handleMobileMenuOpen}
                             sx={{
                                 display: 'flex',
                                 alignItems: 'center',
                                 cursor: 'pointer',
                                 p: 1,
                                 borderRadius: 1,
                                 '&:hover': {
                                     bgcolor: 'action.hover',
                                 },
                             }}>

                            <Box sx={{flexDirection: 'column', display: {xs: 'none', md: 'flex'}, ml: 1}}>
                                <Typography variant="h6" noWrap>
                                    {user?.name}
                                </Typography>
                            </Box>
                            <AccountCircle sx={{fontSize: 30}}/>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

                {renderMobileMenu}
                {renderMenu}
        </Box>
);
}

export default Navigation