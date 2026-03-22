import { createContext, useContext, useState, useEffect, ReactNode } from 'react';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: decoded.id, username: decoded.username, email: decoded.email });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  // const login = (token) => {
  //   try {
  //     const decoded = JSON.parse(atob(token.split('.')[1]));
  //     setUser({ id: decoded.id, username: decoded.username, email: decoded.email });
  //     setIsAuthenticated(true);
  //     localStorage.setItem('token', token);
  //   } catch (error) {
  //     console.error('Invalid token during login:', error);
  //   }
  // };

  // const logout = () => {
  //   setUser(null);
  //   setIsAuthenticated(false);
  //   localStorage.removeItem('token');
  // };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);