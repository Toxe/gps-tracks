import React from "react";
import { Box } from "@material-ui/core";
import PageContent from "../../shared/PageContent";
import { Header } from "../../shared/Header";
import { useAuth } from "../../../Auth";
import LoginForm from "./LoginForm";

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
