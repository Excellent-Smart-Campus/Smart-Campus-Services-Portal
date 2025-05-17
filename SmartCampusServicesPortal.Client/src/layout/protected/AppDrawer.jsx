import { useState } from 'react';
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import {userActions} from "@/utils/authEnums.jsx";
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Typography, ListItemIcon  } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import BuildIcon from '@mui/icons-material/Build';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
const drawerWidth = 240;

const admin = [
    {
        header: "",
        links: [
            { name: 'Dashboard', link: constantRoutes.protected.index, icon: <DashboardIcon /> },
        ]
    },     
    {
        header: "Registered stakeholders",
        links: [
            { name: 'Registered Students', link: constantRoutes.protected.admin.registeredStudents, icon: <SchoolIcon /> },
            { name: 'Lecturer Assigned', link: constantRoutes.protected.admin.scheduledLecturer, icon: <MenuBookIcon /> },
        ]
    },
    {
        header: "All Members",
        links: [
            { name: 'Manage Users', link: constantRoutes.protected.admin.manageUserAndGroups, icon: <GroupIcon /> },
            { name: 'Locked Users', link: constantRoutes.protected.admin.lockedUsers, icon: <LockPersonIcon /> },
        ]
    }, 
    {
        header: "Services",
        links: [
            { name: 'Manage Maintenance', link: constantRoutes.protected.admin.manageMaintenance, icon: <BuildIcon /> },
            { name: 'Manage Bookings', link: constantRoutes.protected.admin.manageBookings, icon: <MeetingRoomIcon /> }
        ]
    }
];

const lecturer = [
    { name: 'Home', link: constantRoutes.protected.index, icon: <DashboardIcon /> },
    { name: 'View Timetable', link: constantRoutes.protected.viewSchedule, icon: <EventNoteIcon /> },
    { name: 'Book A Room', link: constantRoutes.protected.lecturer.bookRoom, icon: <MeetingRoomIcon /> },
    { name: 'Manage Bookings', link: constantRoutes.protected.lecturer.manageBookings, icon: <ManageAccountsIcon /> },
    { name: 'Maintenance Request', link: constantRoutes.protected.student.maintenanceRequest, icon: <BuildIcon /> }
];

const students = [
    { name: 'Home', link: constantRoutes.protected.index, icon: <DashboardIcon /> },
    { name: 'View Timetable', link: constantRoutes.protected.viewSchedule, icon: <EventNoteIcon /> },
    { name: 'Book A Room', link: constantRoutes.protected.student.bookRoom, icon: <MeetingRoomIcon /> },
    { name: 'Schedule Lecturer Appointment', link: constantRoutes.protected.student.lecturerAppointment, icon: <EventNoteIcon /> },
    { name: 'Maintenance Request', link: constantRoutes.protected.student.maintenanceRequest, icon: <BuildIcon /> }
];

const Item = ({ title, to, icon, selected, setSelected }) => {
    const navigate = useNavigate();
    const isSelected = selected === title;

    return (
        <ListItem key={title} onClick={() => navigate(to)} disablePadding >
            <ListItemButton selected={selected === title} onClick={() => setSelected(title)}
            sx={{
                color: isSelected ? 'secondary.main' : 'text.primary',
                backgroundColor: isSelected ? 'action.selected' : 'transparent',
                '&:hover': {
                    backgroundColor: isSelected ? 'action.selected' : 'action.hover',
                },
            }} >
                <ListItemIcon sx={{ color: isSelected ? 'secondary.main' : '#666666' }}>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={title} />
            </ListItemButton>
        </ListItem>
    );
};
            
const AppDrawer = ({handleDrawer, mobileOpen, window}) => {
    const { canAccess } = useAuth();
    const [selected, setSelected] = useState("Dashboard");

    const drawer = (
        <Box onClick={handleDrawer} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Smart Campus Portal
            </Typography>
            <Divider />
            {canAccess(userActions.ADMIN_DASHBOARD) && (
                <List >
                    {admin.map((section, index) => (
                        <Box key={index} sx={{ textAlign: 'left', px: 2 }}>
                            {section.header && (
                                <Typography variant="body1" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
                                    {section.header}
                                </Typography>
                            )}
                            {section.links.map((item) => (
                                <Item
                                    key={item.name}
                                    title={item.name}
                                    to={item.link}
                                    icon={item.icon}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                            ))}
                        </Box>
                    ))}
                </List>
            )}
            {canAccess(userActions.LECTURE_DASHBOARD) && (
                <List >
                    {lecturer.map((item) => (
                    <Item
                            title={item.name}
                            to={item.link}
                            icon={item.icon}
                            selected={selected} 
                            setSelected={setSelected}
                        />
                    ))}
                </List>
            )}
            {canAccess(userActions.STUDENT_DASHBOARD) && (
                <List >
                    {students.map((item) => (
                    <Item
                            title={item.name}
                            to={item.link}
                            icon={item.icon}
                            selected={selected} 
                            setSelected={setSelected}
                        />
                    ))}
                </List>
            )}
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;
    
    return (
        <nav>
            <Drawer
                container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawer}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                >
                {drawer}
            </Drawer>
        </nav>
    );
};

export default AppDrawer;