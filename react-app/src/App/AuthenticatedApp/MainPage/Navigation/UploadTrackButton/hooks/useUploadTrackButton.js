import React, { useState } from "react";
import { useTracks } from "../../../../TracksProvider";
import UploadInProgressSnackbar from "../UploadInProgressSnackbar";
import { useUploadResultsSnackbar } from ".";

export default function useUploadTrackButton() {
    const { uploadTracks } = useTracks();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [uploadInProgressSnackbar, setUploadInProgressSnackbar] = useState(null);
    const [uploadResultsSnackbar, showUploadResultsSnackbar, hideUploadResultsSnackbar] = useUploadResultsSnackbar();

    const handleUpload = (files) => {
        setUploadInProgressSnackbar(<UploadInProgressSnackbar />);
        hideUploadResultsSnackbar();
        uploadTracks(files, handleUploadFinished);
    };

    const handleUploadFinished = (numFiles, numFilesUploadedSuccessfully) => {
        setDialogVisible(false);
        setUploadInProgressSnackbar(null);
        showUploadResultsSnackbar(numFiles, numFilesUploadedSuccessfully);
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
