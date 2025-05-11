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
            manageMaintenance: '/admin/manage-maintenance/',
            viewGroup: groupId => `/admin/view-group/${groupId}/`,
            viewUser: userId => `/admin/view-user/${userId}/`,
        },
        student:{
            index: '/student/',
            maintenanceRequest:'booking/maintenance-request/',
            bookRoom: 'book-room/',
            lecturerAppointment: 'lecturer-appointment/',
        },
        lecturer:{
            index: '/lecture/',
            maintenanceRequest:'booking/maintenance-request',
            bookRoom: 'book-room/',
            manageAppointents: 'manage-appointments/',
        }
    }
}