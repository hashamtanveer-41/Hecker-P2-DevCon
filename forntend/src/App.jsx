import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HospitalProvider } from './context/HospitalContext';
import { WebSocketProvider } from './context/WebSocketContext.jsx';
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <HospitalProvider>
                    <WebSocketProvider>
                        <AppRoutes />
                    </WebSocketProvider>
                </HospitalProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;