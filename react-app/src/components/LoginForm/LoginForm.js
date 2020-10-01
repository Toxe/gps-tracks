import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Button, TextField } from "@material-ui/core";
import RequestError from "../../utils/RequestError";

const useStyles = makeStyles((theme) => ({
    container: {
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

export default function LoginForm({ handleLogin }) {
    const { t } = useTranslation();
    const classes = useStyles();
    const [credentials, setCredentials] = useState({ email: "user1@example.com", password: "password1" });
    const [requestError, setRequestError] = useState(null);

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setRequestError(null);
            await handleLogin(credentials);
        } catch (error) {
            setRequestError(<RequestError error={error} handleClose={() => setRequestError(null)} />);
        }
    };

    const loginButtonIsDisabled = () => {
        return credentials.email === "" || credentials.password === "";
    };

    return (
        <Container maxWidth="xs" className={classes.container}>
            <Typography variant="h4">{t("login_title")}</Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label={t("login_label_email")}
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
                    label={t("login_label_password")}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={onChange}
                    value={credentials.password}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={loginButtonIsDisabled()}>
                    {t("login_button")}
                </Button>
                {requestError}
            </form>
        </Container>
    );
}
