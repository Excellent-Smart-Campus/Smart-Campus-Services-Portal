import { useEffect } from 'react';
import { Box, Typography, Grid, Divider, Card, CardContent } from '@mui/material';
import { ButtonToolbar } from 'rsuite';
import { CustomButton } from "@/components/CustomButton.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { useEducation } from "@/context/EducationContext.jsx";
import { useNavigate } from "react-router-dom";
import { notificationTypeLabels, status } from "@/utils/constants.jsx";
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { statusDescription } from "@/utils/mapper.jsx";
import { userActions } from "@/utils/authEnums.jsx";
import { getErrorMessageFromResponse } from "@/utils/getErrorMessageFromResponse.jsx";
import { formatServerDate, formatServerTime, formatServerDateOnly } from '@/utils/mapper.jsx';
import { useDialogs } from '@toolpad/core/useDialogs';
import { useAdmin } from "@/context/AdminContext.jsx";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import NotificationCard from "@/components/NotificationCard.jsx";
import CustomCard from "@/components/CustomCard.jsx";
import CustomAccordion from "@/components/CustomAccordion.jsx";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {Error, Success} from "@/helper/Toasters.jsx";


function LecturerIndex() {
    const { user, profile, canAccess } = useAuth();
    const { enrolled, notifications } = useEducation()
    const { getMaintenance, fetchMaintenance, fetchBookings, setLoading } = useAdmin();
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            await fetchMaintenance(profile.stakeholder, [Number(status.Open), Number(status.InProgress)])
            await fetchBookings();
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        
        fetchData()
    }, [])
    
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6"> 👋 Welcome, {user.name} </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }} order={{ xs: 0 }} sx={{ mt: 4, display: { xs: 'none', sm: 'block' } }}>
                    <ButtonToolbar className="button-toolbar" >
                        <CustomButton
                            label="Book Room"
                            variant="contained"
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.lecturer.bookRoom)}
                        />
                        <CustomButton
                            label="View Class Schedule"
                            variant="contained"
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.viewSchedule)}
                        />
                        <CustomButton
                            label="Request Maintenance"
                            variant="contained"
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.lecturer.maintenanceRequest)}
                        />
                        <CustomButton
                            label="Manage Bookings"
                            variant="contained"
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.lecturer.manageBookings)}
                        />
                    </ButtonToolbar>
                </Grid>

                <Grid order={{ xs: 1 }} size={{ xs: 12, md: 8 }}>
                    {enrolled.length > 0 ?
                        (
                            enrolled.map((course, index) => (
                                <CustomAccordion key={index} title={`${course.courseCode} - ${course.courseName}`}
                                    icon={<MenuBookIcon color="secondary" fontSize="small" style={{ display: 'flex' }} />}
                                    expandIconText="View All">
                                    {
                                        Array.isArray(course.subjects) && course.subjects.length > 0 ? (
                                            <Grid container direction="column" spacing={2}>
                                                {course.subjects.map((subject) => (
                                                    <Grid key={subject?.subjectId}>
                                                        <CustomCard
                                                            title={subject?.subjectName}
                                                            description={subject?.subjectCode}
                                                            onClick={() => handleSubjectView(subject)}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>
                                                You have not been assigned any modules yet.
                                            </Typography>
                                        )
                                    }
                                </CustomAccordion>
                            ))
                        ) :
                        (
                            <Card elevation={0} >
                                <CardContent>
                                    <Typography variant="body2" sx={{ px: 2, py: 1 }}>
                                        No assigned course or subject found.
                                        This lecturer has not yet been assigned any subjects to manage.
                                    </Typography>
                                </CardContent>
                            </Card>
                        )
                    }

                    {getMaintenance.length > 0 && (
                        <CustomAccordion title={'My maintenance progress'}
                            icon={<BookmarkAddedIcon color="secondary" fontSize="small" style={{ display: 'flex' }} />}
                            expandIconText="View All">
                            <Box gap={2} display={'flex'} flexDirection={'column'} sx={{ maxHeight: '600px', overflowY: 'auto' }} direction="column" spacing={2}>
                                {getMaintenance.map((maintenance, index) => (
                                    <Grid key={index}>
                                        <Card elevation={0} >
                                            <CardContent>
                                                <Typography variant="body1">{maintenance.title}</Typography>
                                                <Typography sx={{ whiteSpace: 'pre-line', my: '0.5em' }} variant='body2'>{maintenance.description}</Typography>
                                                <Typography variant='body2'>Created:  </Typography>
                                                <Typography variant='body2'>{formatServerDate(maintenance.dateReported)}</Typography>

                                                {maintenance.dateResolved != null && (<>
                                                    <Typography variant='body2'>Updated:  </Typography>
                                                    <Typography variant='body2'>{formatServerDate(maintenance.dateResolved)}</Typography>
                                                </>)}

                                                <Box display={'flex'} sx={{ my: '1rem' }} justifyContent={'space-between'}>
                                                    <Box justifyContent={'center'}
                                                        sx={{
                                                            p: '0.5em',
                                                            bgcolor: maintenance.statusId === status.Open
                                                                ? 'rgba(255, 165, 0, 0.1)'
                                                                : maintenance.statusId === status.InProgress
                                                                    ? 'rgba(30, 144, 255, 0.1)'
                                                                    : 'rgba(0, 128, 0, 0.1)',
                                                            color: maintenance.statusId === status.Open
                                                                ? 'orange'
                                                                : maintenance.statusId === status.InProgress
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
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Box>
                        </CustomAccordion>
                    )}
                </Grid>

                <Grid order={{ xs: 2 }} size={{ xs: 12, md: 4 }}>
                    {notifications.length > 0 &&
                        (
                            <CustomAccordion title={'Notifications'} expandIconText="Expand All"
                                icon={<NotificationsIcon color="secondary" fontSize="small" style={{ display: 'flex' }} />} >

                                <Box sx={{ bgcolor: 'white', maxHeight: '600px', overflowY: 'auto' }} direction="column">
                                    {notifications.map((notification, index) => (
                                        <Grid  key={index} sx={{ m: '0.6em' }}>
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
                            </CustomAccordion>
                        )
                    }

                    <CustomAccordion title={'Calender'} expandIconText="Expand All"
                        icon={<CalendarMonthIcon color="secondary" fontSize="small" style={{ display: 'flex' }} />} >
                        <Box bgcolor={'white'} className="no-calendar-header">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar />
                            </LocalizationProvider>
                        </Box>
                    </CustomAccordion>
                </Grid>
            </Grid>
        </Box>
    );
}

export default LecturerIndex;