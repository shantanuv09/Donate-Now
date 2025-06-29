import { jwtDecode } from "jwt-decode";

// utils/auth.ts
export const setAuthToken = (token: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('accessToken', token);
    }
  };
  
  export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('accessToken');
    }
    return null;
  };

  export const getRefreshToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('refreshToken');
    }
    return null;
  }
  
  export const removeAuthToken = async () => {
    if (typeof window !== 'undefined') {
      const token = getAuthToken()
      if (token){
        const decodedToken = jwtDecode(token)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/logout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body:JSON.stringify({
              id: decodedToken.userId
            })
          }
        )
      }
      

      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');

      window.location.href = "/login";
      window.location.replace("/login");
    }
  };
  
  export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
  };