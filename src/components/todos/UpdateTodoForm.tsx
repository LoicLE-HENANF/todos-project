import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TodoModel from '../../models/TodoModel.tsx';
import TodoType from '../../types/TodoType.tsx';
import { useFlashes } from "../providers/FlashesProvider.tsx";

interface UpdateTodoFormProps {
    todoModel: TodoModel;
}

const UpdateTodoForm: React.FC<UpdateTodoFormProps> = ({ todoModel }) => {
    const { id } = useParams() as { id: string };
    const navigate = useNavigate();
    const { setFlashMessage } = useFlashes();

    const [todo, setTodo] = useState<TodoType | null>(null);
    const [updatedLabel, setUpdatedLabel] = useState<string>('');

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const todoData = await todoModel.getById(id);
                setTodo(todoData);
                setUpdatedLabel(todoData.label);
            } catch (error) {
                setFlashMessage({ message: `Error fetching todo: ${error}`, type: "error" });
            }
        };
        fetchTodo();
    }, [todoModel, id, setFlashMessage]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedLabel(event.target.value);
    };

    const handleUpdateTodo = () => {
        if (!todo) return;
        const updatedTodo = { ...todo, label: updatedLabel };
        todoModel.update(todo.id, updatedTodo)
            .then(() => {
                navigate('/todos');
                setFlashMessage({ message: "Todo updated successfully", type: "success" });
            })
            .catch(error => {
                setFlashMessage({ message: `Error updating todo: ${error}`, type: "error" });
            });
    };

    if (!todo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Update Todo</h2>
            <div className="mb-4">
                <label className="block text-gray-700">Label:</label>
                <input
                    type="text"
                    value={updatedLabel}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                />
            </div>
            <div>
                <button
                    onClick={handleUpdateTodo}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600"
                >
                    Update Todo
                </button>
            </div>
        </div>
    );
};

export default UpdateTodoForm;
