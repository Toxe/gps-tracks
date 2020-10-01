import React from "react";
import { Box } from "@material-ui/core";
import PageContent from "../content/PageContent";
import Header from "../components/Header/Header";
import LoginForm from "../components/LoginForm/LoginForm";

export default function LoginPage() {
    return (
        <>
            <Header />
            <PageContent>
                <Box mt={8}>
                    <LoginForm />
                </Box>
            </PageContent>
        </>
    );
}
