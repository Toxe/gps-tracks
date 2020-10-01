import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import ActivityIcon from "../Track/ActivityIcon";
import { ActivityMode } from "../../utils/enums";

const useStyles = makeStyles((theme) => ({
    label: {
        display: "flex",
    },
    text: {
        marginLeft: theme.spacing(1),
    },
}));

export default function ActivityRadioLabel({ activity }) {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <div className={classes.label}>
            <ActivityIcon activity={activity} />
            <span className={classes.text}>
                {t(activity === ActivityMode.BIKE ? "activity_bike" : "activity_hiking")}
            </span>
        </div>
    );
}
