import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Header from "../components/Header/Header";
import LoginForm from "../components/LoginForm/LoginForm";

const useStyles = makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    container: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

export default function LoginPage() {
    const classes = useStyles();

    return (
        <>
            <Header />
            <Container maxWidth="xs" className={classes.container}>
                <div className={classes.toolbar} />
                <LoginForm />
            </Container>
        </>
    );
}
