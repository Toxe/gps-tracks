import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "../Auth/AuthProvider";

const UserContext = React.createContext();

export function UserProvider(props) {
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

    return <UserContext.Provider value={{ user }}>{props.children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context)
        throw new Error("useUser must be used within a UserProvider");

    return context;
}
