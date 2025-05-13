import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { constantRoutes } from "@/utils/constantRoutes.jsx";

export default function RestrictAuth() {
    const { authenticated } = useAuth();

    return authenticated ? <Navigate to={constantRoutes.protected.index} replace /> : <Outlet />;
}
