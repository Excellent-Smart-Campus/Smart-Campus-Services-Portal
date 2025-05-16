import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { userActions } from "@/utils/authEnums";
import { Box, useMediaQuery, Tabs, Tab, Grid, Divider, Card, CardContent, Typography, } from '@mui/material';
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { ButtonToolbar } from 'rsuite';
import { Error, Success } from "@/helper/Toasters.jsx";
import { getErrorMessageFromResponse } from "@/utils/getErrorMessageFromResponse.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { status, appointmentsAndBookingsType} from "@/utils/constants.jsx";
import { useTheme } from '@mui/material/styles';
import { useAdmin } from "@/context/AdminContext.jsx";
import { statusDescription, formatServerTime, formatServerDateOnly} from "@/utils/mapper.jsx";
import { useDialogs } from '@toolpad/core/useDialogs';
import { useEducation } from "@/context/EducationContext.jsx";
import AccessGuard from "@/components/AccessGuard.jsx";
import CustomContainer from "@/components/CustomContainer.jsx";
import CustomButton from "@/components/CustomButton.jsx";
import CustomTabPanel from "@/components/CustomTabPanel.jsx";
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import ApiClient from '@/service/ApiClient';

const ManageLecturerBookings = () => {
    const dialogs = useDialogs();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { profile } = useAuth();
    const { getNotifications } = useEducation()
    const { fetchBookings, fetchMaintenance, getBookings, setLoading } = useAdmin();
    const [value, setValue] = useState(appointmentsAndBookingsType.Bookings);
    const [filteredData, setFilteredData] = useState([]);
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                await fetchBookings();
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        
        let filtered = [];
        const fetchData = async () => {
            if (value === appointmentsAndBookingsType.Appointments) {
                filtered = getBookings.filter(item => item.lecturerId !== null);
            } else if (value === appointmentsAndBookingsType.Bookings) {
                filtered = getBookings.filter(item => item.roomId !== null);
            }
            setFilteredData(filtered);
        };

        fetchData();
    }, [value, getBookings]);
    
    const fetchData = async () => {
        try {
            await fetchMaintenance(profile.stakeholder, [Number(status.Open), Number(status.InProgress)])
            await fetchBookings();
            await getNotifications();
        } finally {
            setLoading(false);
        }
    }

    const approveAppointment = async (data) => {
        const confirmed = await dialogs.confirm(
            `Are you sure you want to confirm appointment?`, {
                okText: 'Yes',
                cancelText: 'No',
            });

        if (confirmed) {
            setLoading(true);
            try {
                const response = await ApiClient.instance.confirmBooking(data.bookingId);
                Success(response.message);
                await fetchData();
                navigate(constantRoutes.protected.lecturer.index);
            } catch (e) {
                Error(getErrorMessageFromResponse(e));
            } finally {
                setLoading(false);
            }
        }
    }

    const handleCancel = async (data) => {
        const confirmed = await dialogs.confirm(
            `Are you sure you want to reject appointment?`, {
                okText: 'Yes',
                cancelText: 'No',
            });

        if (confirmed) {
            setLoading(true);

            try {
                const response = await ApiClient.instance.cancelBooking(data.bookingId);
                Success(response.message);
                await fetchData();
                navigate(constantRoutes.protected.lecturer.index);
            } catch (e) {
                Error(getErrorMessageFromResponse(e));
            } finally {
                setLoading(false);
            }
        }
    }
    
    const renderBookings = () =>{
        return (
            <Box gap={2} display={'flex'} flexDirection={'column'} sx={{ maxHeight: '600px', overflowY: 'auto' }} direction="column" spacing={2}>
                {filteredData.length > 0 ? (
                    filteredData.map((booking, index) => (
                        <Grid key={index}>
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
                            <Divider />
                        </Grid>
                    ))
                    ):(
                        <Card elevation={0} >
                            <CardContent>
                                <Typography>No Bookings available</Typography>
                            </CardContent>
                        </Card>
                    )
                }
            </Box>
        );
    }
    
    const renderAppointments = () =>{
        return (
            <Box gap={2} display={'flex'} flexDirection={'column'} sx={{ maxHeight: '600px', overflowY: 'auto' }} direction="column" spacing={2}>
                {filteredData.length > 0 ? (
                    filteredData.map((booking, index) => (
                            <Grid key={index}>
                                <Card elevation={0} >
                                    <CardContent>
                                        <Typography variant="body1">{booking.lecturerId ? 'Appointment Request' : 'Room Booking Request'}</Typography>
                                        <Typography sx={{ whiteSpace: 'pre-line', my: '0.5em' }} variant='body2'>{booking.purpose}</Typography>
                                        <Typography variant='body2'>Booking Date: {formatServerDateOnly(booking.bookingDate)}</Typography>
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
                                                <AccessGuard accessKey={userActions.REJECT_BOOKING}>
                                                    <CustomButton
                                                        handle={() => handleCancel(booking)}
                                                        size={'small'}
                                                        label={'Reject'}
                                                        variant={'contained'}
                                                        color={'error'}
                                                    />
                                                </AccessGuard>
                                            )}

                                            {booking.statusId === status.Pending && (
                                                <AccessGuard accessKey={userActions.APPROVE_BOOKING}>
                                                    <CustomButton
                                                        handle={() => approveAppointment(booking)}
                                                        size={'small'}
                                                        label={'Accept'}
                                                        variant={'contained'}
                                                        color={'secondary'}
                                                    />
                                                </AccessGuard>
                                            )} 
                                        </ButtonToolbar>
                                    </CardContent>
                                </Card>
                                <Divider />
                            </Grid>
                        ))
                    ):(
                        <Card elevation={0} >
                            <CardContent>
                                <Typography>No Appointments available</Typography>
                            </CardContent>
                        </Card>
                    )
                }
            </Box>
        );
    }
    
    const tabData = [
        { label: 'Manage Room Bookings', content: renderBookings(), key: appointmentsAndBookingsType.Bookings },
        { label: 'Manage Appointments', content: renderAppointments(), key: appointmentsAndBookingsType.Appointments }
    ];
    
    return (
        <AccessGuard accessKey={userActions.VIEW_MY_BOOKINGS}>
            <CustomContainer
                breadcrum={
                    <CustomBreadcrumb
                        items={[
                            { label: 'Lecturer', link: constantRoutes.protected.index },
                            { label: 'Manage Bookings', link: constantRoutes.protected.lecturer.manageBookings},
                        ]}
                    />
                }
                title={'Manage Bookings'}
            />

            <CustomContainer
                bgColor={!isMobile}
                children={
                    <Box sx={{ width: '100%'}}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: 1,
                            borderColor: 'divider',
                            width: '100%'
                        }}>
                            <Tabs textColor="secondary"
                                  indicatorColor="secondary"
                                  value={value}
                                  onChange={handleChange}
                                  aria-label="dynamic tabs">
                                {tabData.map((tab, index) => (
                                    <Tab
                                        key={index}
                                        label={tab.label}
                                        value={index}
                                        id={`tab-${index}`}
                                        aria-controls={`tabpanel-${index}`}
                                    />
                                ))}
                            </Tabs>

                        </Box>
                        {tabData.map((tab, index) => (
                            <CustomTabPanel
                                key={index}
                                value={value}
                                index={index}
                                py={1}
                                children={tab?.content}
                            />
                            
                        ))}
                    </Box>
                }
            />
        </AccessGuard>
    );

}
export default ManageLecturerBookings;