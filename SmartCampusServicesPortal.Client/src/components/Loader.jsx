import { Box, Typography, keyframes, useTheme, useMediaQuery } from '@mui/material';

const colors = Array.from({ length: 20 }, (_, i) =>
    i % 2 === 0 ? '#008292' : '#118a97'
);

const shimmer = keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
`;

function VerticalColorLoader() {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            {colors.map((color, index) => (
                <Box
                    key={index}
                    sx={{
                        flex: 1,
                        backgroundColor: color,
                        backgroundImage: `linear-gradient(90deg, ${color} 25%, rgba(255,255,255,0.2) 50%, ${color} 75%)`,
                        backgroundSize: '200% 100%',
                        animation: `${shimmer} 6s infinite`,
                    }}
                />
            ))}
            <Box
                sx={{
                    position: 'absolute',
                    top: '35%',
                    left: 0,
                    width: '100%',
                    height: '30%',
                    pointerEvents: 'none',
                    background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.6), transparent)',
                }}
            />
        </Box>
    );
}

/**
 * SkeletonLoaderOverlay
 * Renders the vertical color background with content on top, mimicking a skeleton loader.
 * @param {{ visible: boolean, children: React.ReactNode }} props
 */
function Loader() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1300,
                overflow: 'hidden',
            }}
        >
            <VerticalColorLoader/>
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1301,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant={isMobile ? 'h6' : 'h2'}
                    fontWeight="bold">
                    Smart Campus Service Portal
                </Typography>
            </Box>
        </Box>
    );
}

export default Loader;
