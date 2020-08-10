import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";

export default function AuthenticatedApp() {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
        </Routes>
    );
}
