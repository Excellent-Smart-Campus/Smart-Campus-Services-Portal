import { Box} from '@mui/material';

function CustomTabPanel(props) {
    const { children, value, index, py=3 } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && 
                <Box sx={{ py: py }}>
                    {children}
                </Box>
            }
        </div>
    );
}

export default CustomTabPanel;