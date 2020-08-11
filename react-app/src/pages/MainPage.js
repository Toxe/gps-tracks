import React, { useState } from "react";
import Header from "../content/Header";
import Navigation from "../content/Navigation";
import MainContent from "../content/MainContent";

export default function MainPage() {
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

    const handleMobileNavigationToggle = () => {
        setMobileNavigationOpen(!mobileNavigationOpen);
    };

    return (
        <>
            <Header handleMobileNavigationToggle={handleMobileNavigationToggle} />
            <Navigation mobileNavigationOpen={mobileNavigationOpen} handleMobileNavigationToggle={handleMobileNavigationToggle} />
            <MainContent />
        </>
    );
}
