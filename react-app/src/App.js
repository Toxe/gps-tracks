import React, { Suspense } from "react";
import { useAuth } from "./Auth/AuthProvider";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";

export default function App() {
    const { authId } = useAuth();

    return (
        <Suspense fallback="loading">
            {authId ? <AuthenticatedApp /> : <UnauthenticatedApp />}
        </Suspense>
    );
}
