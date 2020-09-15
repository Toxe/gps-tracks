import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    spacer: {
        paddingLeft: theme.spacing(4),
    },
}));

export default function TrackDetails({ track }) {
    const { i18n } = useTranslation();
    const classes = useStyles();

    if (!track) {
        return null;
    }

    const time_start = new Date(track.time_start).toLocaleTimeString(i18n.language);
    const time_end = new Date(track.time_end).toLocaleTimeString(i18n.language);
    const uphill = parseInt(track.total_uphill);
    const downhill = parseInt(track.total_downhill);
    const max_speed = Number.parseFloat(track.max_speed).toFixed(2);

    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <Typography variant="body1"><strong>Start:</strong> {time_start}</Typography>
                    </td>
                    <td className={classes.spacer}>
                        <Typography variant="body1"><strong>Ziel:</strong> {time_end}</Typography>
                    </td>
                </tr>
                <tr>
                    <td>
                        <Typography variant="body1"><strong>Bergauf:</strong> {uphill} m</Typography>
                    </td>
                    <td className={classes.spacer}>
                        <Typography variant="body1"><strong>Bergab:</strong> {downhill} m</Typography>
                    </td>
                </tr>
                <tr>
                    <td colSpan="2">
                        <Typography variant="body1"><strong>Maximale Geschwindigkeit:</strong> {max_speed} km/h</Typography>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
