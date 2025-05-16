import { useEffect } from 'react';
import { Box, Typography, Grid, Divider, Card, CardContent } from '@mui/material';
import { useEducation } from "@/context/EducationContext.jsx";
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { userActions } from "@/utils/authEnums.jsx";
import { formatServerDate } from '@/utils/mapper.jsx';
import { notificationTypeLabels } from "@/utils/constants.jsx";
import { useAuth } from "@/context/AuthContext";
import NotificationCard from "@/components/NotificationCard.jsx";
import AccessGuard from "@/components/AccessGuard.jsx";
import CustomContainer from "@/components/CustomContainer.jsx";
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import ApiClient from '@/service/ApiClient';

function Notification() {
    const { notifications } = useEducation()
    const { setLoading} = useAuth();

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                await ApiClient.instance.markNotificationsRead();
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [])

    return (
        <AccessGuard accessKey={userActions.VIEW_NOTIFICATIONS}>
            <CustomContainer
                breadcrum={
                    <CustomBreadcrumb
                        items={[
                            { label: 'Home', link: constantRoutes.protected.index },
                            { label: 'Notifications', link: constantRoutes.protected.lecturer.manageBookings},
                        ]}
                    />
                }
                title={'Manage Notifications'}
            />
            <CustomContainer
                children={
                    <Box sx={{ width: '100%'}}>
                        {notifications.length > 0 ?
                            notifications.map((notification, index) => (
                                <Grid key={index} sx={{ m: '0.6em' }}>
                                    <NotificationCard
                                        title={notificationTypeLabels[notification.notificationTypeId]}
                                        subtitle={notification.subject}
                                        message={notification.message}
                                        createdDate={formatServerDate(notification.dateCreated)}
                                    />
                                    <Divider />
                                </Grid>
                            )):
                            (
                                <Card elevation={0} >
                                    <CardContent>
                                        <Typography>No Notifications available</Typography>
                                    </CardContent>
                                </Card>
                            )
                        }
                    </Box>
                }
            />
        </AccessGuard>
    )
}

export default Notification