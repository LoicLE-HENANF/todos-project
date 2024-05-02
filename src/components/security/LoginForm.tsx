import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider.tsx";
import bcrypt from 'bcryptjs'; // Import bcrypt.js

const Login = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;
        try {
            const user = await login(username, password);
            if (!user) {
                // User not found or password is incorrect
                console.error('Invalid username or password');
                return;
            }
            // Compare hashed password with entered password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                // Passwords match, login successful
                setUsername('');
                setPassword('');
                navigate('/');
            } else {
                // Passwords don't match
                console.error('Invalid username or password');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center mt-4">
            <input
                type="text"
                value={username}
                onChange={handleChangeUsername}
                className="border border-gray-300 rounded-md py-2 px-4 mb-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter username"
                required
            />
            <input
                type="password"
                value={password}
                onChange={handleChangePassword}
                className="border border-gray-300 rounded-md py-2 px-4 mb-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter password"
                required
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600"
            >
                Login
            </button>
        </form>
    );
}

export default Login;
