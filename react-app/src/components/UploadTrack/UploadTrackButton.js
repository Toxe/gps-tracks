import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@material-ui/core";
import { DropzoneDialog } from "material-ui-dropzone";
import PublishIcon from "@material-ui/icons/Publish";
import { useUser } from "../../api/UserProvider";
import { useTracks } from "../../api/TracksProvider";
import UploadResultsSnackbar from "./UploadResultsSnackbar";

export default function UploadTrackButton() {
    const { t } = useTranslation();
    const { uploadTracks } = useTracks();
    const { user } = useUser();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [uploadResultsSnackbar, setUploadResultsSnackbar] = useState(null);

    const handleOpen = () => {
        setDialogVisible(true);
    };

    const handleCancel = () => {
        setDialogVisible(false);
    };

    const handleSave = (files) => {
        uploadTracks(user.id, files, handleUploadFinished);
    };

    const handleUploadFinished = (numFiles, numFilesUploadedSuccessfully) => {
        setUploadResultsSnackbar(
            <UploadResultsSnackbar
                numFiles={numFiles}
                numFilesUploadedSuccessfully={numFilesUploadedSuccessfully}
                handleRemove={() => setUploadResultsSnackbar(null)}
            />
        );
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
                cancelButtonText={t("button_cancel")}
                submitButtonText={t("button_upload_track")}
                dialogTitle={t("upload_dialog_title")}
                dropzoneText={t("upload_dialog_dropzone")}
                previewText={t("upload_dialog_preview")}
                getFileAddedMessage={(fileName) => t("upload_dialog_file_added", { fileName })}
                getFileRemovedMessage={(fileName) => t("upload_dialog_file_removed", { fileName })}
            />
            {uploadResultsSnackbar}
        </div>
    );
}
