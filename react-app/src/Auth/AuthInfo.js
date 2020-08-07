import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import TokenInfo from "./TokenInfo";
import { CurrentUserContext } from "./CurrentUserContext";

const useStyles = makeStyles(() => ({
    authInfo: {
        position: "fixed",
        top: "auto",
        bottom: 0,
        padding: 10,
        background: "lightgray",
    },
}));

export default function AuthInfo({ handleRefresh }) {
    const classes = useStyles();
    const { currentUserId } = useContext(CurrentUserContext);

    if (currentUserId === 0)
        return null;

    return (
        <div className={classes.authInfo}>
            <Typography variant="body1"><strong>identity:</strong> {currentUserId}</Typography>
            <TokenInfo tokenName="access_token" />
            <TokenInfo tokenName="refresh_token" />
            <div>
                <button type="button" onClick={handleRefresh}>Refresh token</button>
            </div>
        </div>
    );
}
