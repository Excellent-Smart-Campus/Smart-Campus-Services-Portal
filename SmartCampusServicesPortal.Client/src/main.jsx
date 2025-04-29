import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/AuthContext.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ToastContainer />
                <App />
            </AuthProvider>
        </BrowserRouter>
  </StrictMode>,
)
