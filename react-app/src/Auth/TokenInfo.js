import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import jwt from "jsonwebtoken";
import { getAuthTokensFromLocalStorage } from "./API";

const useStyles = makeStyles(() => ({
    expired: {
        color: "red",
        fontWeight: "bold",
    },
    expiredMinimized: {
        color: "red",
    },
}));

export default function TokenInfo({ tokenName, minimized }) {
    const classes = useStyles();
    const [token, setToken] = useState(null);
    const [issued, setIssued] = useState("-");
    const [expires, setExpires] = useState("-");
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const tokens = getAuthTokensFromLocalStorage();

            if (tokens && tokens[tokenName]) {
                const decoded = jwt.decode(tokens[tokenName]);
                const iat = new Date(decoded.iat * 1000);
                const exp = new Date(decoded.exp * 1000);

                setToken(tokens[tokenName]);
                setIssued(formatDistanceToNowStrict(iat, { addSuffix: true }));
                setExpires(formatDistanceToNowStrict(exp, { addSuffix: true }));
                setIsExpired(Date.now() > exp);
            } else {
                setToken(null);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [tokenName]);

    if (!token) {
        return null;
    }

    return (
        <>
            {minimized ? (
                <Typography variant="body2" component="span" className={isExpired ? classes.expiredMinimized : null}>
                    <strong>{tokenName}:</strong> {isExpired ? "expired" : "expires"} {expires}
                </Typography>
            ) : (
                <div>
                    <Typography variant="body1" noWrap>
                        <strong>{tokenName}:</strong> {token}
                    </Typography>
                    <Typography variant="body2">issued: {issued}</Typography>
                    <Typography variant="body2" className={isExpired ? classes.expired : null}>
                        {isExpired ? "expired" : "expires"}: {expires}
                    </Typography>
                </div>
            )}
        </>
    );
}
