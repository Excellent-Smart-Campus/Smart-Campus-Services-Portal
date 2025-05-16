import { useState, useEffect, Fragment } from 'react'
import {
    Box,
    Tabs,
    Tab,
    Divider,
    IconButton,
    useMediaQuery,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Collapse
} from '@mui/material';
import { useDialogs } from '@toolpad/core/useDialogs';
import { ButtonToolbar } from 'rsuite';
import { constantRoutes } from '@/utils/constantRoutes.jsx';
import { maintenanceTypes, status } from '@/utils/constants.jsx';
import { mapRoom, statusDescription, formatServerDate } from '@/utils/mapper.jsx';
import { useAdmin } from '@/context/AdminContext.jsx';
import { useService } from '@/context/ServiceContext.jsx';
import { useTheme } from '@mui/material/styles';
import { useAuth } from "@/context/AuthContext.jsx";
import { getErrorMessageFromResponse } from "@/utils/getErrorMessageFromResponse.jsx";
import { Error, Success } from "@/helper/Toasters.jsx";
import { ExpandMore } from '@/helper/ExpandMore.jsx';
import CustomButton from "@/components/CustomButton.jsx";
import CustomContainer from '@/components/CustomContainer.jsx'
import CustomTabPanel from '@/components/CustomTabPanel.jsx';
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Loader from '@/components/Loader.jsx';
import ApiClient from '@/service/ApiClient';

const ManageMaintenance = () => {
    const dialogs = useDialogs();
    const { rooms } = useService();
    const { loading, setLoading, canAccess } = useAuth();
    const { getMaintenance, fetchMaintenance } = useAdmin();
    const [getFocused, setFocused] = useState(null);
    const [getDetails, setDetails] = useState({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [value, setValue] = useState(maintenanceTypes.Open);

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    useEffect(() => {
        const fetchData = async () => {
            if (value === maintenanceTypes.Open) {
                setFocused(null);
                setDetails({});
                await fetchMaintenance(null, [Number(status.Open), Number(status.InProgress)])
            } else if (value === maintenanceTypes.Closed) {
                setFocused(null);
                setDetails({});
                await fetchMaintenance(null, [status.Resolved])
            }
        }
        fetchData()
    }, [value])

    if (loading) {
        return <Loader />
    }

    const handleInProgressWork = async (data) => {
        const confirmed = await dialogs.confirm(
            `Are you sure you want to start working on this maintanance request?`, {
            okText: 'Yes',
            cancelText: 'No',
        });

        if (confirmed) {
            setLoading(true);
            try {
                const response = await ApiClient.instance.updateMaintenance(
                    data.issueId, status.InProgress
                );
                Success(response.message);
            } catch (e) {
                Error(getErrorMessageFromResponse(e));
            } finally {
                setLoading(false);
            }
        }

    }

    const handleCloseIssue = async (data) => {
        const confirmed = await dialogs.confirm(
            `Are you sure you want to close the current in progress maintenance work.?`, {
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
    const renderOpen = () => {
        return isMobile ? (
            <Box display='flex' flexDirection='column' gap={2}>
                {getMaintenance.map((man, index) => (
                    <Card key={index} sx={{ cursor: 'pointer' }}>
                        <CardContent>
                            <Typography variant='h6'>{man.title}</Typography>
                            <Typography variant='body2'>Room Number: {mapRoom(rooms, man.roomId)?.roomNumber}</Typography>
                            <Typography variant='body2'>Room Name: {mapRoom(rooms, man.roomId)?.roomName}</Typography>
                            <Typography variant='body2'>Reported Date: {formatServerDate(man.dateReported)}</Typography>
                            <Box display={'flex'} sx={{ my: '0.5rem' }} justifyContent={'space-between'}>
                                <Box justifyContent={'center'}
                                    sx={{
                                        p: '0.5em',
                                        bgcolor: man.statusId === status.Open
                                            ? 'rgba(255, 165, 0, 0.1)'
                                            : man.statusId === status.InProgress
                                                ? 'rgba(30, 144, 255, 0.1)'
                                                : 'rgba(0, 128, 0, 0.1)',
                                        color: man.statusId === status.Open
                                            ? 'orange'
                                            : man.statusId === status.InProgress
                                                ? 'dodgerblue'
                                                : 'green',
                                        width: '40%',
                                        textAlign: 'center',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {statusDescription[man.statusId]}
                                </Box>
                                <ExpandMore
                                    expand={getFocused === index ? true : false}
                                    onClick={() => {
                                        setDetails(man)
                                        setFocused(getFocused === index ? null : index)
                                    }}
                                    aria-expanded={getFocused === index ? true : false}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </ExpandMore>
                            </Box>
                            <Collapse in={getFocused === index} timeout="auto" unmountOnExit>
                                {getDetails && (
                                    <Box key={`details-collapse`}>
                                        <Divider sx={{ my: '1rem' }} />
                                        <Typography variant="body1"> Description </Typography>
                                        <Typography variant="body2">{getDetails.description}</Typography>
                                        <Divider sx={{ my: '1rem' }} />

                                        <Typography variant="body2">
                                            <ButtonToolbar>
                                                {man.statusId === status.Open && (
                                                    <CustomButton
                                                        handle={() => handleInProgressWork(man)}
                                                        size={'small'}
                                                        label={'Start Work'}
                                                        variant={'contained'}
                                                        color={'primary'}
                                                    />
                                                )}
                                                {man.statusId === status.InProgress && (
                                                    <CustomButton
                                                        handle={() => handleCloseIssue(man)}
                                                        size={'small'}
                                                        label={'Close'}
                                                        variant={'contained'}
                                                        color={'success'}
                                                    />
                                                )}
                                            </ButtonToolbar>
                                        </Typography>

                                    </Box>
                                )}
                            </Collapse>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        ) : (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Issue Title</TableCell>
                        <TableCell>Reported Room Number</TableCell>
                        <TableCell>Reported Room Name</TableCell>
                        <TableCell>Date Reported</TableCell>
                        <TableCell>Maintenance Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getMaintenance.map((man, index) => (
                        <Fragment key={index}>
                            <TableRow key={`lecturer-row-${index}`}
                                sx={{
                                    '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                }}>
                                <TableCell>
                                    <IconButton
                                        aria-label='expand row'
                                        size='small'
                                        onClick={() => {
                                            setDetails(man)
                                            setFocused(getFocused === index ? null : index)
                                        }}
                                    >
                                        {getFocused === index ? (
                                            <KeyboardArrowUpIcon />
                                        ) : (
                                            <KeyboardArrowDownIcon />
                                        )}
                                    </IconButton>
                                </TableCell>
                                <TableCell>{man.title}</TableCell>
                                <TableCell>{mapRoom(rooms, man.roomId)?.roomNumber}</TableCell>
                                <TableCell>{mapRoom(rooms, man.roomId)?.roomName}</TableCell>
                                <TableCell>{formatServerDate(man.dateReported)}</TableCell>
                                <TableCell>
                                    <Box
                                        justifyContent={'center'}
                                        sx={{
                                            p: '0.5em',
                                            bgcolor: man.statusId === status.Open
                                                ? 'rgba(255, 165, 0, 0.1)'
                                                : man.statusId === status.InProgress
                                                    ? 'rgba(30, 144, 255, 0.1)'
                                                    : 'rgba(0, 128, 0, 0.1)',
                                            color: man.statusId === status.Open
                                                ? 'orange'
                                                : man.statusId === status.InProgress
                                                    ? 'dodgerblue'
                                                    : 'green',
                                            width: '100%',
                                            textAlign: 'center',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        {statusDescription[man.statusId]}
                                    </Box>
                                </TableCell>
                            </TableRow>
                            <TableRow key={`student-collapse-${index}`}
                                sx={{
                                    '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                }}>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                    <Collapse in={getFocused === index} timeout="auto" unmountOnExit>
                                        {getDetails && (
                                            <Box sx={{ margin: 1 }}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Details
                                                </Typography>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell colSpan={5}>Description</TableCell>
                                                            <TableCell colSpan={1}>Actions</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody width={'100%'} justifyContent={'space-between'} sx={{
                                                        '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                                    }}>
                                                        <TableCell colSpan={5}>{getDetails.description}</TableCell>
                                                        <TableCell colSpan={1}>
                                                            <ButtonToolbar>
                                                                {man.statusId === status.Open && (
                                                                    <CustomButton
                                                                        handle={() => handleInProgressWork(man)}
                                                                        size={'small'}
                                                                        label={'Start Work'}
                                                                        variant={'contained'}
                                                                        color={'primary'}
                                                                    />
                                                                )}
                                                                {man.statusId === status.InProgress && (
                                                                    <CustomButton
                                                                        handle={() => handleCloseIssue(man)}
                                                                        size={'small'}
                                                                        label={'Close'}
                                                                        variant={'contained'}
                                                                        color={'success'}
                                                                    />
                                                                )}
                                                            </ButtonToolbar>
                                                        </TableCell>
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        )}
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </Fragment>
                    ))}
                </TableBody>
            </Table>
        )
    }

    const renderClosed = () => {
        return isMobile ? (
            <Box display='flex' flexDirection='column' gap={2}>
                {getMaintenance.map((man, index) => (
                    <Card key={index} sx={{ cursor: 'pointer' }}>
                        <CardContent>
                            <Typography variant='h6'>{man.title}</Typography>
                            <Typography variant='body2'>Room Number: {mapRoom(rooms, man.roomId)?.roomNumber}</Typography>
                            <Typography variant='body2'>Room Name: {mapRoom(rooms, man.roomId)?.roomName}</Typography>
                            <Typography variant='body2'>Reported Date: {formatServerDate(man.dateReported)}</Typography>
                            <Box display={'flex'} sx={{ my: '0.5rem' }} justifyContent={'space-between'}>
                                <Box justifyContent={'center'}
                                    sx={{
                                        p: '0.5em',
                                        bgcolor: man.statusId === status.Open
                                            ? 'rgba(255, 165, 0, 0.1)'
                                            : man.statusId === status.InProgress
                                                ? 'rgba(30, 144, 255, 0.1)'
                                                : 'rgba(0, 128, 0, 0.1)',
                                        color: man.statusId === status.Open
                                            ? 'orange'
                                            : man.statusId === status.InProgress
                                                ? 'dodgerblue'
                                                : 'green',
                                        width: '40%',
                                        textAlign: 'center',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {statusDescription[man.statusId]}
                                </Box>
                                <ExpandMore
                                    expand={getFocused === index ? true : false}
                                    onClick={() => {
                                        setDetails(man)
                                        setFocused(getFocused === index ? null : index)
                                    }}
                                    aria-expanded={getFocused === index ? true : false}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </ExpandMore>
                            </Box>
                            <Collapse in={getFocused === index} timeout="auto" unmountOnExit>
                                {getDetails && (
                                    <Box key={`details-collapse`}>
                                        <Divider sx={{ my: '1rem' }} />
                                        <Typography variant="body1"> Description </Typography>
                                        <Typography variant="body2">{getDetails.description}</Typography>
                                        <Divider sx={{ my: '1rem' }} />

                                        <Typography variant="body2">
                                            <ButtonToolbar>
                                                {man.statusId === status.Open && (
                                                    <CustomButton
                                                        handle={() => handleInProgressWork(man)}
                                                        size={'small'}
                                                        label={'Start Work'}
                                                        variant={'contained'}
                                                        color={'primary'}
                                                    />
                                                )}
                                                {man.statusId === status.InProgress && (
                                                    <CustomButton
                                                        handle={() => handleCloseIssue(man)}
                                                        size={'small'}
                                                        label={'Close'}
                                                        variant={'contained'}
                                                        color={'success'}
                                                    />
                                                )}
                                            </ButtonToolbar>
                                        </Typography>

                                    </Box>
                                )}
                            </Collapse>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        ) : (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Issue Title</TableCell>
                        <TableCell>Reported Room Number</TableCell>
                        <TableCell>Reported Room Name</TableCell>
                        <TableCell>Date Reported</TableCell>
                        <TableCell>Date Resolved</TableCell>
                        <TableCell>Maintenance Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getMaintenance.map((man, index) => (
                        <Fragment key={index}>
                            <TableRow key={`lecturer-row-${index}`}
                                sx={{
                                    '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                }}>
                                <TableCell>
                                    <IconButton
                                        aria-label='expand row'
                                        size='small'
                                        onClick={() => {
                                            setDetails(man)
                                            setFocused(getFocused === index ? null : index)
                                        }}
                                    >
                                        {getFocused === index ? (
                                            <KeyboardArrowUpIcon />
                                        ) : (
                                            <KeyboardArrowDownIcon />
                                        )}
                                    </IconButton>
                                </TableCell>
                                <TableCell>{man.title}</TableCell>
                                <TableCell>{mapRoom(rooms, man.roomId)?.roomNumber}</TableCell>
                                <TableCell>{mapRoom(rooms, man.roomId)?.roomName}</TableCell>
                                <TableCell>{formatServerDate(man.dateReported)}</TableCell>
                                <TableCell>{formatServerDate(man.dateResolved)}</TableCell>
                                <TableCell>
                                    <Box
                                        justifyContent={'center'}
                                        sx={{
                                            p: '0.5em',
                                            bgcolor: man.statusId === status.Open
                                                ? 'rgba(255, 165, 0, 0.1)'
                                                : man.statusId === status.InProgress
                                                    ? 'rgba(30, 144, 255, 0.1)'
                                                    : 'rgba(0, 128, 0, 0.1)',
                                            color: man.statusId === status.Open
                                                ? 'orange'
                                                : man.statusId === status.InProgress
                                                    ? 'dodgerblue'
                                                    : 'green',
                                            width: '100%',
                                            textAlign: 'center',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        {statusDescription[man.statusId]}
                                    </Box>
                                </TableCell>
                            </TableRow>
                            <TableRow key={`student-collapse-${index}`}>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                    <Collapse in={getFocused === index} timeout="auto" unmountOnExit>
                                        {getDetails && (
                                            <Box sx={{ margin: 1 }}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Details
                                                </Typography>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow  >
                                                            <TableCell>Description</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody sx={{
                                                        '&:last-child td, &:last-child th': { borderBottom: 'none' }
                                                    }}>
                                                        <TableCell>{getDetails.description}</TableCell>
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        )}
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </Fragment>
                    ))}
                </TableBody>
            </Table>
        )
    }

    const tabData = [
        { label: 'Open', content: renderOpen(), key: maintenanceTypes.Open },
        { label: 'Closed', content: renderClosed(), key: maintenanceTypes.Closed }
    ]

    return (
        <Box>
            <CustomContainer
                breadcrum={
                    <CustomBreadcrumb
                        items={[
                            { label: 'Admin', link: constantRoutes.protected.admin.index },
                            {
                                label: 'Manage-maintenance-groups',
                                link: constantRoutes.protected.admin.manageMaintenance
                            }
                        ]}
                    />
                }
                title={'Manage Maintenances'}
            />

            <CustomContainer
                bgColor={!isMobile}
                children={
                    <Box sx={{ width: '100%' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottom: 1,
                                borderColor: 'divider',
                                width: '100%'
                            }}
                        >
                            <Tabs
                                textColor='secondary'
                                indicatorColor='secondary'
                                value={value}
                                onChange={handleChange}
                                aria-label='dynamic tabs'
                            >
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
                                children={tab?.content}
                            />
                        ))}
                    </Box>
                }
            />
        </Box>
    )
}

export default ManageMaintenance
