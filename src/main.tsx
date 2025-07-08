import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
    onNeedRefresh() {
        // optional: prompt user to refresh
    },
    onOfflineReady() {
        // optional: show toast "App ready to use offline"
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);