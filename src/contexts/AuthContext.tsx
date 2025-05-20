
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials, RegisterData, User, UserRole } from '@/types/auth';

// This is a mock implementation. In a real app, you'd connect to your backend API
const MOCK_USERS = [
  {
    id: '1',
    name: 'Professor João',
    email: 'joao@example.com',
    password: 'senha123',
    role: 'professor' as UserRole,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Aluno Maria',
    email: 'maria@example.com',
    password: 'senha123',
    role: 'aluno' as UserRole,
    createdAt: new Date().toISOString()
  }
];

interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('musicaAulasUser');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('musicaAulasUser');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Mock login - in a real app, you'd call your API
    const user = MOCK_USERS.find(
      user => user.email === credentials.email && user.password === credentials.password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('musicaAulasUser', JSON.stringify(userWithoutPassword));
      
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false
      });
      
      return true;
    }
    
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Mock registration - in a real app, you'd call your API
    // Check if email already exists
    const existingUser = MOCK_USERS.find(user => user.email === data.email);
    
    if (existingUser) {
      return false;
    }
    
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      createdAt: new Date().toISOString()
    };
    
    MOCK_USERS.push(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    localStorage.setItem('musicaAulasUser', JSON.stringify(userWithoutPassword));
    
    setAuthState({
      user: userWithoutPassword,
      isAuthenticated: true,
      isLoading: false
    });
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem('musicaAulasUser');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
