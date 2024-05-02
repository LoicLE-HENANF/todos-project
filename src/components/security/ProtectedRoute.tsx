// ProtectedRoute.tsx
import {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const ProtectedRoute = ({children} : {children: ReactNode}) => {
    const { user } = useAuth(); // Assuming useAuth returns user information

    if (!user) {
        return <Navigate to="/login" />;
    }
    // If user is authenticated, render child elements
    // If not, navigate to the login page
    return children;
};

export default ProtectedRoute;
