import { Route, Outlet } from 'react-router-dom';
import {userActions} from "@/utils/authEnums.jsx";
import {constantRoutes} from "@/utils/constantRoutes.jsx";
import RestrictAuth from "@/layout/RestrictAuth.jsx";
import Login from "@/pages/auth/Login.jsx";
import Register from "@/pages/auth/Register.jsx";
import Protected from "@/layout/protected/Protected.jsx";
import AccessGuard from "@/components/AccessGuard.jsx";
import Profile from "@/pages/private/Profile.jsx";
import BookRoom from "@/pages/private/Student/BookARoom.jsx";
import StudentIndex from "@/pages/private/Student/StudentIndex.jsx";
import LecturerAppointment from "@/pages/private/Student/LecturerAppointment.jsx";
import RequestMaintenance from "@/pages/private/Student/RquestMaintenance.jsx";
import Schedule from "@/pages/private/Student/Schedule.jsx";

import LecturerIndex from "@/pages/private/Lecturer/LecturerIndex.jsx";
import LecturerRequestMaintenance from "@/pages/private/Lecturer/LecturerRequestMaintenance.jsx";
import LecturerBookARoom from "@/pages/private/Lecturer/LecturerBookARoom.jsx";

import AdminIndex from "@/pages/private/Admin/AdminIndex.jsx";
import ManageUserAndGroups from "@/pages/private/Admin/ManageUserAndGroups.jsx";
import ManageGroup from "@/pages/private/Admin/ManageGroup.jsx";
import ManageLockedUsers from "@/pages/private/Admin/ManageLockedUsers.jsx";
import ManageMaintenance from "@/pages/private/Admin/ManageMaintenance.jsx";


import Unauthorized from "@/pages/Unauthorized.jsx";
import NotFound from "@/pages/NotFound.jsx";
import Home from "@/pages/private/Home.jsx";
import Notification from "@/pages/private/Notification.jsx";
import RegisteredStudents from "@/pages/private/Admin/RegisteredStudents.jsx";
import ScheduledLecturers from "@/pages/private/Admin/ScheduledLecturers.jsx";

export const AppRoutes = (
    <>
        <Route element={<RestrictAuth />}>
            <Route path={constantRoutes.auth.login} element={<Login />} />
            <Route path={constantRoutes.auth.signUp} element={<Register />} />
        </Route>

        <Route element={<Protected />}>
            <Route path={constantRoutes.protected.profile}
                   element={<AccessGuard accessKey={userActions.VIEW_PROFILE}><Profile /></AccessGuard>}
            />
            {/*<Route path={constantRoutes.protected.notification} element={<AccessGuard accessKey={userActions.UPDATE_PROFILE}><Notification /></AccessGuard>} /> */}
            <Route path={constantRoutes.protected.notification} element={<Notification />} />
            <Route path={constantRoutes.protected.index}  element={ <Home /> } />

            {/* Student Pages */}
            <Route path={constantRoutes.protected.student.index} 
                element={<AccessGuard accessKey={userActions.STUDENT_DASHBOARD}> <Outlet /> </AccessGuard>}>
                <Route index element={<StudentIndex />} />
                <Route path={constantRoutes.protected.student.bookRoom} element={<BookRoom />} />
                <Route path={constantRoutes.protected.student.lecturerAppointment} element={<LecturerAppointment />} />
                <Route path={constantRoutes.protected.student.maintenanceRequest} element={<RequestMaintenance />} />
                <Route path={constantRoutes.protected.student.viewSchedule} element={<Schedule /> } />
            </Route>

            {/* Lecturer Pages */}
            <Route path={constantRoutes.protected.lecturer.index} 
                element={<AccessGuard accessKey={userActions.LECTURE_DASHBOARD}> <Outlet /> </AccessGuard>}>
                <Route index element={<LecturerIndex />} />
                <Route path={constantRoutes.protected.lecturer.maintenanceRequest} element={<LecturerRequestMaintenance />} />
                <Route path={constantRoutes.protected.lecturer.bookRoom} element={<LecturerBookARoom />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path={constantRoutes.protected.admin.index}
                element={<AccessGuard accessKey={userActions.ADMIN_DASHBOARD}> <Outlet /> </AccessGuard>}>
                <Route index element={<AdminIndex />} />
                <Route path={constantRoutes.protected.admin.manageUserAndGroups} element={<ManageUserAndGroups />} />
                <Route path={constantRoutes.protected.admin.lockedUsers} element={<ManageLockedUsers />} />
                <Route path={constantRoutes.protected.admin.manageMaintenance} element={<ManageMaintenance/>} />
                <Route path={constantRoutes.protected.admin.registeredStudents} element={<RegisteredStudents/>} />
                <Route path={constantRoutes.protected.admin.scheduledLecturer} element={<ScheduledLecturers/>} />
                <Route path={constantRoutes.protected.admin.viewGroup(':groupId')} element={<ManageGroup />} /> 
            </Route>
        </Route>

        <Route path={constantRoutes.access.unauthorised} element={<Unauthorized/>} />
        <Route path={constantRoutes.access.notFound} element={<NotFound />} />
    </>
)