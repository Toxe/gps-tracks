import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Hidden, IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core";
import TranslateIcon from "@material-ui/icons/Translate";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useLanguageSelection } from "./hooks";

export default function LanguageSelection() {
    const { t } = useTranslation();
    const { languageName, menuAnchorEl, handleMenu, handleMenuClose, handleChangeLanguage } = useLanguageSelection();

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
                <MenuItem onClick={() => handleChangeLanguage("en")}><span role="img" aria-label="English">🇺🇸</span>English</MenuItem>
                <MenuItem onClick={() => handleChangeLanguage("de")}><span role="img" aria-label="Deutsch">🇩🇪</span>Deutsch</MenuItem>
            </Menu>
        </>
    );
}
