import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserModel from '../../models/UserModel';
import UserType from '../../types/UserType';
import { useFlashes } from "../providers/FlashesProvider.tsx"; // Import useFlashes

interface UserProps {
    userModel: UserModel;
}

const UserDetailPage: React.FC<UserProps> = ({ userModel }) => {
    const { id } = useParams() as { id: string };
    const [user, setUser] = useState<UserType | null>(null);
    const { setFlashMessage } = useFlashes();

    useEffect(() => {
        const fetchUser = () => {
            userModel.getById(id)
                .then(userData => {
                    setUser(userData);
                })
                .catch(error => {
                    setFlashMessage({ message: `Error fetching user: ${error}`, type: 'error' });
                });
        };
        fetchUser();
    }, [userModel, id, setFlashMessage]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex justify-center">
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-bold mb-4">User Detail</h1>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Username:</h2>
                        <p className="text-gray-800">{user.username}</p>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Email:</h2>
                        <p className="text-gray-800">{user.email}</p>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Created At:</h2>
                        <p className="text-gray-800">{user.createdAt.toString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;
