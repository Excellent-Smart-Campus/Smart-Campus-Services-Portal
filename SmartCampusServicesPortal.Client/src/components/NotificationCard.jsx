import { Typography, Box, Card, CardContent } from '@mui/material';

function NotificationCard({ title, message, createdDate, updatedDate, statusData }) {
    return (
        <Card elevation={0} >
            <CardContent>
                <Typography  variant="body1">{title}</Typography>
                <Typography sx={{ whiteSpace: 'pre-line', my:'0.5em' }} variant='body2'>{message}</Typography>

                <Box display={'flex'} sx={{ my: '0.5rem' }} justifyContent={'space-between'}>
                    <>
                        <Typography variant='body2'>Created:  </Typography>
                        <Typography variant='body2'>{createdDate}</Typography>
                    </>
                    <>
                        <Typography variant='body2'>Updated:  </Typography>
                        <Typography variant='body2'>{updatedDate}</Typography>
                    </>
                </Box>
            </CardContent>
        </Card>
    );
}

export default NotificationCard