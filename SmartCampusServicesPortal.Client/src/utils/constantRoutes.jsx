import { bookingActionEnum } from '@/utils/bookingActionEnum.jsx';

export const constantRoutes = {
    auth: {
        login: '/auth/login/',
        signUp: '/auth/sign-up/',
    },
    access: {
        unauthorised: '/unauthorised/',
        notFound: '/*',
    },
    protected: {
        index: '/',
        profile: '/profile/',
        notification: '/notification/',
        admin: {
            index: '/admin/',
            manageUserAndGroups: '/admin/manage-users-and-groups/',
            lockedUsers: '/admin/locked-users/',
            scheduledLecturer: '/admin/scheduled-lecturers/',
            registeredStudents: '/admin/registered-students/',
            manageMaintenance: '/admin/manage-maintenance/',
            viewGroup: groupId => `/admin/view-group/${groupId}/`,
        },
        student:{
            index: '/student/',
            maintenanceRequest:'booking/maintenance-request/',
            bookRoom: 'book-room/',
            lecturerAppointment: 'lecturer-appointment/',
            viewSchedule: 'view-schedule/'
        },
        lecturer:{
            index: '/lecture/',
            maintenanceRequest:'booking/maintenance-request',
            bookRoom: 'book-room/',
            manageAppointents: 'manage-appointments/',
        }
    }
}