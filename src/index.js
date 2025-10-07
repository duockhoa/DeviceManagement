import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyle from './component/GlobalStyle';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppInitializer from './component/AppInittializer/AppInitializer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyle>
                    <AppInitializer>
                        <App />
                    </AppInitializer>
                </GlobalStyle>
            </ThemeProvider>
        </React.StrictMode>
    </Provider>,
);

reportWebVitals();
