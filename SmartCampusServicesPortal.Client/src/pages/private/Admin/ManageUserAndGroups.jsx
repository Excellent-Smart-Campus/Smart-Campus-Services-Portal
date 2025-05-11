import  {useState, useEffect } from 'react';
import { Box, Tabs, Tab, CardActions, useMediaQuery, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { useNavigate } from "react-router-dom";
import { ButtonToolbar } from 'rsuite';
import { usersAndGroupsType } from "@/utils/constants.jsx";
import { useAdmin } from  "@/context/AdminContext.jsx";
import { useTheme } from '@mui/material/styles';
import { encodeId } from '@/utils/hashHelper';
import CustomContainer from "@/components/CustomContainer.jsx";
import CustomTabPanel from "@/components/CustomTabPanel.jsx";
import CustomBreadcrumb from '@/components/CustomBreadcrumb.jsx';
import CustomButton from "@/components/CustomButton.jsx";
import EditIcon from '@mui/icons-material/Edit';

const ManageUserAndGroups = () => {
    const { fetchAllUsers, fetchGroups, getGroups ,getAllUsers} = useAdmin();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [value, setValue] = useState(usersAndGroupsType.Users);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (value === usersAndGroupsType.Users) {
                console.log("users");
             await fetchAllUsers();
            } else if (value === usersAndGroupsType.Groups) {
                console.log("group");
                await fetchGroups();
            }
        };

        fetchData();
    }, [value]);
    
    const handleUserClick = (userId) => {
        navigate(constantRoutes.protected.admin.viewUser(encodeId(userId)))
    };
    
    const handleGroupClick = (groupId) => {
        navigate(constantRoutes.protected.admin.viewGroup(encodeId(groupId)))
    };

    const handleAddClick = () => {
         if (value === usersAndGroupsType.Users) {
            console.log("users");
        } else if (value === usersAndGroupsType.Groups) {
            console.log("group");
        }
    }
    const renderUsers = () => {
        return isMobile ? (
            <Box display="flex" flexDirection="column" gap={2}>
                {getAllUsers.map((user, index) => (
                    <Card key={index} onClick={() => handleUserClick(user.stakeholderId)} sx={{ cursor: 'pointer' }}>
                        <CardContent>
                            <Typography variant="h6">{user.displayName}</Typography>
                            <Typography variant="body2">Email: {user.username}</Typography>
                            <Typography variant="body2">Role: {user.groups}</Typography>
                            
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
                        <TableRow key={index} onClick={() => handleUserClick(user.stakeholderId)}>
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
                            <TableCell align="right" sx={{ width: '10%' }}>
                                <ButtonToolbar  className="button-toolbar">
                                    <EditIcon onClick={() => handleUserClick(user.stakeholderId)} sx={{ cursor: 'pointer' }} color="secondary" fontSize="small" />
                                </ButtonToolbar>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    const renderGroups = () => {
        return isMobile ? (
            <Box display="flex" flexDirection="column" gap={2}>
                {getGroups.map((group, index) => (
                    <Card key={index} >
                        <CardContent>
                            <Typography variant="h6">{group.description}</Typography>
                            <Typography variant="body2">{!group.isDeleted === true ? 'Active' : 'Inactive'}</Typography>
                        </CardContent>
                        <CardActions>
                            <EditIcon onClick={() => handleGroupClick(group.groupId)} sx={{ cursor: 'pointer' }} color="secondary" fontSize="small" />
                        </CardActions>
                    </Card>
                ))}
            </Box>
        ) : (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: '80%' }}>Group Name</TableCell>
                        <TableCell sx={{ width: '10%' }}>Status</TableCell>
                        <TableCell sx={{ width: '10%' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {getGroups.map((group, index) => (
                        <TableRow key={index} onClick={() => handleGroupClick(group.groupId)}>
                            <TableCell sx={{ width: '80%' }}>{group.description}</TableCell>
                            <TableCell sx={{ width: '10%' }}>{!group.isDeleted ? 'Active' : 'Inactive'}</TableCell>
                            <TableCell align="right" sx={{ width: '10%' }}>
                                <ButtonToolbar  className="button-toolbar">
                                    <EditIcon onClick={() => handleGroupClick(group.groupId)} sx={{ cursor: 'pointer' }} color="secondary" fontSize="small" />
                                </ButtonToolbar>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    const tabData = [
        { label: 'Users', content: renderUsers(), key: usersAndGroupsType.Users },
        { label: 'Groups', content: renderGroups(), key: usersAndGroupsType.Groups }
    ];
    
    return (
        <Box>
            <CustomContainer
                breadcrum={
                    <CustomBreadcrumb
                        items={[
                            { label: 'Admin', link: constantRoutes.protected.admin.index },
                            { label: 'Manage-users-groups', link: constantRoutes.protected.admin.manageUserAndGroups},
                        ]}
                    />
                }
                title={'Manage Users Groups'}
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
                                children={tab?.content}
                            />
                        ))}
                    </Box>
                }
            />
        </Box>
    );
};

export default ManageUserAndGroups;