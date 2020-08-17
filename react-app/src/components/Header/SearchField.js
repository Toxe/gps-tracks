import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles, fade } from "@material-ui/core/styles";
import { InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
    searchField: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
    },
}));

export default function SearchField() {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <TextField
            variant="outlined"
            size="small"
            className={classes.searchField}
            placeholder={t("search_placeholder")}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
}
