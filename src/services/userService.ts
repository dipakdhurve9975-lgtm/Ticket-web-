// TODO: Connect to Firebase/API
import { mockUsers } from '@/data/mockUsers';
import { User, UserRole } from '@/types';

let usersDb = [...mockUsers];

const delay = <T>(data: T, ms = 300): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), ms));

export const userService = {
  async getUsers(): Promise<User[]> {
    return delay(usersDb);
  },

  async getUserById(id: string): Promise<User | null> {
    const user = usersDb.find(u => u.id === id);
    return delay(user || null);
  },

  async getAgents(): Promise<User[]> {
    const agents = usersDb.filter(u => u.role === UserRole.AGENT || u.role === UserRole.ADMIN);
    return delay(agents);
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const index = usersDb.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    const updatedUser = { ...usersDb[index], ...updates };
    usersDb[index] = updatedUser;
    
    return delay(updatedUser);
  }
};
