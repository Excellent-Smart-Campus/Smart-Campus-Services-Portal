import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import {constantRoutes} from "@/utils/constantRoutes.jsx";
import { userActions } from "@/utils/authEnums.jsx";
import Login from "@/pages/auth/Login.jsx";
import Register from "@/pages/auth/Register.jsx";
import Profile from "@/pages/private/Profile.jsx";
import Home from "@/pages/private/Home.jsx";
import {useAuth} from "@/context/AuthContext.jsx";
import Protected from "@/layout/protected/Protected.jsx";
import Unauthorized from "@/pages/Unauthorized.jsx";
import NotFound from "@/pages/NotFound.jsx";
import RestrictAuth from "@/layout/RestrictAuth.jsx";
import AccessGuard from "@/components/AccessGuard.jsx";
import muiTheme  from "@/utils/theme.jsx";
import './App.css';
import Loader from "@/components/Loader.jsx";
import Notification from "@/pages/private/Notification.jsx";

function App() {
    const { loading } = useAuth();
    if (loading) {
        return  <Loader />;
    }
    return (
        <ThemeProvider theme={muiTheme}>
            
            <Container maxWidth="lg">
            <CssBaseline />
            <Box sx={{ height: '100vh' }} >
                <Routes>
                    <Route element={<RestrictAuth />}>
                        <Route path={constantRoutes.auth.login} element={<Login />} />
                        <Route path={constantRoutes.auth.signUp} element={<Register />} />
                    </Route>
                    
                    <Route element={<Protected />}>
                        <Route path={constantRoutes.protected.profile} 
                               element={
                                    //<AccessGuard accessKey={userActions.UPDATE_PROFILE}>
                                        <Profile />
                                  //  </AccessGuard>
                            } 
                        />
                        <Route path={constantRoutes.protected.index}  element={ <Home /> } />
                        <Route path={constantRoutes.protected.notification}
                               element={
                                //<AccessGuard accessKey={userActions.UPDATE_PROFILE}>
                                   <Notification />
                                //</AccessGuard>
                        } />
                    </Route>
                    
                    <Route path={constantRoutes.access.unauthorised} element={<Unauthorized/>} />
                    <Route path={constantRoutes.access.notFound} element={<NotFound />} />
                </Routes>
            </Box>
        </Container>
        </ThemeProvider>
    );
}

export default App;
