import TodoType from '../types/TodoType.tsx';

class TodoModel {
    private readonly baseURL: string;
    private todoList: TodoType[];

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.todoList = [];
    }

    async getAll(): Promise<TodoType[]> {
        try {
            const response = await fetch(`${this.baseURL}/todos`, {method: 'GET'});
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            this.todoList = await response.json();
            return this.todoList;
        } catch (error) {
            console.error('Error reading all todos:', error);
            throw error;
        }
    }

    async getById(id: string): Promise<TodoType> {
        try {
            const response = await fetch(`${this.baseURL}/todos/${id}`, {method: 'GET'});
            if (!response.ok) {
                throw new Error('Failed to fetch todo by id');
            }
            return await response.json();
        } catch (error) {
            console.error(`Error reading todo by id ${id}:`, error);
            throw error;
        }
    }

    async create(todo: TodoType): Promise<TodoType> {
        try {
            const response = await fetch(`${this.baseURL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(todo),
            });
            if (!response.ok) {
                throw new Error('Failed to create new todo');
            }
            const newTodo = await response.json();
            this.todoList.push(newTodo);
            return newTodo;
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error; // Rethrowing the error is important to keep the error propagation.
        }
    }


    async update(id: string, updatedTodo: TodoType): Promise<TodoType> {
        try {
            const response = await fetch(`${this.baseURL}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTodo),
            });
            if (!response.ok) {
                throw new Error('Failed to update todo');
            }
            const updatedTodoResponse = await response.json();
            this.todoList = this.todoList.map(todo => (todo.id === id ? updatedTodoResponse : todo));
            return updatedTodoResponse;
        } catch (error) {
            console.error(`Error updating todo ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<string> {
        try {
            const response = await fetch(`${this.baseURL}/todos/${id}`, {
                method: 'DELETE'
            });
            if (response.status !== 200) {
                throw new Error('Todo not found or failed to delete');
            }
            this.todoList = this.todoList.filter(todo => todo.id !== id);
            return 'Successfully deleted';
        } catch (error) {
            console.error(`Error deleting todo ${id}:`, error);
            throw error;
        }
    }

    getTodoList(): TodoType[] {
        return this.todoList;
    }
}

export default TodoModel;
