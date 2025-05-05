import { Box, Typography, Card } from '@mui/material';
import { useAuth } from "@/context/AuthContext.jsx";
import StudentIndex from "@/pages/private/Student/StudentIndex.jsx";
import LecturerIndex from "@/pages/private/Lecturer/LecturerIndex.jsx";
import AccessGuard from "@/components/AccessGuard.jsx";
import { userActions } from "@/utils/authEnums.jsx";

function Home() {
    const { authenticated, user} = useAuth();
    const renderStudentView = () => ( <StudentIndex /> );
    const renderLecturerView = () => ( <LecturerIndex />);
    
    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* <AccessGuard accessKey={userActions.STUDENT_DASHBOARD}> */}
                {user.description === 'Students' && renderStudentView()}
            {/*</AccessGuard> */}
            
            {/*<AccessGuard accessKey={userActions.LECTURER_DASHBOARD}>*/}
                {user.description === 'Lecturer' && renderLecturerView()}
            {/*</AccessGuard>*/}

            {/*<AccessGuard accessKey={userActions.LECTURER_DASHBOARD}>
                {user.description === 'ADMIN_DASHBOARD' && renderLecturerView()}
            </AccessGuard>*/}
        </Box>
    );
}

export default Home;