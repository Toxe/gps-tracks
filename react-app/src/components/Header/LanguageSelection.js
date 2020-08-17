import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Hidden, IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core";
import TranslateIcon from "@material-ui/icons/Translate";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default function LanguageSelection() {
    const { t, i18n } = useTranslation();
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
                <Tooltip title={t("language_selection_tooltip")}>
                    <IconButton color="inherit" onClick={handleMenu}>
                        <TranslateIcon />
                        <ExpandMoreIcon />
                    </IconButton>
                </Tooltip>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Tooltip title={t("language_selection_tooltip")}>
                    <Button color="inherit" size="large" onClick={handleMenu} startIcon={<TranslateIcon />}>
                        {languageName}
                        <ExpandMoreIcon />
                    </Button>
                </Tooltip>
            </Hidden>
            <Menu anchorEl={menuAnchorEl} keepMounted open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleChangeLanguage("en")}>English</MenuItem>
                <MenuItem onClick={() => handleChangeLanguage("de")}>Deutsch</MenuItem>
            </Menu>
        </>
    );
}
