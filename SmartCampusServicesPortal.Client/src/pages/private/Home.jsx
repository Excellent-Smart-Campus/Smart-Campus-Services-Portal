import { Box, Typography, IconButton, Paper, Grid} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

function Home() {

    const StatBox = ({ title, subtitle, icon, progress, increase }) => {
        return (
            <Box width="100%" m="0 30px">
                <Box display="flex" justifyContent="space-between">
                    <Box>
                        {icon}
                        <Typography variant="h4" fontWeight="bold"  style={{ color: "#4cceac" }} > {title} </Typography>
                    </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" mt="2px" style={{ marginBottom: "10px" }} >
                    <Typography variant="h5" style={{ color: "#4cceac" }}> {subtitle} </Typography>
                    <Typography variant="h5" fontStyle="italic"  style={{ color: "#4cceac" }} > {increase} </Typography>
                </Box>
            </Box>
        );
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'grid', gap: 2 }}>
                <Box sx={{ gridColumn: 'span 12' }}>
                    <Item>xs=8</Item>
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                    <Item>xs=4</Item>
                </Box>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={6} md={8}>
                    <Box style={{backgroundColor: "#141b2d"}}>
                    <StatBox
                        title= {2}
                        subtitle="Total Customers"
                        progress="0.50"
                        increase="+21%"
                        icon={ <AccountCircle style={{ color: "#4cceac",  fontSize: "30px", marginBottom: "10px" }} /> }  />
                    </Box>
                </Grid>
                
                <Grid item xs={6} md={4}>
                    <Box style={{backgroundColor: "#141b2d"}}>

                    <StatBox
                        title= {2}
                        subtitle="Total Customers"
                        progress="0.50"
                        increase="+21%"
                        icon={ <AccountCircle style={{ color: "#4cceac",  fontSize: "30px", marginBottom: "10px" }} /> }  />
                    </Box>
                </Grid>
            </Grid>
            
        </Box>
    );
}

export default Home;