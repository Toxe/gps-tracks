import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";

export default function UnauthenticatedApp() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
        </Routes>
    );
}
