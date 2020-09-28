import React, { Suspense } from "react";
import { useAuth } from "../Auth/AuthProvider";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import Loading from "../content/Loading";

export default function App() {
    const { authId } = useAuth();

    return (
        <Suspense fallback={<Loading />}>
            {authId ? <AuthenticatedApp /> : <UnauthenticatedApp />}
        </Suspense>
    );
}
