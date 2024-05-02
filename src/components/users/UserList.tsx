import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserModel from "../../models/UserModel.tsx";
import UserType from "../../types/UserType.tsx";
import { useFlashes } from "../providers/FlashesProvider.tsx"; // Import useFlashes

interface UserListProps {
    userModel: UserModel;
}

const UserList: React.FC<UserListProps> = ({ userModel }) => {
    const [userList, setUserList] = useState<UserType[]>([]);
    const { setFlashMessage } = useFlashes(); // Get setFlashMessage function from useFlashes

    useEffect(() => {
        userModel.getAll()
            .then(setUserList)
            .catch(error => {
                setFlashMessage({ message: `Error fetching user list: ${error}`, type: 'error' }); // Set flash message on error
            });
    }, [userModel, setFlashMessage]); // Add setFlashMessage to dependencies

    const handleDelete = (id: string) => {
        userModel.delete(id)
            .then(() => {
                setUserList(prevList => prevList.filter(user => user.id !== id));
                setFlashMessage({ message: `User with ID ${id} deleted successfully`, type: 'success' }); // Set flash message on success
            })
            .catch(error => {
                setFlashMessage({ message: `Error deleting user: ${error}`, type: 'error' }); // Set flash message on error
            });
    }

    return (
        <div className="relative overflow-x-auto">
            <h2 className="my-4 ml-4">User List:</h2>
            <Link to={`/users/add`} className="px-3">
                <button
                    className="my-2 ml-1 py-1 bg-yellow-500 text-white rounded">Create
                </button>
            </Link>
            <table
                className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mx-4">
                <thead
                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-700">
                <tr>
                    <th scope="col"
                        className="px-4 py-3 font-medium dark:text-gray-300">
                        ID
                    </th>
                    <th scope="col"
                        className="px-4 py-3 font-medium dark:text-gray-300">
                        Username
                    </th>
                    <th scope="col"
                        className="px-4 py-3 font-medium dark:text-gray-300">
                        Email
                    </th>
                    <th scope="col"
                        className="pl-4 py-3 font-medium dark:text-gray-300">
                        Created At
                    </th>
                    <th scope="col"
                        className="pl-4 py-3 font-medium dark:text-gray-300">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody>
                {userList.map((item) => (
                    <tr key={item.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-4 whitespace-nowrap">{item.id}</td>
                        <td className="px-6 py-4 whitespace-normal">{item.username}</td>
                        <td className="px-6 py-4 whitespace-normal">{item.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.createdAt.toString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Link to={`/users/${item.id}/update`} className="px-3">
                                <button
                                    className="py-1 bg-blue-500 text-white rounded">Update
                                </button>
                            </Link>
                            <Link to={`/users/${item.id}`} className="px-3">
                                <button
                                    className="py-1 bg-gray-500 text-white rounded">View
                                </button>
                            </Link>
                            <button onClick={() => handleDelete(item.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded">Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

}

export default UserList;
