import { useNavigate } from 'react-router-dom';
import { Breadcrumbs, Link, Typography} from '@mui/material';

export default function CustomBreadcrumb({ items }) {
    const navigate = useNavigate();

    return (
        <Breadcrumbs aria-label="breadcrumb">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                if (isLast) {
                    return (
                        <Typography key={index} sx={{ opacity: '0.5' }} color="inherit" aria-current="page" >
                            {item.label}
                        </Typography>
                    );
                }

                return (
                    <Link underline="none" sx={{ cursor: 'pointer', }} onClick={() => navigate(item.link)}  color="secondary" key={index} >
                        {item.label}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
}
