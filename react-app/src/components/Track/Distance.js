import React from "react";
import { useTranslation } from "react-i18next";
import { Typography, Tooltip } from "@material-ui/core";

export default function Distance({ distance }) {
    const { t } = useTranslation();
    const km = Number.parseFloat(distance) / 1000.0;

    return (
        <Tooltip arrow title={t("track_distance")}>
            <Typography variant="body1">{km.toFixed(2)} km</Typography>
        </Tooltip>
    );
}
