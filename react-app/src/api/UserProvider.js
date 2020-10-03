import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthProvider";

const UserContext = React.createContext();

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
}

export function UserProvider({ children }) {
    const { authId } = useAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function queryUser(id) {
            const response = await axios.get(`/api/users/${authId}`);
            setUser(response.data);
        }

        if (authId) {
            queryUser(authId);
        }
    }, [authId]);

    return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}
