import React, { createContext,useContext, useState, useEffect } from 'react';
import axios from 'axios';

const authContext = createContext();

const ContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const login = (user) => {
        setUser(user);
    }
    const logout = () => {
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = '/';
  }
    
    useEffect(() => {
      const verifyUser = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/auth/verify",
                {
                  headers: {
                       Authorization: `Bearer ${localStorage.getItem('token')}`
                }})
          if (res.data.success) {
            setUser(res.data.user);
          } 

        } catch (error) {
          console.log(error);
           setUser(null);
        } finally {
        setLoading(false); // ✅ done loading
      }
      }
      verifyUser();
    }, []);

  return (
    <authContext.Provider value={{user, login, logout, loading}}>{children}</authContext.Provider>
  )
};
export const useAuth = () => useContext(authContext);

export default ContextProvider
