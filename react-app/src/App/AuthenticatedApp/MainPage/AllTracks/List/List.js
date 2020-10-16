import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import Pager from "./Pager";
import TracksList from "./TracksList";
import { useList } from "./hooks";

const useStyles = makeStyles((theme) => ({
    div: {
        marginTop: theme.spacing(4),
    },
}));

export default function List({ tracks, tracksPerPage }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const { showPager, numPages, page, paginatedTracks, handleChangePage } = useList(tracks, tracksPerPage);

    if (!paginatedTracks || paginatedTracks.length === 0) {
        return (
            <div className={classes.div}>
                <Alert severity="info">{t("no_tracks_found")}</Alert>
            </div>
        );
    }

    return (
        <div className={classes.div}>
            <Pager showPager={showPager} numPages={numPages} page={page} handleChangePage={handleChangePage} />
            <TracksList tracks={paginatedTracks} />
        </div>
    );
}
