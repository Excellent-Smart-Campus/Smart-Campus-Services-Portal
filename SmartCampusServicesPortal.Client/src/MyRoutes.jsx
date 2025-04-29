import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import React from 'react'
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import Login from "@/pages/auth/Login.jsx";
import Register from "@/pages/auth/Register.jsx";
import Home from '@/pages/private/Home.jsx';
function MyRoutes() {
    return (
        <Routes>
            <Route path={constantRoutes.auth.login} element={<Login />} />
            <Route path={constantRoutes.auth.signUp} element={<Register />} />
            <Route path="/" element={<Home />} />
        </Routes>
    )
}

export default MyRoutes