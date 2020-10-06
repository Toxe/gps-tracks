import React from "react";
import { Box } from "@material-ui/core";
import PageContent from "../content/PageContent";
import Header from "../components/Header/Header";
import LoginForm from "../components/LoginForm/LoginForm";
import { useAuth } from "../Auth/AuthProvider";

export default function LoginPage() {
    const { login } = useAuth();

    const handleLogin = async (credentials) => {
        await login(credentials);
    };

    return (
        <>
            <Header />
            <PageContent>
                <Box mt={8}>
                    <LoginForm handleLogin={handleLogin} />
                </Box>
            </PageContent>
        </>
    );
}
