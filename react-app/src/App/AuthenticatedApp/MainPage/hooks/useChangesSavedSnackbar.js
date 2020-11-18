import { useState } from "react";

export default function useChangesSavedSnackbar() {
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason !== "clickaway") {
            setOpen(false);
        }
    };

    return { open, handleClose };
}
