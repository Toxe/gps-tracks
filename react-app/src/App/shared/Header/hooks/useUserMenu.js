import { useState, useCallback } from "react";
import { useAuth } from "../../../../Auth";
import { useUser } from "../../../AuthenticatedApp/UserProvider";

export default function useUserMenu(navigateToRoot) {
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const { logout } = useAuth();
    const { user } = useUser();

    const handleMenu = useCallback((e) => setMenuAnchorEl(e.currentTarget), []);
    const handleMenuClose = useCallback(() => setMenuAnchorEl(null), []);

    const handleMenuTracksClick = useCallback(() => {
        handleMenuClose();
        navigateToRoot();
    }, [handleMenuClose, navigateToRoot]);

    const handleMenuLogoutClick = useCallback(async () => {
        handleMenuClose();
        await logout();
        navigateToRoot();
    }, [handleMenuClose, navigateToRoot, logout]);

    return { user, menuAnchorEl, handleMenu, handleMenuClose, handleMenuTracksClick, handleMenuLogoutClick };
}
