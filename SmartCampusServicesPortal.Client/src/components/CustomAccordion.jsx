import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
} from '@mui/material';

function CustomAccordion({ title, icon, expandIconText = "View All", children }) {
    return (
        <Accordion
            elevation={0}
            sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                '&::before': { display: 'none' },
                borderBottom: '1px solid #e0e0e0'
            }}
            defaultExpanded
        >
            <AccordionSummary
                expandIcon={
                    <Typography
                        variant="body2"
                        sx={{
                            transform: 'none !important', // prevent any MUI rotation
                            transition: 'none',
                        }}
                        color="secondary"
                    >
                        {expandIconText}
                    </Typography>
                }
                aria-controls="panel-content"
                id="panel-header"
                sx={{
                    backgroundColor: 'transparent',
                    px: 0,
                    '& .MuiAccordionSummary-expandIconWrapper': {
                        transform: 'none !important',
                    },
                }}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    {icon && <Box>{icon}</Box>}
                    <Typography color="secondary" component="span">{title}</Typography>
                </Box>           
            </AccordionSummary>

            <AccordionDetails sx={{ backgroundColor: 'transparent', px: 0 }}>
                <Box>{children}</Box>
            </AccordionDetails>
        </Accordion>
    );
}

export default CustomAccordion;
