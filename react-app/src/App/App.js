import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "../Auth";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import Loading from "../content/Loading";

export default function App() {
    const { authId } = useAuth();

    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                {authId ? <AuthenticatedApp /> : <UnauthenticatedApp />}
            </Suspense>
        </BrowserRouter>
    );
}
