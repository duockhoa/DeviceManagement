import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingPage = () => {
    return (
        <Stack
            sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
            }}
        >
            <CircularProgress size={60} thickness={4} />
        </Stack>
    );
};

export default LoadingPage;
