import { createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export const theme = createTheme({
    palette: {
        background: {
            default: '#F7F5F8',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#000000',
            secondary: '#848388',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 16,

        h1: {
            fontSize: '24px',
            fontWeight: 500,
            lineHeight: '125%'
        },
        h2: {
            fontSize: '18px',
            fontWeight: 400,
            color: '#848388',
        },

        body1: {
            fontSize: '16px',
            fontWeight: 400,
        },
        body2: {
            fontSize: '14px',
            fontWeight: 400,

        }
    }
});