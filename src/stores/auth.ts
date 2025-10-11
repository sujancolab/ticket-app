import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthService } from '@/services/auth';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const authService = useAuthService();
  
  const user = ref(null);
  const isAuthenticated = ref(false);
  
  const login = async (credentials: { email: string; password: string }) => {
    try {
      interface LoginResponse {
        user: any;
        token: string;
      }

      const response = (await authService.login(credentials)) as LoginResponse;
      user.value = response.user;
      isAuthenticated.value = true;
      localStorage.setItem('authToken', response.token);
    } catch (error) {
      throw error;
    }
  };
  
  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('authToken');
    router.push('/login');
  };
  
  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token with backend
      isAuthenticated.value = true;
    }
  };
  
  return { user, isAuthenticated, login, logout, checkAuth };
});