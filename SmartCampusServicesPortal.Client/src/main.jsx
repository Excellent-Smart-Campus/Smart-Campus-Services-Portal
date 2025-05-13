import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext.jsx';
import { EducationProvider } from "@/context/EducationContext.jsx";
import { ServiceProvider } from "@/context/ServiceContext.jsx";
import { AdminProvider } from "@/context/AdminContext.jsx";
import { ToastContainer } from 'react-toastify';
import App from './App.jsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <EducationProvider>
                    <ServiceProvider>
                        <AdminProvider>
                            <ToastContainer />
                            <App />
                        </AdminProvider>
                    </ServiceProvider>
                </EducationProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
)
