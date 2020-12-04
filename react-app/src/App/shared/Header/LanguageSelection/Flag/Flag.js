import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import deFlag from "./flags/de.svg";
import usFlag from "./flags/us.svg";

const flags = {
    de: deFlag,
    us: usFlag,
};

const useStyles = makeStyles({
    flag: {
        backgroundSize: "contain",
        backgroundPosition: "50%",
        backgroundRepeat: "no-repeat",
        position: "relative",
        display: "inline-block",
        width: "1.33333333em",
        lineHeight: "1em",
        "&:before": {
            content: '"\\00a0"',
        },
    },
    flagIcon: {
        backgroundImage: (props) => `url(${flags[props.country]})`,
    },
});

export default function Flag({ country, title }) {
    const classes = useStyles({ country });

    return <span className={`${classes.flag} ${classes.flagIcon}`} title={title}></span>;
}
