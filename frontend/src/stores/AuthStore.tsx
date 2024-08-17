import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import { createContext, useContext } from 'react';

class AuthStore {
  isAuthenticated = false;
  token: string | null = null;
  tokenExpirationTime: number | null = null; 
  user: any = null;

  constructor() {
    makeAutoObservable(this);
    this.loadToken();
  }

  loadToken() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('tokenExpirationTime');

    if (token && expiration) {
      this.token = token;
      this.tokenExpirationTime = parseInt(expiration, 10);
      this.isAuthenticated = true;
      this.fetchUserProfile();

      this.scheduleLogoutOnTokenExpiration();
    }
  }

  saveToken(token: string) {
    this.token = token;
    this.isAuthenticated = true;

    const expirationTime = Date.now() + 15 * 60 * 1000;
    this.tokenExpirationTime = expirationTime;

    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpirationTime', expirationTime.toString());

    this.fetchUserProfile();

    
    this.scheduleLogoutOnTokenExpiration();
  }

  scheduleLogoutOnTokenExpiration() {
    if (this.tokenExpirationTime) {
      const currentTime = Date.now();
      const timeUntilExpiration = this.tokenExpirationTime - currentTime;

      if (timeUntilExpiration > 0) {
        setTimeout(() => {
          this.logout();
          window.location.href = '/login';
        }, timeUntilExpiration);
      } else {
        // Токен сдох, выходим
        this.logout();
        window.location.href = '/login';
      }
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await axios.post('http://localhost:3002/api/login', { email, password }, {
        withCredentials: true,
      });
      this.saveToken(response.data.accessToken);
    } catch (error) {
      console.error('Ошибка входа', error);
      throw error;
    }
  }

  async register(formData: FormData) {
    try {
      await axios.post('http://localhost:3002/api/registration', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await this.login(formData.get('email') as string, formData.get('password') as string);
    } catch (error) {
      console.error('Ошибка регистрации', error);
      throw error;
    }
  }

  logout() {
    this.isAuthenticated = false;
    this.token = null;
    this.user = null;
    this.tokenExpirationTime = null;
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpirationTime');
  }

  async fetchUserProfile() {
    if (this.token) {
      try {
        const response = await axios.get('http://localhost:3002/api/profile', {
          headers: { Authorization: `Bearer ${this.token}` },
        });

        // Присваиваем _id как id
        this.user = {
          ...response.data,
          id: response.data._id,
        };
      } catch (error) {
        console.error('Ошибка получения профиля', error);
      }
    }
  }
}

const authStore = new AuthStore();
export const AuthContext = createContext(authStore);

export const useAuthStore = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthContext.Provider value={authStore}>
    {children}
  </AuthContext.Provider>
);

export default authStore;
