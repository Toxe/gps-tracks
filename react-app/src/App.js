import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import LoginPage from "./LoginPage";
import CurrentUserContextProvider from "./Auth/CurrentUserContext";

export default function App() {
    return (
        <CurrentUserContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="login" element={<LoginPage />} />
                </Routes>
            </BrowserRouter>
        </CurrentUserContextProvider>
    );
}
