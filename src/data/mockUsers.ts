// TODO: Replace with Firebase/API data.
import { User, UserRole } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'usr-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: UserRole.USER,
    department: 'Engineering',
    createdAt: new Date('2023-01-15').toISOString(),
  },
  {
    id: 'usr-2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: UserRole.AGENT,
    department: 'IT Support',
    createdAt: new Date('2022-11-01').toISOString(),
  },
  {
    id: 'usr-3',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    role: UserRole.USER,
    department: 'Sales',
    createdAt: new Date('2023-05-10').toISOString(),
  },
  {
    id: 'usr-4',
    name: 'Bob Builder',
    email: 'bob.b@example.com',
    role: UserRole.USER,
    department: 'Operations',
    createdAt: new Date('2023-03-20').toISOString(),
  },
  {
    id: 'usr-5',
    name: 'Sarah Connor',
    email: 'sarah.c@example.com',
    role: UserRole.ADMIN,
    department: 'HR',
    createdAt: new Date('2021-08-15').toISOString(),
  },
  {
    id: 'usr-6',
    name: 'Mike Agent',
    email: 'mike.agent@example.com',
    role: UserRole.AGENT,
    department: 'IT Support',
    createdAt: new Date('2023-02-28').toISOString(),
  },
  {
    id: 'usr-7',
    name: 'Emma Watson',
    email: 'emma.w@example.com',
    role: UserRole.USER,
    department: 'Marketing',
    createdAt: new Date('2023-07-01').toISOString(),
  },
  {
    id: 'usr-8',
    name: 'David Admin',
    email: 'david.a@example.com',
    role: UserRole.ADMIN,
    department: 'IT Support',
    createdAt: new Date('2020-01-10').toISOString(),
  }
];

export const currentUser = mockUsers[1]; // Logged in as Jane Smith (Agent) for dev
