import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function useUploadResultsSnackbar() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(true);

    const handleClose = (event, reason) => {
        if (reason !== "clickaway") {
            setOpen(false);
        }
    };

    const getMessage = (numFiles, numFilesUploadedSuccessfully) => {
        if (numFilesUploadedSuccessfully === 0) {
            // no file imported
            return ["error", t("upload_error", { count: numFiles })];
        } else {
            // at least one file imported
            if (numFilesUploadedSuccessfully === numFiles && numFiles >= 1) {
                return ["success", t("upload_success", { count: numFiles })];
            } else {
                return ["warning", t("upload_success_partial", { numFilesUploadedSuccessfully, numFiles })];
            }
        }
    };

    return { open, handleClose, getMessage };
}
