import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TodoModel from "../../models/TodoModel.tsx";
import TodoType from "../../types/TodoType.tsx";
import {useFlashes} from "../providers/FlashesProvider.tsx";

interface TodoListProps {
    todoModel: TodoModel;
}

const TodoList: React.FC<TodoListProps> = ({ todoModel }) => {
    const [todoList, setTodoList] = useState<TodoType[]>([]);

    const { setFlashMessage } = useFlashes();

    useEffect(() => {
        todoModel.getAll()
            .then(setTodoList)
            .catch(error => setFlashMessage({
                message: `Error fetching todos: ${error}`, type: "error"
            }));
    }, [todoModel]);

    const handleDelete = (id: string) => {
        todoModel.delete(id)
            .then(() => setTodoList(prevList => prevList.filter(todo => todo.id !== id)))
            .catch(console.error);
    }

    const handleToggleDone = (id: string) => {
        const updatedTodoList = todoList.map(todo =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
        );
        setTodoList(updatedTodoList);
        const updatedTodo = updatedTodoList.find(todo => todo.id === id);
        if (updatedTodo) {
            todoModel.update(id, updatedTodo)
                .catch(console.error);
        }
    }

    return (
        <div className="relative overflow-x-auto">
            <h2 className="my-4 ml-4">To do list:</h2>
            <Link to={`/todos/add`} className="px-3">
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
                        Label
                    </th>
                    <th scope="col"
                        className="px-4 py-3 font-medium dark:text-gray-300">
                        Status
                    </th>
                    <th scope="col"
                        className="pl-4 py-3 font-medium dark:text-gray-300">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody>
                {todoList.map((item) => (
                    <tr key={item.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-4 py-4 whitespace-nowrap">{item.id}</td>
                        <td className="px-6 py-4 whitespace-normal">{item.label}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.done ? 'Done' : 'Pending'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <button
                                onClick={() => handleToggleDone(item.id)}
                                className={`px-3 py-1 rounded ${item.done ? 'bg-yellow-500' : 'bg-green-500'} text-white mr-2`}
                            >
                                {item.done ? 'Undo' : 'Done'}
                            </button>
                            <Link to={`/todos/${item.id}/update`} className="px-3">
                                <button
                                    className="py-1 bg-blue-500 text-white rounded">Update
                                </button>
                            </Link>
                            <Link to={`/todos/${item.id}`} className="px-3">
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

export default TodoList;
