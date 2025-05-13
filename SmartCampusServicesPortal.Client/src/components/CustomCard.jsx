import { Typography, Card, CardContent, CardActionArea} from '@mui/material';

function CustomCard({ title, description, onClick }) {
    return (
        <Card >
            <CardActionArea onClick={onClick}>
                <CardContent>
                    <Typography variant="h6">{title}</Typography>
                    <Typography>{description}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default CustomCard;