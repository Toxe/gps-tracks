import { useState } from "react";

export default function useMainPage() {
    const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

    const handleMobileNavigationToggle = () => {
        setMobileNavigationOpen(!mobileNavigationOpen);
    };

    return { mobileNavigationOpen, handleMobileNavigationToggle };
}
