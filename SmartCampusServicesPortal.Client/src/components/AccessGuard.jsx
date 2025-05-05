import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { constantRoutes } from "@/utils/constantRoutes.jsx";

export default function AccessGuard({ accessKey, children }) {
    const { canAccess } = useAuth();
    if (!canAccess(accessKey)) {
        return <Navigate to={constantRoutes.access.unauthorised} replace />;
    }
    
    return children;
}
