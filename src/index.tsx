import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './app/App';
import { BrowserRouter } from 'react-router-dom';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
