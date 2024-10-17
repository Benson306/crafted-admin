import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const useAuthCheck = () => {
  const { token, logout } = useContext(AuthContext);
  const history = useHistory();

  const isTokenExpired = (token) => {
    if(!token) return true;

    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now();
  }

  useEffect(() => {
    const interval = setInterval(()=>{
        if (isTokenExpired(token)) {
            logout();
        }
    }, 1000 * 10)

    return () => clearInterval(interval);
    
  }, [token, logout, history]);
};

export default useAuthCheck;