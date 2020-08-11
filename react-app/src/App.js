import React from "react";
import { useAuth } from "./Auth/AuthProvider";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";

export default function App() {
    const { authId } = useAuth();

    return authId ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}
