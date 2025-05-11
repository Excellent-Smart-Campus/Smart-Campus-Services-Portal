import { Box} from '@mui/material';

function CustomTabPanel(props) {
    const { children, value, index } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && 
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            }
        </div>
    );
}

export default CustomTabPanel;