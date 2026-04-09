import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    authService.logout();
    router.push('/login');
  };

  return logout;
}
