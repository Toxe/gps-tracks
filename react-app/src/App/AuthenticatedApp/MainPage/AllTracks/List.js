import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Alert, Pagination } from "@material-ui/lab";
import { Track } from "../shared";

const tracksPerPage = 25;

const useStyles = makeStyles((theme) => ({
    div: {
        marginTop: theme.spacing(4),
    },
    pager: {
        marginBottom: theme.spacing(2),
    },
}));

export default function List({ tracks }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [tracks]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    if (!tracks || tracks.length === 0) {
        return (
            <div className={classes.div}>
                <Alert severity="info">{t("no_tracks_found")}</Alert>
            </div>
        );
    }

    const numPages = Math.ceil(tracks.length / tracksPerPage);
    const slice = tracks.slice((page - 1) * tracksPerPage, page * tracksPerPage);
    const showPager = tracks.length > tracksPerPage;

    return (
        <div className={classes.div}>
            {showPager && (
                <Pagination count={numPages} page={page} onChange={handleChangePage} className={classes.pager} />
            )}
            {slice.map((track) => (
                <Track key={track.id} track={track} />
            ))}
        </div>
    );
}
