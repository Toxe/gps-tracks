import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Hidden, IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core";
import TranslateIcon from "@material-ui/icons/Translate";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Flag } from "./Flag";
import { useLanguageSelection } from "./hooks";

const useStyles = makeStyles({
    label: {
        marginLeft: "0.75em",
    },
});

export default function LanguageSelection() {
    const { t } = useTranslation();
    const classes = useStyles();
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
                <MenuItem onClick={() => handleChangeLanguage("en")}>
                    <Flag country="us" title="English" />
                    <span className={classes.label}>English</span>
                </MenuItem>
                <MenuItem onClick={() => handleChangeLanguage("de")}>
                    <Flag country="de" title="Deutsch" />
                    <span className={classes.label}>Deutsch</span>
                </MenuItem>
            </Menu>
        </>
    );
}
