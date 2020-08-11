import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, IconButton, Box } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TokenInfo from "./TokenInfo";
import RequestError from "../utils/RequestError";
import { useAuth } from "./AuthProvider";

const useStyles = makeStyles(() => ({
    authInfo: {
        position: "fixed",
        top: "auto",
        bottom: 0,
        padding: 5,
        border: "2px solid #ccc",
        backgroundColor: "#ddd",
    },
}));

export default function AuthInfo() {
    const classes = useStyles();
    const { user, refresh } = useAuth();
    const [requestError, setRequestError] = useState(null);
    const [minimized, setMinimized] = useState(false);

    if (!user) return null;

    const handleRefreshButtonClick = async () => {
        try {
            await refresh();
            setRequestError(null);
        } catch (error) {
            setRequestError(<RequestError error={error} handleClose={() => setRequestError(null)} />);
        }
    };

    return (
        <>
            {minimized ? (
                <div className={classes.authInfo}>
                    <Typography variant="body2" component="span"><strong>identity:</strong> {user.id}</Typography>
                    <Box component="span" m={1}/>
                    <TokenInfo tokenName="access_token" minimized />
                    <div>
                        <IconButton onClick={() => setMinimized(!minimized)}>
                            <ExpandLessIcon fontSize="small" />
                        </IconButton>
                        <button type="button" onClick={handleRefreshButtonClick}>
                            Refresh token
                        </button>
                    </div>
                    {requestError}
                </div>
            ) : (
                <div className={classes.authInfo}>
                    <Typography variant="body1">
                        <strong>identity:</strong> {user.id}
                    </Typography>
                    <TokenInfo tokenName="access_token" />
                    <TokenInfo tokenName="refresh_token" />
                    <div>
                        <IconButton onClick={() => setMinimized(!minimized)}>
                            <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                        <button type="button" onClick={handleRefreshButtonClick}>
                            Refresh token
                        </button>
                    </div>
                    {requestError}
                </div>
            )}
        </>
    );
}
