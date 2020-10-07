import React from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@material-ui/core";
import DirectionsBikeIcon from "@material-ui/icons/DirectionsBike";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import { ActivityMode } from "../../utils/enums";

export default function ActivityIcon({ activity }) {
    const { t } = useTranslation();

    return Number(activity) === ActivityMode.BIKE ? (
        <Tooltip arrow title={t("activity_bike")}>
            <DirectionsBikeIcon fontSize="small" />
        </Tooltip>
    ) : (
        <Tooltip arrow title={t("activity_hiking")}>
            <DirectionsWalkIcon fontSize="small" />
        </Tooltip>
    );
}
