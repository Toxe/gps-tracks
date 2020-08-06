import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainHeader from "./MainHeader";
import MainNavigation from "./MainNavigation";
import MainContent from "./MainContent";
import { CurrentUserContext } from "./Auth/CurrentUserContext";

export default function MainPage() {
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
    const { currentUserId } = useContext(CurrentUserContext);
    const navigate = useNavigate();

    // automatically redirect to login page if no user is logged in
    useEffect(() => {
        if (currentUserId <= 0)
            navigate("/login");
    }, [currentUserId, navigate]);

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
