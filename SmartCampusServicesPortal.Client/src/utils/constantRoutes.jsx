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
            users: '/admin/users/',
            addUser: '/admin/add-user/',
            editUser: '/admin/edit-user/:id',
        },
        student:{
            bookingRequestSchedule: type =>`/student/booking/${type}`,
        }
    }
}