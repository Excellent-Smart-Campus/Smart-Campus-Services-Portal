// src/layout/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AccessGuard from "@/components/AccessGuard.jsx";
import { userActions } from "@/utils/authEnums.jsx";

const AdminLayout = () => {
    return (
        <AccessGuard accessKey={userActions.ADMIN_DASHBOARD}>
            <Outlet />
        </AccessGuard>
    );
};

export default AdminLayout;
