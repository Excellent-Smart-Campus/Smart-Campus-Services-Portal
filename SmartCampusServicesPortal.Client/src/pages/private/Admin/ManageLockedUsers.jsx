import { useEffect } from 'react';
import { Box, useMediaQuery, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { userActions } from "@/utils/authEnums.jsx";
import { ButtonToolbar } from 'rsuite';
import { useAdmin } from "@/context/AdminContext.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { useTheme } from '@mui/material/styles';
import { Error, Success } from "@/helper/Toasters.jsx";
import { useDialogs } from '@toolpad/core/useDialogs';
import { getErrorMessageFromResponse } from "@/utils/getErrorMessageFromResponse.jsx";
import CustomContainer from "@/components/CustomContainer.jsx";
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import CustomButton from "@/components/CustomButton.jsx";
import ApiClient from '@/service/ApiClient';
import Loader from "@/components/Loader.jsx";

const ManageLockedUsers = () => {
    const dialogs = useDialogs();
    const { loading, setLoading, canAccess } = useAuth();
    const { fetchAllUsers, getAllUsers } = useAdmin();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchData = async () => {
            await fetchAllUsers();
        };
        fetchData();
    }, []);

    const handleClick = async (stakeholderId, isLocked) => {
        const confirmed = await dialogs.confirm(
            `Are you sure you want to ${!isLocked ? 'lock' : 'unlock'} user?`, {
            okText: 'Yes',
            cancelText: 'No',
        });

        if (confirmed) {
            setLoading(true);
            try {
                const response = await ApiClient.instance.lockUser(
                    stakeholderId, !isLocked
                );
                Success(response.message);
            } catch (e) {
                Error(getErrorMessageFromResponse(e));
            } finally {
                setLoading(false);
            }
        }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <Box>
            <CustomContainer
                breadcrum={
                    <CustomBreadcrumb
                        items={[
                            { label: 'Admin', link: constantRoutes.protected.admin.index },
                            { label: 'Manage-users-groups', link: constantRoutes.protected.admin.manageUserAndGroups },
                        ]}
                    />
                }
                title={'Manage Locked Users'}
            />

            <CustomContainer
                bgColor={!isMobile}
                children={
                    <Box sx={{ width: '100%' }}>
                        {isMobile ? (
                            <Box display="flex" flexDirection="column" gap={2}>
                                {getAllUsers.map((user, index) => (
                                    <Card key={index} sx={{ cursor: 'pointer' }}>
                                        <CardContent>
                                            <Typography variant="h6">{user.displayName}</Typography>
                                            <Typography variant="body2">Email: {user.username}</Typography>
                                            <Typography variant="body2">Role: {user.groups}</Typography>
                                            <Typography variant="body2" sx={{ mt: '1em' }}>
                                                <Box
                                                    justifyContent={'center'}
                                                    sx={{
                                                        p: '0.5em',
                                                        bgcolor: user.isLocked ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 128, 0, 0.1)',
                                                        color: user.isLocked ? 'red' : 'green',
                                                        width: '40%',
                                                        textAlign: 'center',
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    {user.isLocked ? 'Locked' : 'Active'}
                                                </Box>
                                            </Typography>
                                            {canAccess(userActions.UNLOCK_USER) && (
                                                <ButtonToolbar className="button-toolbar" style={{ marginTop: '1rem' }}>
                                                    <CustomButton
                                                        handle={() => handleClick(user.stakeholderId, user.isLocked)}
                                                        size={'small'}
                                                        label={user.isLocked ? 'Unlock' : 'Lock Access'}
                                                        variant={'contained'}
                                                        color={user.isLocked ? 'primary' : 'secondary'}
                                                    />
                                                </ButtonToolbar>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>User Permission Group(s)</TableCell>
                                        <TableCell>Account Status</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getAllUsers.map((user, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{user.displayName}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.groups}</TableCell>
                                            <TableCell>
                                                <Box
                                                    justifyContent={'center'}
                                                    sx={{
                                                        p: '0.5em',
                                                        bgcolor: user.isLocked ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 128, 0, 0.1)',
                                                        color: user.isLocked ? 'red' : 'green',
                                                        width: '50%',
                                                        textAlign: 'center',
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    {user.isLocked ? 'Locked' : 'Active'}
                                                </Box>
                                            </TableCell>
                                            {canAccess(userActions.UNLOCK_USER) && (
                                                <TableCell align="right" sx={{ width: '20%' }}>
                                                    <ButtonToolbar className="button-toolbar">
                                                        <CustomButton
                                                            handle={() => handleClick(user.stakeholderId, user.isLocked)}
                                                            size={'small'}
                                                            label={user.isLocked ? 'Unlock' : 'Lock Access'}
                                                            variant={'contained'}
                                                            color={user.isLocked ? 'primary' : 'secondary'}
                                                        />
                                                    </ButtonToolbar>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </Box>
                }
            />
        </Box>
    );
};

export default ManageLockedUsers;