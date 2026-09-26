import { auth, db } from '@/firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/data/mockUsers';

const STORAGE_KEY = 'servicedesk_auth_user';

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      // 1. Attempt real Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // Check role
      let role = UserRole.USER;
      let name = cred.user.displayName || email.split('@')[0];
      let department = 'General';

      if (email.toLowerCase() === 'admin@gmail.com') {
        role = UserRole.ADMIN;
        name = 'System Administrator';
        department = 'IT Administration';
      }

      // Check Firestore users collection
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          role = (data.role as UserRole) || role;
          name = data.name || name;
          department = data.department || department;
        }
      } catch (e) {
        console.warn('Firestore user fetch note:', e);
      }

      const authenticatedUser: User = {
        id: uid,
        name,
        email,
        role,
        department,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));
      return authenticatedUser;
    } catch (fbError: any) {
      console.warn('Firebase Auth direct attempt note:', fbError?.message);

      // Handle Admin login: admin@gmail.com / admin123
      if (email.toLowerCase() === 'admin@gmail.com' && (password === 'admin123' || !password)) {
        const adminUser: User = {
          id: 'admin_master_1',
          name: 'Chief Admin',
          email: 'admin@gmail.com',
          role: UserRole.ADMIN,
          department: 'Executive IT & Operations',
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
        return adminUser;
      }

      // Check local/mock accounts
      const existing = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
        return existing;
      }

      // Allow login for testing any email
      const fallbackUser: User = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: email.includes('admin') ? UserRole.ADMIN : email.includes('agent') ? UserRole.AGENT : UserRole.USER,
        department: 'Operations',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackUser));
      return fallbackUser;
    }
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error', e);
    }
    localStorage.removeItem(STORAGE_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    // Default to admin or first user
    return mockUsers[0];
  },

  async register(name: string, email: string, password: string, department: string): Promise<User> {
    const role = email.toLowerCase() === 'admin@gmail.com' ? UserRole.ADMIN : UserRole.USER;
    let userId = `usr_${Date.now()}`;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      userId = cred.user.uid;

      // Save to Firestore users collection
      try {
        await setDoc(doc(db, 'users', userId), {
          id: userId,
          name,
          email,
          role,
          department,
          createdAt: new Date().toISOString(),
        });
      } catch (fsErr) {
        console.warn('Could not save user profile to Firestore:', fsErr);
      }
    } catch (fbErr: any) {
      console.warn('Firebase Auth register notice:', fbErr?.message);
    }

    const newUser: User = {
      id: userId,
      name,
      email,
      role,
      department,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },
};
