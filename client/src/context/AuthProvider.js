import axios from "axios";
import {createContext, useState, useEffect} from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState(() => {
        const storedAccessToken = sessionStorage.getItem('accessToken');
        const storedUserId = sessionStorage.getItem('userId');
        return storedAccessToken ? { accessToken: storedAccessToken, userId: storedUserId } : null;
      });

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;