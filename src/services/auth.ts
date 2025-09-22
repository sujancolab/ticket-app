import { reactive } from 'vue';

export const useAuthService = () => {
  // In a real app, this would make API calls to your backend
  const mockUsers = [
    { id: 1, email: 'admin@example.com', password: 'password', name: 'Admin' }
  ];
  
  const login = async (credentials: { email: string; password: string }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(
          u => u.email === credentials.email && u.password === credentials.password
        );
        
        if (user) {
          resolve({
            user: { id: user.id, email: user.email, name: user.name },
            token: 'mock-jwt-token'
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };
  
  return { login };
};