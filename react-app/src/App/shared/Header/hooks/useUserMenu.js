import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../Auth";
import { useUser } from "../../../AuthenticatedApp/UserProvider";

export default function useUserMenu() {
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const { logout } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();

    const handleMenu = (e) => {
        setMenuAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleMenuTracksClick = () => {
        handleMenuClose();
        navigate("/");
    };

    const handleMenuLogoutClick = async () => {
        handleMenuClose();
        await logout();
        navigate("/");
    };

    return { user, menuAnchorEl, handleMenu, handleMenuClose, handleMenuTracksClick, handleMenuLogoutClick };
}
