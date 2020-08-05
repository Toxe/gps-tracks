import React, { useState } from "react";
import MainHeader from "./MainHeader";
import MainNavigation from "./MainNavigation";
import MainContent from "./MainContent";

export default function App() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <>
            <MainHeader handleDrawerToggle={handleDrawerToggle} />
            <MainNavigation mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            <MainContent />
        </>
    );
}
