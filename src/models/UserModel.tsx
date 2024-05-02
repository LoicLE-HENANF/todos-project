import UserType from '../types/UserType.ts';

class UserModel {
    private readonly baseURL: string;
    private userList: UserType[];

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.userList = [];
    }

    async create(user: UserType): Promise<UserType> {
        try {
            const response = await fetch(`${this.baseURL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            if (!response.ok) {
                throw new Error('Failed to create user');
            }
            const newUser = await response.json();
            this.userList.push(newUser);
            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async getAll(): Promise<UserType[]> {
        try {
            const response = await fetch(`${this.baseURL}/users`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const userList = await response.json();
            this.userList = userList;
            return userList;
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }

    async getById(id: string): Promise<UserType> {
        try {
            const response = await fetch(`${this.baseURL}/users/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user by id');
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching user by id ${id}:`, error);
            throw error;
        }
    }

    async update(id: string, updatedUser: UserType): Promise<UserType> {
        try {
            const response = await fetch(`${this.baseURL}/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            const updatedUserResponse = await response.json();
            this.userList = this.userList.map(user => (user.id === id ? updatedUserResponse : user));
            return updatedUserResponse;
        } catch (error) {
            console.error(`Error updating user ${id}:`, error);
            throw error;
        }
    }

    async delete(id: string): Promise<string> {
        try {
            const response = await fetch(`${this.baseURL}/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                this.userList = this.userList.filter(user => user.id !== id);
                return 'Successfully deleted';
            } else {
                throw new Error('User not found or failed to delete');
            }
        } catch (error) {
            console.error(`Error deleting user ${id}:`, error);
            throw error;
        }
    }

    getUserList(): UserType[] {
        return this.userList;
    }

    async login(user: { username: string, password: string }): Promise<UserType> {
        const foundUser = await this.getByUsername(user.username);
        if (!foundUser || foundUser.password !== user.password) {
            throw new Error('Invalid username or password');
        }
        return foundUser;
    }

    async getByUsername(username: string): Promise<UserType | null> {
        try {
            const response = await fetch(`${this.baseURL}/users`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const users: UserType[] = await response.json();
            const foundUser = users.find(user => user.username === username);
            return foundUser || null;
        } catch (error) {
            console.error('Error fetching user by username:', error);
            throw error;
        }
    }
    
    async getByEmail(email: string): Promise<UserType | null> {
        try {
            const response = await fetch(`${this.baseURL}/users`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const users: UserType[] = await response.json();
            const foundUser = users.find(user => user.email === email);
            return foundUser || null;
        } catch (error) {
            console.error('Error fetching user by email:', error);
            throw error;
        }
    }
}

export default UserModel;
