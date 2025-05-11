import { Box, Typography } from '@mui/material';
import { Stat, StatGroup } from 'rsuite';
import { useNavigate } from "react-router-dom";

import PeoplesIcon from '@rsuite/icons/Peoples';
import FunnelStepsIcon from '@rsuite/icons/FunnelSteps';

const StatsCard = ({ title, subtitle, icon, link}) => {
    const navigate = useNavigate();
    return (
        <Box>
            <Box onClick={() => navigate(link)} height={150} sx={{ bgcolor: 'white', p: '1em' }}>
                <Box display="flex" gap={2} alignContent={"start"} alignItems={'center'} justifyContent={"start"}>
                    <Box sx={{
                            backgroundColor: '#E1E1E1',
                            p: 1,
                            borderRadius: '10%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                        }}  fontSize={1} >
                        {icon}
                    </Box>
                    <Typography variant="h6"> {subtitle} </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mt="2px" style={{ marginBottom: "10px" }} >
                    <Typography variant="h3" fontWeight={'bold'}> {title}  </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default StatsCard;