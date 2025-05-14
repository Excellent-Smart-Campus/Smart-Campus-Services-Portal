import  {useEffect } from 'react';
import { Box, Typography, Grid, Divider, Card, CardContent  } from '@mui/material';
import { ButtonToolbar} from 'rsuite';
import { CustomButton } from "@/components/CustomButton.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { useEducation } from "@/context/EducationContext.jsx";
import { useNavigate } from "react-router-dom";
import { notificationTypeLabels, status} from "@/utils/constants.jsx";
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import {statusDescription} from "@/utils/mapper.jsx";
import { userActions } from "@/utils/authEnums.jsx";
import { formatServerDate } from '@/utils/mapper.jsx';
import { useDialogs } from '@toolpad/core/useDialogs';
import {useAdmin} from "@/context/AdminContext.jsx";
import NotificationCard from "@/components/NotificationCard.jsx";
import CustomCard from "@/components/CustomCard.jsx";
import CustomAccordion from "@/components/CustomAccordion.jsx";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

function StudentIndex(){
    const dialogs = useDialogs();
    const { user, profile, canAccess } = useAuth();
    const { enrolled, notifications } = useEducation()
    const { getMaintenance, fetchMaintenance , setLoading} = useAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                await fetchMaintenance(profile.stakeholder, [Number(status.Open), Number(status.InProgress)])
            }finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [])

    const handleCancel = async (data) => {
        const confirmed = await dialogs.confirm(
            `Are you sure you want to cancel the booking?`, {
            okText: 'Yes',
            cancelText: 'No',
        });

        if (confirmed) {
            setLoading(true);
            try {
                const response = await ApiClient.instance.updateMaintenance(
                    data.issueId, status.Resolved
                );
                Success(response.message);
            } catch (e) {
                Error(getErrorMessageFromResponse(e));
            } finally {
                setLoading(false);
            }
        }
    }
    
    return(
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6"> 👋 Welcome, {user.name} </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }} order={{ xs: 0 }} sx={{ mt: 4 , display: { xs: 'none', sm: 'block' }}}>
                    <ButtonToolbar className="button-toolbar" >
                        <CustomButton 
                            label="Book Room" 
                            variant="contained" 
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.student.bookRoom)}
                        />
                        <CustomButton 
                            label="View Class Schedule" 
                            variant="contained"
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.student.viewSchedule)}
                        />
                        <CustomButton
                            label="Request Maintenance" 
                            variant="contained" 
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.student.maintenanceRequest)}
                        />
                        <CustomButton 
                            label="Schedule Lecturer Appointment" 
                            variant="contained"
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.student.lecturerAppointment)}
                        />
                    </ButtonToolbar>
                </Grid>
                
                <Grid  order={{ xs: 1}} size={{ xs: 12, md: 8 }}>
                    {enrolled.length > 0 ?
                        (
                            enrolled.map((course) => (
                                <CustomAccordion title={`${course.courseCode} - ${course.courseName}`} 
                                    icon={<MenuBookIcon color="secondary" fontSize="small" style={{display: 'flex'}} />} 
                                        expandIconText="View All">
                                    {
                                        Array.isArray(course.subjects) && course.subjects.length > 0 ? (
                                            <Grid container direction="column" spacing={2}>
                                                {course.subjects.map((subject) => (
                                                    <Grid key={subject?.subjectId} >
                                                        <CustomCard
                                                            title={subject?.subjectName}
                                                            description={subject?.subjectCode}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
                                                No subjects enrolled yet.
                                            </Typography>
                                        )
                                    }
                                </CustomAccordion>
                            ))
                        ) :
                        (
                            <Typography variant="body2" color="error" sx={{ px: 2, py: 1 }}>
                                have not enrolled for a course yet. Contact Admin if you need to enroll for a course.
                            </Typography>
                        )
                    }

                    <CustomAccordion title={'My Appointments'} 
                        icon={<InsertInvitationIcon color="secondary" fontSize="small" style={{display: 'flex'}} />} 
                            expandIconText="View All">
     
                    </CustomAccordion>
                    
                    {getMaintenance.length > 0 ? (
                        <CustomAccordion title={'My bookings'} 
                            icon={<BookmarkAddedIcon color="secondary" fontSize="small" style={{display: 'flex'}} />} 
                                expandIconText="View All">
                                <Box gap={2} display={'flex'} flexDirection={'column'} sx={{maxHeight: '600px', overflowY: 'auto'}}  container direction="column" spacing={2}>
                                    {getMaintenance.map((maintenance) => (
                                        <Grid >
                                            <Card elevation={0} >
                                                <CardContent>
                                                    <Typography  variant="body1">{maintenance.title}</Typography>
                                                    <Typography sx={{ whiteSpace: 'pre-line', my:'0.5em' }} variant='body2'>{maintenance.description}</Typography>
                                                    <Typography variant='body2'>Created:  </Typography>
                                                    <Typography variant='body2'>{formatServerDate(maintenance.dateReported)}</Typography>
               
                                                    <Typography variant='body2'>Updated:  </Typography>
                                                    <Typography variant='body2'>{formatServerDate(maintenance.dateResolved)}</Typography>
                                           

                                                    <Box display={'flex'} sx={{ my: '1rem' }} justifyContent={'space-between'}>
                                                        <Box justifyContent={'center'}
                                                            sx={{
                                                                p: '0.5em',
                                                                bgcolor: maintenance.statusId === status.Open
                                                                    ? 'rgba(255, 165, 0, 0.1)'
                                                                    : maintenance.statusId=== status.InProgress
                                                                        ? 'rgba(30, 144, 255, 0.1)'
                                                                        : 'rgba(0, 128, 0, 0.1)',
                                                                color: maintenance.statusId === status.Open
                                                                    ? 'orange'
                                                                    :maintenance.statusId === status.InProgress
                                                                        ? 'dodgerblue'
                                                                        : 'green',
                                                                width: '50%',
                                                                textAlign: 'center',
                                                                borderRadius: '4px',
                                                            }}
                                                        >
                                                            {statusDescription[maintenance.statusId]}
                                                        </Box>
                                                    </Box>
                                                    <ButtonToolbar>
                                                        {maintenance.statusId === status.Open && (
                                                            <CustomButton
                                                                handle={() => handleCancel(maintenance)}
                                                                size={'small'}
                                                                label={'Cancel Booking'}
                                                                variant={'contained'}
                                                                color={'secondary'}
                                                            />
                                                        )}
                                                    </ButtonToolbar>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Box>
                        </CustomAccordion>
                    ) :(
                        <Typography variant="body2" color="error" sx={{ px: 2, py: 1 }}>
                                have not enrolled for a course yet. Contact Admin if you need to enroll for a course.
                            </Typography>
                    )}
                </Grid>
                
                <Grid  order={{ xs: 2 }} size={{ xs: 12, md: 4 }}>
                    <CustomAccordion title={'Notifications'} expandIconText="Expand All"
                        icon={<NotificationsIcon color="secondary" fontSize="small" style={{display: 'flex'}} />} >
                        {notifications.length > 0 ? 
                            (
                                <Box sx={{bgcolor: 'white', maxHeight: '600px', overflowY: 'auto'}} container direction="column">
                                    {notifications.map((notification) => (
                                        <Grid sx={{ m:'0.6em'}}>
                                            <NotificationCard
                                                title={notificationTypeLabels[notification.notificationTypeId]}
                                                subtitle={notification.subject}
                                                message={notification.message}
                                                createdDate={formatServerDate(notification.dateCreated)}
                                            />
                                            <Divider />
                                        </Grid>
                                    ))}
                                </Box>
                            ):(
                                <Typography variant="body2" color="error" sx={{ px: 2, py: 1 }}>
                                    No notifications 
                                </Typography>
                            )
                        }
                    </CustomAccordion>
                </Grid>
            </Grid>
        </Box>
    );
}

export default StudentIndex;