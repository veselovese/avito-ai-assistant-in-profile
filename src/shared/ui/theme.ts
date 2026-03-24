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
            fontWeight: 500,
            color: '#000000',
        },
        body2: {
            fontSize: '14px',
            fontWeight: 500,
            color: '#000000',

        },
        subtitle1: {
            fontSize: '16px',
            fontWeight: 400,
            color: '#000000',
            lineHeight: 1.5
        },
        subtitle2: {
            fontSize: '14px',
            fontWeight: 400,
            color: '#000000',
            lineHeight: 1.5
        }
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundColor: 'background.paper',
                    boxShadow: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    padding: 16,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        fontSize: '14px',
                        fontWeight: 400,
                        padding: 0,
                        minHeight: '32px',
                        maxHeight: '32px',

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'text.secondary',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                            borderWidth: 2,
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'text.secondary',
                    },
                    '& .MuiOutlinedInput-input': {
                        padding: '0 12px',
                        minHeight: '32px',
                        maxHeight: '32px',
                        display: 'flex',
                        alignItems: 'center',
                }
            },
        },
    },
}
});