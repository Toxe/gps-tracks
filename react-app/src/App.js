import React, { useState } from "react";
import MainHeader from "./MainHeader";
import MainNavigation from "./MainNavigation";
import MainContent from "./MainContent";

export default function App() {
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
