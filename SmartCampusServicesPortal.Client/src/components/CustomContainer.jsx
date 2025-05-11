import { Typography, useMediaQuery, Box} from '@mui/material';
import { useTheme } from '@mui/material/styles';

function CustomContainer({ bgColor = true, breadcrum, title, children }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Box >
            <Box sx={{ pb: '1.5em' }} >
                { breadcrum }
            </Box>
            <Box sx={{ bgcolor: bgColor? 'white' : 'unset', p: isMobile ? '1em' : '2em' }}>
                <Typography variant="h6">{title}</Typography>
                <Box>{children}</Box>
            </Box>
        </Box>
    );
}

export default CustomContainer;