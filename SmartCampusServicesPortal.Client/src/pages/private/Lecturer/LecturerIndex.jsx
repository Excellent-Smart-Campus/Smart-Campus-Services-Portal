import { Box, Typography } from '@mui/material';
import { useAuth } from "@/context/AuthContext.jsx";

function LecturerIndex(){
    const { user} = useAuth();

    return(
        <Box>
            <Typography variant="h6"> 👋 Welcome, {user.name} </Typography>
        </Box>
    );
}

export default LecturerIndex;