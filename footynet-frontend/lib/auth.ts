import { api } from './api';
import { LoginDto, RegisterDto, AuthResponseDto } from '@/types';

export const authService = {
  async login(data: LoginDto): Promise<AuthResponseDto> {
    const response = await api.post<AuthResponseDto>('/Auth/login', data);
    return response.data;
  },

  async register(data: RegisterDto): Promise<AuthResponseDto> {
    const response = await api.post<AuthResponseDto>('/Auth/register', data);
    return response.data;
  },

  // Confirms the email with the token from the link; returns a normal login response
  async verifyEmail(token: string): Promise<AuthResponseDto> {
    const response = await api.post<AuthResponseDto>('/Auth/verify-email', { token });
    return response.data;
  },

  async resendVerification(email: string): Promise<void> {
    await api.post('/Auth/resend-verification', { email });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('isApproved');
  },

  saveAuth(auth: AuthResponseDto) {
    localStorage.setItem('token', auth.token);
    localStorage.setItem('role', auth.role.toString());
    localStorage.setItem('userId', auth.userId);
    if (auth.isApproved !== undefined && auth.isApproved !== null) {
      localStorage.setItem('isApproved', auth.isApproved.toString());
    }
  },

  getAuth() {
    return {
      token: localStorage.getItem('token'),
      role: localStorage.getItem('role'),
      userId: localStorage.getItem('userId'),
      isApproved: localStorage.getItem('isApproved'),
    };
  },
};
