import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@material-ui/core";
import { DropzoneDialog } from "material-ui-dropzone";
import PublishIcon from "@material-ui/icons/Publish";
import { useUser } from "../api/UserProvider";
import { useTracks } from "../api/TracksProvider";

export default function UploadTrackButton() {
    const { t } = useTranslation();
    const { uploadTracks } = useTracks();
    const { user } = useUser();
    const [dialogVisible, setDialogVisible] = useState(false);

    const handleOpen = () => {
        setDialogVisible(true);
    };

    const handleCancel = () => {
        setDialogVisible(false);
    };

    const handleSave = (files) => {
        uploadTracks(user.id, files);
        setDialogVisible(false);
    };

    return (
        <div>
            <Button variant="contained" color="primary" startIcon={<PublishIcon />} onClick={handleOpen}>
                {t("button_upload_track")}
            </Button>
            <DropzoneDialog
                // acceptedFiles={["application/gpx+xml", ".gpx"]}
                maxFileSize={5000000}
                open={dialogVisible}
                onClose={handleCancel}
                onSave={handleSave}
                showPreviews
                showFileNamesInPreview
                useChipsForPreview
                filesLimit={100}
                cancelButtonText={"Cancel"}
                submitButtonText={"Upload"}
                dialogTitle={"Upload file"}
                dropzoneText={"Drag and drop .gpx files here or click"}
                previewText={"Preview:"}
            />
        </div>
    );
}
