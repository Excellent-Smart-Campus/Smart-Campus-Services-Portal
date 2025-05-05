import { useParams, useNavigate } from "react-router-dom";
import { userActions } from "@/utils/authEnums"; // Assuming this holds your user permissions
import AccessGuard from "@/components/AccessGuard.jsx"; // Access control wrapper
import { Box } from '@mui/material';
import { bookingActionEnum } from "@/utils/bookingActionEnum.jsx";
import {constantRoutes} from "@/utils/constantRoutes.jsx";

const BookingRequestSchedule = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    const getPageContent = () => {
        switch (type) {
            case bookingActionEnum.BOOKING:
                return (
                    <AccessGuard requiredPermission={userActions.BOOK_ROOM}>
                        <div>Booking Page Content</div> 
                    </AccessGuard>
                );
            case bookingActionEnum.REQUEST:
                return (
                    <AccessGuard requiredPermission={userActions.REPORT_MAINTENANCE_ISSUE}>
                        <div>Request Page Content</div>
                    </AccessGuard>
                );
            case bookingActionEnum.SCHEDULE:
                return (
                    <AccessGuard requiredPermission={userActions.SCHEDULE_LECTURER_APPOINTMENT}>
                        <div>Schedule Page Content</div>
                    </AccessGuard>
                );
            default:
                return navigate(constantRoutes.access.notFound);
        }
    };

    return <Box>{getPageContent()}</Box>;
};

export default BookingRequestSchedule;
