import React, { useState } from "react";

export const CurrentUserContext = React.createContext();

export default function CurrentUserContextProvider(props) {
    const [currentUserId, setCurrentUserId] = useState(0);

    return (
        <CurrentUserContext.Provider value={{ currentUserId, setCurrentUserId }}>
            {props.children}
        </CurrentUserContext.Provider>
    );
}
