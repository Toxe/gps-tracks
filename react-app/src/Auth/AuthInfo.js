import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import TokenInfo from "./TokenInfo";
import { CurrentUserContext } from "./CurrentUserContext";
import RequestError from "../RequestError";

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
    const [requestError, setRequestError] = useState(null);

    if (currentUserId === 0)
        return null;

    const handleRefreshButtonClick = async () => {
        try {
            await handleRefresh();
            setRequestError(null);
        } catch (error) {
            setRequestError(<RequestError error={error} handleClose={() => setRequestError(null)} />);
        }
    }

    return (
        <div className={classes.authInfo}>
            <Typography variant="body1"><strong>identity:</strong> {currentUserId}</Typography>
            <TokenInfo tokenName="access_token" />
            <TokenInfo tokenName="refresh_token" />
            <div>
                <button type="button" onClick={handleRefreshButtonClick}>Refresh token</button>
            </div>
            {requestError}
        </div>
    );
}
