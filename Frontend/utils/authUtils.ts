import { useRouter } from "next/navigation";

interface TokenPayload {
  userType: string;
  [key: string]: any;
}

export const getUserTypeFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const tokenPayload = JSON.parse(atob(token.split('.')[1])) as TokenPayload;
    console.log(tokenPayload);
    return tokenPayload.userType?.toLowerCase() || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isEmployer = (): boolean => {
  const userType = getUserTypeFromToken();
  return userType?.toLocaleLowerCase() === 'employer';
};

export const requireEmployerAccess = (router: ReturnType<typeof useRouter>): boolean => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return false;
  }

  const userType = getUserTypeFromToken();
  if (userType?.toLocaleLowerCase() !== 'employer') {
    return false;
  }

  return true;
}; 