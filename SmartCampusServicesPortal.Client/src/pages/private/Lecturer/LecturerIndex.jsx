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
import ApiClient from '@/service/ApiClient';

function LecturerIndex() {
    const { user, canAccess } = useAuth();
    const { enrolled, notifications } = useEducation()
    const { getMaintenance, fetchMaintenance, fetchBookings, getBookings, setLoading } = useAdmin();
    const navigate = useNavigate();

    const handleSubjectView = async (subject) => {
        if (!canAccess(userActions.STUDENT_ENROLLMENT_SUBJECT)) {
            navigate(constantRoutes.access.unauthorised);
        }
        navigate(constantRoutes.protected.student.subject, {
            state: { subject },
        });
    };

    console.log(enrolled)

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
                        />
                        <CustomButton
                            label="Request Maintenance"
                            variant="contained"
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.lecturer.maintenanceRequest)}
                        />
                        <CustomButton
                            label="Manage Appointments"
                            variant="contained"
                            color="primary"
                            handle={() => navigate(constantRoutes.protected.lecturer.manageAppointents)}
                        />
                    </ButtonToolbar>
                </Grid>

                <Grid item order={{ xs: 1 }} size={{ xs: 12, md: 8 }}>
                    {enrolled.length > 0 ?
                        (
                            enrolled.map((course) => (
                                <CustomAccordion title={`${course.courseCode} - ${course.courseName}`}
                                    icon={<MenuBookIcon color="secondary" fontSize="small" style={{ display: 'flex' }} />}
                                    expandIconText="View All">
                                    {
                                        Array.isArray(course.subjects) && course.subjects.length > 0 ? (
                                            <Grid container direction="column" spacing={2}>
                                                {course.subjects.map((subject) => (
                                                    <Grid key={subject?.subjectId} item>
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
                    {getBookings.length > 0 && (
                        <CustomAccordion title={'My Bookings Appointments'}
                            icon={<InsertInvitationIcon color="secondary" fontSize="small" style={{ display: 'flex' }} />}
                            expandIconText="View All">
                            <Box gap={2} display={'flex'} flexDirection={'column'} sx={{ maxHeight: '600px', overflowY: 'auto' }} container direction="column" spacing={2}>
                                {getBookings.map((booking) => (
                                    <Grid >
                                        <Card elevation={0} >
                                            <CardContent>
                                                <Typography variant="body1">{booking.lecturerId ? 'Appointment Request' : 'Room Booking Request'}</Typography>
                                                <Typography sx={{ whiteSpace: 'pre-line', my: '0.5em' }} variant='body2'>{booking.purpose}</Typography>
                                                <Typography variant='body2'>Created:  </Typography>
                                                <Typography variant='body2'>{formatServerDateOnly(booking.bookingDate)}</Typography>
                                                <Box>
                                                    {booking.startTime != null && (
                                                        <>
                                                            <Typography variant='body2'>Start Time: {formatServerTime(booking.startTime)}</Typography>
                                                            <Typography variant='body2'>End Time: {formatServerTime(booking.endTime)}</Typography>
                                                        </>
                                                    )}
                                                </Box>

                                                <Box display={'flex'} sx={{ my: '1rem' }} justifyContent={'space-between'}>
                                                    <Box justifyContent={'center'}
                                                        sx={{
                                                            p: '0.5em',
                                                            bgcolor: booking.statusId === status.Pending
                                                                ? 'rgba(255, 165, 0, 0.1)'
                                                                : booking.statusId === status.Approved
                                                                    ? 'rgba(30, 144, 255, 0.1)'
                                                                    : 'rgba(0, 128, 0, 0.1)',
                                                            color: booking.statusId === status.Pending
                                                                ? 'orange'
                                                                : booking.statusId === status.Approved
                                                                    ? 'dodgerblue'
                                                                    : 'green',
                                                            width: '50%',
                                                            textAlign: 'center',
                                                            borderRadius: '4px',
                                                        }}
                                                    >
                                                        {statusDescription[booking.statusId]}
                                                    </Box>
                                                </Box>
                                                <ButtonToolbar>
                                                    {booking.statusId === status.Pending && (
                                                        <CustomButton
                                                            handle={() => handleCancel(booking)}
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
                    )}

                    {getMaintenance.length > 0 && (
                        <CustomAccordion title={'My maintenance progress'}
                            icon={<BookmarkAddedIcon color="secondary" fontSize="small" style={{ display: 'flex' }} />}
                            expandIconText="View All">
                            <Box gap={2} display={'flex'} flexDirection={'column'} sx={{ maxHeight: '600px', overflowY: 'auto' }} container direction="column" spacing={2}>
                                {getMaintenance.map((maintenance) => (
                                    <Grid >
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

                                <Box sx={{ bgcolor: 'white', maxHeight: '600px', overflowY: 'auto' }} container direction="column">
                                    {notifications.map((notification) => (
                                        <Grid sx={{ m: '0.6em' }}>
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