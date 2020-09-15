import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import debounce from "lodash/debounce";
import ClearSearchButton from "./ClearSearchButton";

const useStyles = makeStyles(() => ({
    searchField: {
        marginLeft: 50,
    },
}));

export default function SearchField({ initialSearchText, updateSearch }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const [searchFieldContent, setSearchFieldContent] = useState(initialSearchText);

    // update URL search param after a short delay once the user stopped typing
    const debouncedUpdateSearch = useCallback(
        debounce((text) => updateSearch(text), 300),
        [updateSearch]
    );

    useEffect(() => {
        setSearchFieldContent(initialSearchText);
    }, [initialSearchText]);

    const handleChange = (e) => {
        setSearchFieldContent(e.target.value);
        debouncedUpdateSearch(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchFieldContent("");
        debouncedUpdateSearch("");
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
                endAdornment: (
                    <InputAdornment position="end">
                        <ClearSearchButton handleClick={handleClearSearch} />
                    </InputAdornment>
                ),
            }}
            value={searchFieldContent}
            onChange={handleChange}
        />
    );
}
