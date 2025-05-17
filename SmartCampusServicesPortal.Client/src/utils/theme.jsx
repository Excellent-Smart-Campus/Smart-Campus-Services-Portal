// theme.js
import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#FFFFFF',
            contrastText: '#008292',
        },
        secondary: {
            main: '#008292',
        },
        background: {
            default: '#F9FAFB',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#000000de',
            secondary: '#141b2d',
        },
        action:{
            selected: '#E0F7FA',
            hover: '#E0F7FA',
        }
    },
});

export default muiTheme;
