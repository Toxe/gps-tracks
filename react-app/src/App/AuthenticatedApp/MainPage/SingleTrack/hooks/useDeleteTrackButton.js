import { useState } from "react";

export default function useDeleteTrackButton(handleDeleteTrack) {
    const [dialogVisible, setDialogVisible] = useState(false);

    const handleOpen = () => setDialogVisible(true);
    const handleCancel = () => setDialogVisible(false);

    const handleSubmit = () => {
        setDialogVisible(false);
        handleDeleteTrack();
    };

    return { dialogVisible, handleOpen, handleCancel, handleSubmit };
}
