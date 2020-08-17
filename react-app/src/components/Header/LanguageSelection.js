import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Hidden, IconButton, Menu, MenuItem } from "@material-ui/core";
import TranslateIcon from "@material-ui/icons/Translate";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default function LanguageSelection() {
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

    return (
        <>
            <Hidden smUp implementation="css">
                <IconButton color="inherit" onClick={handleMenu}>
                    <TranslateIcon />
                    <ExpandMoreIcon />
                </IconButton>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Button color="inherit" size="large" onClick={handleMenu} startIcon={<TranslateIcon />}>
                    {languageName}
                    <ExpandMoreIcon />
                </Button>
            </Hidden>
            <Menu anchorEl={menuAnchorEl} keepMounted open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleChangeLanguage("en")}>English</MenuItem>
                <MenuItem onClick={() => handleChangeLanguage("de")}>Deutsch</MenuItem>
            </Menu>
        </>
    );
}
