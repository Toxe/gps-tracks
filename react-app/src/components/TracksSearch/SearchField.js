import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { useTracksSearch } from "./TracksSearchProvider";

const useStyles = makeStyles((theme) => ({
    searchField: {
        marginLeft: 50,
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
            value={searchText}
            onChange={handleChangeSearch}
        />
    );
}
