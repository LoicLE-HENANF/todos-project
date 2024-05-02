import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import TodoModel from "./models/TodoModel.tsx";
import TodoList from "./components/todos/TodoList.tsx";
import AddTodoForm from "./components/todos/AddTodoForm.tsx";
import UpdateTodoForm from "./components/todos/UpdateTodoForm.tsx";
import UserModel from "./models/UserModel.tsx";
import Todo from "./components/todos/Todo.tsx";
import UserList from "./components/users/UserList.tsx";
import User from "./components/users/User.tsx";
import AddUserForm from "./components/users/addUserForm.tsx";
import UpdateUserForm from "./components/users/UpdateUserForm.tsx";
import LoginForm from "./components/security/LoginForm.tsx";
import AuthProvider from "./components/providers/AuthProvider.tsx";
import ProtectedRoute from "./components/security/ProtectedRoute.tsx";
import FlashesProvider from "./components/providers/FlashesProvider.tsx";

const todoModel = new TodoModel('http://localhost:8000');
const userModel = new UserModel('http://localhost:8000');

const routes = [
    {
        path: '/',
        element: <App />,
        children: [
            { path: 'login', element: <LoginForm /> },
            { path: 'todos', element: <TodoList todoModel={todoModel} /> },
            {
                path: 'todos/add',
                element: <ProtectedRoute><AddTodoForm todoModel={todoModel} /></ProtectedRoute>
            },
            { path: 'todos/:id/update', element: <UpdateTodoForm todoModel={todoModel} /> },
            { path: 'todos/:id', element: <Todo todoModel={todoModel} /> },
            { path: 'users', element: <UserList userModel={userModel} /> },
            { path: 'users/add', element: <AddUserForm userModel={userModel} /> },
            { path: 'users/:id/update', element: <UpdateUserForm userModel={userModel} /> },
            { path: 'users/:id', element: <User userModel={userModel} /> },
        ]
    }
];

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <FlashesProvider>
                <AuthProvider userModel={userModel}>
                    <Routes>
                        {routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                element={route.element}
                            >
                                {route.children && route.children.map((childRoute, childIndex) => (
                                    <Route
                                        key={childIndex}
                                        path={childRoute.path}
                                        element={childRoute.element}
                                    />
                                ))}
                            </Route>
                        ))}
                    </Routes>
                </AuthProvider>
            </FlashesProvider>
        </BrowserRouter>
    </React.StrictMode>
);
