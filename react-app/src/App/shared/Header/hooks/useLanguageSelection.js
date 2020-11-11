import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function useLanguageSelection() {
    const { i18n } = useTranslation();
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const languageName = i18n.language === "en" ? "English" : "Deutsch";

    const handleMenu = (e) => {
        setMenuAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleChangeLanguage = (language) => {
        handleMenuClose();
        i18n.changeLanguage(language);
    };

    return { languageName, menuAnchorEl, handleMenu, handleMenuClose, handleChangeLanguage };
}
