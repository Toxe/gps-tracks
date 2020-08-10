import React, { useState } from "react";
import MainHeader from "../content/MainHeader";
import MainNavigation from "../content/MainNavigation";
import MainContent from "../content/MainContent";

export default function MainPage() {
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

    const handleMobileNavigationToggle = () => {
        setMobileNavigationOpen(!mobileNavigationOpen);
    };

    return (
        <>
            <MainHeader handleMobileNavigationToggle={handleMobileNavigationToggle} />
            <MainNavigation mobileNavigationOpen={mobileNavigationOpen} handleMobileNavigationToggle={handleMobileNavigationToggle} />
            <MainContent />
        </>
    );
}
