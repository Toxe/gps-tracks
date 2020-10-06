import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "../../api/UserProvider";
import { TracksProvider } from "../../api/TracksProvider";
import MainPage from "../../pages/MainPage";
import "./Leaflet";

export default function AuthenticatedApp() {
    return (
        <UserProvider>
            <TracksProvider>
                <Routes>
                    <Route path="/*" element={<MainPage />} />
                </Routes>
            </TracksProvider>
        </UserProvider>
    );
}
