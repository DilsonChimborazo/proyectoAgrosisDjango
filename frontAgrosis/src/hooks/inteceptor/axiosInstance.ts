export const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = (base64Url ?? '').replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error decodificando el token:", e);
      return null;
    }
  };
  
  export const isTokenExpired = (token: string) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
  
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  };