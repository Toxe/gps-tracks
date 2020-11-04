import React, { useState } from "react";
import UploadInProgressSnackbar from "../UploadInProgressSnackbar";
import UploadResultsSnackbar from "../UploadResultsSnackbar";
import { useTracks } from "../../../../TracksProvider";

export default function useUploadTrackButton() {
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

    return {
        dialogVisible,
        setDialogVisible,
        uploadInProgressSnackbar,
        uploadResultsSnackbar,
        handleUpload,
        handleUploadFinished,
    };
}
