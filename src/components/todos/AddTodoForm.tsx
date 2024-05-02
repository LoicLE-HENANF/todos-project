// AddTodoForm.tsx
import React, { useState } from 'react';
import TodoModel from "../../models/TodoModel.tsx";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {useFlashes} from "../providers/FlashesProvider.tsx";

interface AddTodoFormProps {
    todoModel: TodoModel;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ todoModel }: { todoModel: TodoModel }) => {

    // Get the navigate object
    const navigate = useNavigate();
    const { setFlashMessage } = useFlashes(); // Get setFlashMessage
    // function from useFlashed hook

    const [label, setLabel] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!label.trim()) return;
        todoModel.create({ id: uuidv4(), label: label, done: false })
            .then(() => {
                setLabel('');
                setFlashMessage({ message: 'New todo created', type: 'success' }); // Set success flash message
                // Redirect to the '/todos' route
                navigate('/todos');
            })
            .catch(error => {
                console.error('Error creating todo:', error);
                setFlashMessage({ message: 'Error creating todo', type: 'error' }); // Set error flash message
            });
    };


    return (
        <form onSubmit={handleSubmit} className="flex justify-center mt-4">
            <input
                type="text"
                value={label}
                onChange={handleChange}
                className="border border-gray-300 rounded-md py-2 px-4 mr-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter your todo"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600"
            >
                Add Todo
            </button>
        </form>
    );
}

export default AddTodoForm;
