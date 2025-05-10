import { User } from '../types';

export const users: User[] = [
  {
    id: '1',
    username: 'Superadminit',
    password: 'Admin@10',
    role: 'admin',
    displayName: 'Super Admin',
    division: 'Admin'
  },
  {
    id: '2',
    username: 'ITAlinea',
    password: 'TimitAliena2025',
    role: 'it',
    displayName: 'IT Team',
    division: 'IT'
  },
  {
    id: '3',
    username: 'RstAlinea',
    password: 'RstAlinea2025',
    role: 'riset',
    displayName: 'Research Team',
    division: 'Riset'
  },
  {
    id: '4',
    username: 'CwAliena',
    password: 'CwAlinea2025',
    role: 'writer',
    displayName: 'Writer Team',
    division: 'Writer'
  },
  {
    id: '5',
    username: 'CnAliena',
    password: 'CnAlinea2025',
    role: 'content',
    displayName: 'Content Team',
    division: 'Content'
  },
  {
    id: '6',
    username: 'DnAlinea',
    password: 'DnAliena2025',
    role: 'desain',
    displayName: 'Design Team',
    division: 'Desain'
  }
];

export const findUserByUsername = (username: string): User | undefined => {
  return users.find(user => user.username === username);
};

export const validateUser = (username: string, password: string): User | undefined => {
  const user = findUserByUsername(username);
  if (user && user.password === password) {
    return user;
  }
  return undefined;
};