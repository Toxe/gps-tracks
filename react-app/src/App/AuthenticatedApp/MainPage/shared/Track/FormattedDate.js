import React from "react";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export default function FormattedDate({ time }) {
    const { i18n } = useTranslation();
    const options = { year: "numeric", month: "long", day: "numeric" };

    return (
        <Typography variant="body2" color="textSecondary">
            {new Date(time).toLocaleDateString(i18n.language, options)}
        </Typography>
    );
}
