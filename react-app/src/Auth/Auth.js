import { useContext, useEffect } from "react";
import { login, logout, refresh, initAuth } from "./API";
import { CurrentUserContext } from "./CurrentUserContext";

export default function useAuth() {
    const { setCurrentUserId } = useContext(CurrentUserContext);

    useEffect(() => {
        // init auth from already existing tokens
        const access_token = localStorage.getItem("access_token");
        const refresh_token = localStorage.getItem("refresh_token");

        try {
            setCurrentUserId(initAuth(access_token, refresh_token));
        } catch (error) {}
    }, [setCurrentUserId]);

    const handleLogin = async (credentials) => {
        const userId = await login(credentials);
        setCurrentUserId(userId);
    };

    const handleLogout = async () => {
        // no matter what happens, always "logout" locally first
        setCurrentUserId(0);
        await logout();
    };

    const handleRefresh = async () => {
        await refresh();
    };

    return { handleLogin, handleLogout, handleRefresh };
}
