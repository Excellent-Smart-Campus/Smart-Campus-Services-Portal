import { Routes } from 'react-router-dom';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { useAuth } from "@/context/AuthContext.jsx";
import { AppRoutes } from "@/AppRoutes.jsx";
import muiTheme  from "@/utils/theme.jsx";
import Loader from "@/components/Loader.jsx";
import './App.css';

function App() {
    const { loading } = useAuth();
    if (loading) {
        return  <Loader />
    }
  
    return (
        <ThemeProvider theme={muiTheme}>
            <Container maxWidth="lg">
                <CssBaseline />
                <Box sx={{ height: '100vh' }} >
                    <Routes>{ AppRoutes }</Routes>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default App;
