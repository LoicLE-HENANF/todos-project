import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TodoModel from '../../models/TodoModel.tsx';
import TodoType from '../../types/TodoType.tsx';
import { useFlashes } from '../providers/FlashesProvider.tsx';

interface TodoDetailPageProps {
    todoModel: TodoModel;
}

const Todo: React.FC<TodoDetailPageProps> = ({ todoModel }) => {
    const { id } = useParams() as { id: string};
    const [todo, setTodo] = useState<TodoType | null>(null);
    const { setFlashMessage } = useFlashes();

    useEffect(() => {
        todoModel.getById(id)
            .then(todoData => setTodo(todoData))
            .catch(error => setFlashMessage({
                message: `Error fetching todo: ${error}`, type: "error"
            }));
    }, [todoModel, id, setFlashMessage]);


    if (!todo) {
        return <div>Loading...</div>; // Or display a loading spinner
    }

    return (
        <div className="flex justify-center">
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-bold mb-4">Todo Detail</h1>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Label:</h2>
                        <p className="text-gray-800">{todo.label}</p>
                    </div>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Done:</h2>
                        <p className={`text-lg ${todo.done ? 'text-green-500' : 'text-red-500'}`}>
                            {todo.done ? 'Yes' : 'No'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Todo;
