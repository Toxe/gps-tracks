import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../../../Auth";
import { Users } from "../api";

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
            setUser(await Users.get(id));
        }

        if (authId) {
            queryUser(authId);
        } else {
            setUser(null);
        }
    }, [authId]);

    return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}
