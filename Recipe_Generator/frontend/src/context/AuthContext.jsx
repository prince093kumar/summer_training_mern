import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const now = Date.now() / 1000;

                if (decoded.exp && decoded.exp < now) {
                    
                    localStorage.removeItem("token");
                } else {
                    setUser({ username: decoded.username });
                }
            } catch (err) {
                console.error("Invalid token", err);
                localStorage.removeItem("token");
            }
        }
        setLoading(false); 
    }, []);

    const login = async (username, password) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                username,
                password,
            });

            const token = res.data.token;
            localStorage.setItem("token", token);

            const decoded = jwtDecode(token);
            setUser({ username: decoded.username });

            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.error || "Login failed",
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
