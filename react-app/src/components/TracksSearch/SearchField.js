import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { makeStyles, fade } from "@material-ui/core/styles";
import { InputBase } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { useTracksSearch } from "./TracksSearchProvider";

const useStyles = makeStyles((theme) => ({
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(3),
            width: "auto",
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    inputRoot: {
        color: "inherit",
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

function getSearchParam(searchParams, name, altValue) {
    const value = searchParams.get(name);

    return value !== undefined && value !== null ? value : altValue;
}

export default function SearchField() {
    const { t } = useTranslation();
    const classes = useStyles();
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchText, setSearchText } = useTracksSearch();

    useEffect(() => {
        setSearchText(getSearchParam(searchParams, "search", ""));
    }, [searchParams, setSearchText]);

    const handleChangeSearch = (e) => {
        searchParams.set("search", e.target.value);
        setSearchParams(searchParams);
    };

    return (
        <div className={classes.search}>
            <div className={classes.searchIcon}>
                <SearchIcon />
            </div>
            <InputBase
                placeholder={t("search_placeholder")}
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                value={searchText}
                onChange={handleChangeSearch}
            />
        </div>
    );
}
