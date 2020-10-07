import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Tooltip } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles(() => ({
    button: {
        "&:hover": {
            backgroundColor: "transparent",
        },
    },
}));

export default function ClearSearchButton({ disabled, handleClick }) {
    const { t } = useTranslation();
    const classes = useStyles();

    const createButton = () => {
        return (
            <IconButton disabled={disabled} disableRipple className={classes.button} onClick={handleClick}>
                <ClearIcon color={disabled ? "disabled" : "action"} fontSize="small" />
            </IconButton>
        );
    };

    if (disabled) {
        return createButton();
    } else {
        return <Tooltip title={t("search_button_clear_search")}>{createButton()}</Tooltip>;
    }
}
