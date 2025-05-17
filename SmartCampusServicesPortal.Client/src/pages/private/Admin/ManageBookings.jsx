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
import CustomButton from "@/components/CustomButton.jsx";
import CustomContainer from '@/components/CustomContainer.jsx'
import CustomTabPanel from '@/components/CustomTabPanel.jsx';
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import ApiClient from '@/service/ApiClient';

const ManageBookings = () => {
    const dialogs = useDialogs();
    const { setLoading, canAccess } = useAuth();
    const { fetchAdminRoomBookings, adminBookings} = useAdmin();
    const [value, setValue] = useState(appointmentsAndBookingsType.Bookings);
    const [filteredData, setFilteredData] = useState([]);
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const fetchData = async () => {
        await fetchAdminRoomBookings();
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        let filtered = [];
        const fetchData = async () => {
            if (value === appointmentsAndBookingsType.Bookings) {
                filtered = adminBookings.filter(item => item.statusId === status.Pending);
            } else if (value === appointmentsAndBookingsType.Appointments) {
                filtered = adminBookings.filter(item => item.statusId === status.Approved);
            }
            setFilteredData(filtered);
        };

        fetchData();
    }, [value, adminBookings]);


    const approveBooking = async (data) => {
        const confirmed = await dialogs.confirm(
            `Are you sure you want to approve room booking?`, {
                okText: 'Yes',
                cancelText: 'No',
            });

        if (confirmed) {
            setLoading(true);
            try {
                const response = await ApiClient.instance.confirmBooking(data.bookingId);
                Success(response.message);
                await fetchData();
            } catch (e) {
                Error(getErrorMessageFromResponse(e));
            } finally {
                setLoading(false);
            }
        }
    }

    const handleCancel = async (data) => {
        const confirmed = await dialogs.confirm(
            `Are you sure you want to reject room booking?`, {
                okText: 'Yes',
                cancelText: 'No',
            });

        if (confirmed) {
            setLoading(true);

            try {
                const response = await ApiClient.instance.cancelBooking(data.bookingId);
                Success(response.message);
                await fetchData();
            } catch (e) {
                Error(getErrorMessageFromResponse(e));
            } finally {
                setLoading(false);
            }
        }
    }

    const renderPending = () => {
       return (
            <Box gap={2} display={'flex'} flexDirection={'column'} sx={{ maxHeight: '600px', overflowY: 'auto' }} direction="column" spacing={2}>
                {filteredData.length > 0 ? (
                    filteredData.map((booking, index) => (
                        <Grid key={index}>
                            <Card elevation={0} >
                                <CardContent>
                                    <Typography variant="body1">{'Room Booking Request'}</Typography>
                                    <Typography sx={{ whiteSpace: 'pre-line', my: '0.5em' }} variant='body2'>{booking.purpose}</Typography>
                                    <Box sx={{display: 'flex', gap: '2rem'}}>
                                        <Typography variant='body2'>Room <br/> Number</Typography>
                                        <Typography variant='body2'>Room <br/> Name </Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', gap: '3rem', my:'0.5em'}}>
                                        <Typography variant='body2'>{booking.room.roomNumber} </Typography>
                                        <Typography variant='body2'>{booking.room.roomName}</Typography>
                                    </Box>
                                   <Typography variant='body2'>Booked Date: {formatServerDateOnly(booking.bookingDate)}</Typography>
                                    <Box>
                                        {booking.startTime != null && (
                                            <>
                                                <Typography variant='body2'>Start Time: {formatServerTime(booking.startTime)}</Typography>
                                                <Typography variant='body2'>End Time: {formatServerTime(booking.endTime)}</Typography>
                                            </>
                                        )}
                                    </Box>

                                    <Typography variant='body2' mt={'0.5em'}>Created Date: {formatServerDateOnly(booking.dateCreated)}</Typography>
                                
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
                                                label={'Reject Booking'}
                                                variant={'contained'}
                                                color={'error'}
                                            />
                                        )}
                                        {booking.statusId === status.Pending && (
                                            <CustomButton
                                                handle={() => approveBooking(booking)}
                                                label={'Apporve Booking'}
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

    console.log(adminBookings);

    const renderApproved = () =>{
        return (
            <Box gap={2} display={'flex'} flexDirection={'column'} sx={{ maxHeight: '600px', overflowY: 'auto' }} direction="column" spacing={2}>
                {filteredData.length > 0 ? (
                    filteredData.map((booking, index) => (
                        <Grid key={index}>
                            <Card elevation={0} >
                                <CardContent>
                                    <Typography variant="body1">{'Room Booking Request'}</Typography>
                                    <Typography sx={{ whiteSpace: 'pre-line', my: '0.5em' }} variant='body2'>{booking.purpose}</Typography>
                                    <Box sx={{display: 'flex', gap: '2rem'}}>
                                        <Typography variant='body2'>Room <br/> Number</Typography>
                                        <Typography variant='body2'>Room <br/> Name </Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', gap: '3rem', my:'0.5em'}}>
                                        <Typography variant='body2'>{booking.room.roomNumber} </Typography>
                                        <Typography variant='body2'>{booking.room.roomName}</Typography>
                                    </Box>

                                    <Typography variant='body2'>Booked Date: {formatServerDateOnly(booking.bookingDate)}</Typography>
                                    <Box>
                                        {booking.startTime != null && (
                                            <>
                                                <Typography variant='body2'>Start Time: {formatServerTime(booking.startTime)}</Typography>
                                                <Typography variant='body2'>End Time: {formatServerTime(booking.endTime)}</Typography>
                                            </>
                                        )}
                                    </Box>

                                    <Typography variant='body2' mt={'0.5em'}>Created Date: {formatServerDateOnly(booking.dateCreated)}</Typography>
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

    const tabData = [
        { label: 'New requests', content: renderPending(), key: appointmentsAndBookingsType.Bookings },
        { label: 'Approved', content: renderApproved(), key: appointmentsAndBookingsType.Appointments }
    ]

    return (
        <Box>
            <CustomContainer
                breadcrum={
                    <CustomBreadcrumb
                        items={[
                            { label: 'Admin', link: constantRoutes.protected.admin.index },
                            {
                                label: 'Manage-Bookings',
                                link: constantRoutes.protected.admin.manageBookings
                            }
                        ]}
                    />
                }
                title={'Manage Bookings'}
            />

            <CustomContainer
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
        </Box>
    )
}

export default ManageBookings
