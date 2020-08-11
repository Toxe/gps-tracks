import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./api/UserProvider";
import MainPage from "./pages/MainPage";

export default function AuthenticatedApp() {
    return (
        <UserProvider>
            <Routes>
                <Route path="/*" element={<MainPage />} />
            </Routes>
        </UserProvider>
    );
}
