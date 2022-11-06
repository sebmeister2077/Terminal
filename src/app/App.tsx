import { BrowserRouter, useLocation } from 'react-router-dom';
import { Terminal } from '../pages/Terminal';

export const App = () => {
    const location = useLocation();
    if (location.pathname == '/blank') return <></>;
    return <Terminal />;
};
