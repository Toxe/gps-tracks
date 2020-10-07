import React from "react";
import { Routes, Route } from "react-router-dom";
import { TracksProvider } from "./TracksProvider";
import { UserProvider } from "./UserProvider";
import { MainPage } from "./MainPage";
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
