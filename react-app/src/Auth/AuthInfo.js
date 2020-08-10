import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import TokenInfo from "./TokenInfo";
import RequestError from "../RequestError";
import { useAuth } from "./AuthProvider";

const useStyles = makeStyles(() => ({
    authInfo: {
        position: "fixed",
        top: "auto",
        bottom: 0,
        padding: 10,
        background: "lightgray",
    },
}));

export default function AuthInfo() {
    const classes = useStyles();
    const { user, refresh } = useAuth();
    const [requestError, setRequestError] = useState(null);

    if (!user)
        return null;

    const handleRefreshButtonClick = async () => {
        try {
            await refresh();
            setRequestError(null);
        } catch (error) {
            setRequestError(<RequestError error={error} handleClose={() => setRequestError(null)} />);
        }
    }

    return (
        <div className={classes.authInfo}>
            <Typography variant="body1"><strong>identity:</strong> {user.id}</Typography>
            <TokenInfo tokenName="access_token" />
            <TokenInfo tokenName="refresh_token" />
            <div>
                <button type="button" onClick={handleRefreshButtonClick}>Refresh token</button>
            </div>
            {requestError}
        </div>
    );
}
