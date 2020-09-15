import React from "react";
import { useTranslation } from "react-i18next";
import Track from "../Track/Track";
import { Alert } from "@material-ui/lab";

export default function TracksList({ tracks }) {
    const { t } = useTranslation();

    if (!tracks || tracks.length === 0) {
        return <Alert severity="info">{t("no_tracks_found")}</Alert>;
    }

    return (
        <>
            {tracks.map((track) => (
                <Track key={track.id} track={track} />
            ))}
        </>
    );
}
