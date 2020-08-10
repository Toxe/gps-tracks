import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import MainHeader from "../MainHeader";
import { useAuth } from "../Auth/AuthProvider";
import RequestError from "../utils/RequestError";

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    container: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    form: {
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function LoginPage() {
    const classes = useStyles();
    const [credentials, setCredentials] = useState({ email: "user1@example.com", password: "password1" });
    const { login } = useAuth();
    const [requestError, setRequestError] = useState(null);

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setRequestError(null);
            await login(credentials);
        } catch (error) {
            setRequestError(<RequestError error={error} handleClose={() => setRequestError(null)} />);
        }
    };

    return (
        <>
            <MainHeader />
            <Container maxWidth="xs" className={classes.container}>
                <div className={classes.toolbar} />
                <Typography variant="h4">Sign in</Typography>
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={onChange}
                        value={credentials.email}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={onChange}
                        value={credentials.password}
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        Sign In
                    </Button>
                    {requestError}
                </form>
            </Container>
        </>
    );
}
