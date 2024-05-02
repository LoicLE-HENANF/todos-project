import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserType from "../../types/UserType.tsx";
import UserModel from "../../models/UserModel.tsx";
import { useFlashes } from "./FlashesProvider.tsx";

interface AuthContextType {
  user: UserType | null;
  login: (username: string, password: string) => Promise<UserType|null>; // Modify login
  // function to return Promise<void>
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  userModel: UserModel; // Accept userModel as a prop
  children: React.ReactNode; // Add children prop
}

const AuthProvider: React.FC<AuthProviderProps> = ({ userModel, children }) => {
  const [user, setUser] = useState<UserType | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();
  const { setFlashMessage } = useFlashes(); // Get the setFlashMessage function from FlashesProvider

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (username: string, password: string) : Promise<UserType|null> => {
    try {
      const user = await userModel.login({username: username, password: password}); // Call the login function from userModel
      setUser(user);
      setFlashMessage({ message: 'Login successful', type: 'success' }); // Set success flash message
      return user;
    } catch (error) {
      console.error('Error logging in:', error);
      setFlashMessage({ message: `Error logging in: ${error}`, type: 'error' }); // Set error flash message
      return null;
    }
  };

  const logout = () => {
    setUser(null); // Clear the user state
    setFlashMessage({ message: 'Logout successful', type: 'success' }); // Set
    // success flash message
    navigate('/'); // Redirect to the login page after logout
  };

  const authContextValue: AuthContextType = {
    user,
    login,
    logout,
  };

  return (
      <AuthContext.Provider value={authContextValue}>
        {children} {/* Render children */}
      </AuthContext.Provider>
  );
};

export default AuthProvider;
