import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@material-ui/core";
import { DropzoneDialog } from "material-ui-dropzone";
import PublishIcon from "@material-ui/icons/Publish";
import { useTracks } from "../../../TracksProvider";
import UploadInProgressSnackbar from "./UploadInProgressSnackbar";
import UploadResultsSnackbar from "./UploadResultsSnackbar";

export default function UploadTrackButton() {
    const { t } = useTranslation();
    const { uploadTracks } = useTracks();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [uploadInProgressSnackbar, setUploadInProgressSnackbar] = useState(null);
    const [uploadResultsSnackbar, setUploadResultsSnackbar] = useState(null);

    const handleUpload = (files) => {
        setUploadInProgressSnackbar(<UploadInProgressSnackbar />);
        uploadTracks(files, handleUploadFinished);
    };

    const handleUploadFinished = (numFiles, numFilesUploadedSuccessfully) => {
        setDialogVisible(false);
        setUploadInProgressSnackbar(null);
        setUploadResultsSnackbar(
            <UploadResultsSnackbar
                numFiles={numFiles}
                numFilesUploadedSuccessfully={numFilesUploadedSuccessfully}
                handleRemove={() => setUploadResultsSnackbar(null)}
            />
        );
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                startIcon={<PublishIcon />}
                onClick={() => setDialogVisible(true)}>
                {t("button_upload_track")}
            </Button>
            <DropzoneDialog
                // acceptedFiles={["application/gpx+xml", ".gpx"]}
                maxFileSize={5000000}
                open={dialogVisible}
                onClose={() => setDialogVisible(false)}
                onSave={handleUpload}
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
            {uploadInProgressSnackbar}
            {uploadResultsSnackbar}
        </div>
    );
}
