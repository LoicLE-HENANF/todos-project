import React, { useState } from 'react';
import UserModel from "../../models/UserModel.tsx";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { useFlashes } from "../providers/FlashesProvider.tsx"; // Import useFlashes

interface AddUserFormProps {
    userModel: UserModel;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ userModel }) => {
    const navigate = useNavigate();
    const { setFlashMessage } = useFlashes(); // Initialize useFlashes

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) return;
        if (password !== confirmPassword) {
            setFlashMessage({ message: 'Password and confirm password do not match', type: 'error' });
            return;
        }

        // Check if the username already exists
        userModel.getByUsername(username)
            .then((existingUserByUsername) => {
                if (existingUserByUsername) {
                    setFlashMessage({ message: 'Username already exists', type: 'error' });
                } else {
                    // Check if the email already exists
                    userModel.getByEmail(email)
                        .then((existingUserByEmail) => {
                            if (existingUserByEmail) {
                                setFlashMessage({ message: 'Email already exists', type: 'error' });
                            } else {
                                // Create the user if the username and email are not already used
                                userModel.create({
                                    id: uuidv4(),
                                    username: username,
                                    email: email,
                                    password: password,
                                    createdAt: new Date()
                                })
                                    .then(() => {
                                        setUsername('');
                                        setEmail('');
                                        setPassword('');
                                        setConfirmPassword('');
                                        setFlashMessage({ message: 'New user created', type: 'success' });
                                        navigate('/users');
                                    })
                                    .catch((error) => {
                                        setFlashMessage({ message: `Error creating user: ${error}`, type: 'error' });
                                    });
                            }
                        })
                        .catch((error) => {
                            console.error('Error checking email:', error);
                            setFlashMessage({ message: `Error checking email: ${error}`, type: 'error' });
                        });
                }
            })
            .catch((error) => {
                console.error('Error checking username:', error);
                setFlashMessage({ message: `Error checking username: ${error}`, type: 'error' });
            });
    };




    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
            <div className="mb-4">
                <label className="block text-gray-700">Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={handleChangeUsername}
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                    placeholder="Enter username"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={handleChangeEmail}
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                    placeholder="Enter email"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={handleChangePassword}
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                    placeholder="Enter password"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Confirm Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                    placeholder="Confirm password"
                />
            </div>
            <div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600"
                >
                    Add User
                </button>
            </div>
        </form>
    );
}

export default AddUserForm;
