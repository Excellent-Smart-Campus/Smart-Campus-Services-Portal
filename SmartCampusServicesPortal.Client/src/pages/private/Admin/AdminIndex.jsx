import { Box, Typography, Grid } from '@mui/material';
import { useAuth } from "@/context/AuthContext.jsx";
import { useAdmin } from  "@/context/AdminContext.jsx";
import { constantRoutes } from "@/utils/constantRoutes.jsx";
import StatBox from '@/components/StatsCard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import BuildIcon from '@mui/icons-material/Build';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

function AdminIndex(){
    const { user } = useAuth();
    const { } = useAdmin();
    
    return(
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6"> 👋 Welcome, {user.name} </Typography>
             <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm:6, md: 3 }}  sx={{ mt: 4 }}>
                        <StatBox
                            title= {20}
                            subtitle="Active Users"
                            link={constantRoutes.protected.admin.manageUserAndGroups}
                            icon={<GroupIcon color="secondary" fontSize="large" />}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm:6, md: 3 }}  sx={{ mt: 4 }}>
                        <StatBox
                            title= {10}
                            subtitle="Registered Students"
                            link={constantRoutes.protected.admin.registeredStudents}
                            icon={<SchoolIcon color="secondary" fontSize="large"/>}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm:6, md: 3 }}  sx={{ mt: 4 }}>
                        <StatBox
                            title= {5}
                            subtitle="Lectures Scheduled"
                            link={constantRoutes.protected.admin.scheduledLecturer}
                            icon={<MenuBookIcon color="secondary" />}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm:6, md: 3 }}  sx={{ mt: 4 }}>
                        <StatBox
                            title={8}
                            subtitle="Room Bookings"
                            progress="0.50"
                            increase="+21%"
                            icon={<MeetingRoomIcon color="secondary" fontSize="large" />}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm:6, md: 3 }}  sx={{ mt: 4 }}>
                        <StatBox
                            title= {3}
                            subtitle="Open Maintenance Requests"
                            link={constantRoutes.protected.admin.manageMaintenance}
                            icon={<BuildIcon color="secondary" fontSize="large" />}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm:6, md: 3 }}  sx={{ mt: 4 }}>
                        <StatBox
                            title= {4}
                            subtitle="Locked Account Requests"
                            link={constantRoutes.protected.admin.lockedUsers}
                            icon={<LockPersonIcon color="secondary" fontSize="large"  />}
                        />
                </Grid>
         
            </Grid>
        </Box>
    )
}
export default  AdminIndex;