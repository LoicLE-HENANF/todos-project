import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserModel from '../../models/UserModel.tsx';
import UserType from '../../types/UserType.tsx';
import { useFlashes } from "../providers/FlashesProvider.tsx"; // Import useFlashes

interface UpdateUserFormProps {
    userModel: UserModel;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ userModel }) => {
    const { id } = useParams() as { id: string };
    const navigate = useNavigate();
    const { setFlashMessage } = useFlashes(); // Initialize useFlashes

    const [user, setUser] = useState<UserType | null>(null);
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedPassword, setUpdatedPassword] = useState('');
    const [updatedConfirmPassword, setUpdatedConfirmPassword] = useState('');

    useEffect(() => {
        const fetchUser = () => {
            userModel.getById(id)
                .then(userData => {
                    setUser(userData);
                    setUpdatedUsername(userData.username);
                    setUpdatedEmail(userData.email);
                })
                .catch(error => {
                    setFlashMessage({ message: `Error fetching user: ${error}`, type: 'error' });
                });
        };
        fetchUser();
    }, [userModel, id, setFlashMessage]);

    const handleInputChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedUsername(event.target.value);
    };

    const handleInputChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedEmail(event.target.value);
    };

    const handleInputChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedPassword(event.target.value);
    };

    const handleInputChangeConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedConfirmPassword(event.target.value);
    };

    const handleUpdateUser = async () => {
        if (!user) return;
        if (updatedPassword !== updatedConfirmPassword) {
            setFlashMessage({ message: 'Password and confirm password do not match', type: 'error' });
            return;
        }
        
        const updatedUser: UserType = {
            ...user,
            username: updatedUsername,
            email: updatedEmail,
            password: updatedPassword !== "" ? updatedPassword : user.password,
        };
        await userModel.update(user.id, updatedUser)
            .then(() => {
                setFlashMessage({ message: 'User updated successfully', type: 'success' });
                navigate('/users');
            })
            .catch((error) => {
            setFlashMessage({ message: `Error updating user: ${error}`, type: 'error' });
            })
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Update User</h2>
            <div className="mb-4">
                <label className="block text-gray-700">Username:</label>
                <input
                    type="text"
                    value={updatedUsername}
                    onChange={handleInputChangeUsername}
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Email:</label>
                <input
                    type="email"
                    value={updatedEmail}
                    onChange={handleInputChangeEmail}
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Password:</label>
                <input
                    type="password"
                    value={updatedPassword}
                    onChange={handleInputChangePassword}
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Confirm Password:</label>
                <input
                    type="password"
                    value={updatedConfirmPassword}
                    onChange={handleInputChangeConfirmPassword}
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                />
            </div>
            <div>
                <button
                    onClick={handleUpdateUser}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600"
                >
                    Update User
                </button>
            </div>
        </div>
    );
};

export default UpdateUserForm;
