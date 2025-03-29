import { createContext, useContext, useState } from 'react';
import '../App.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
});

const [token, setToken] = useState(() => {
  return localStorage.getItem('token');
});

const login = (userData, userToken) => {
  setUser(userData);
  setToken(userToken);
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', userToken);
};
  
const [success, SetSuccess]=useState(null);

const logout = () => {
  setUser(null); 
  setToken(null);
  SetSuccess("You have been logged out successfully.");
  
setTimeout (() => { 
SetSuccess(null);
  }, 2000);
  
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
      {success && (<div className='success-alert'> 
        {success}
      </div>)}
      
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}