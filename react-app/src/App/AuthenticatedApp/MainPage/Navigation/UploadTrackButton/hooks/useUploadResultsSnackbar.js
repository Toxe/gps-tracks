import { useTranslation } from "react-i18next";
import { useAlertSnackbar } from "../../../shared/AlertSnackbar";

export default function useUploadResultsSnackbar() {
    const { t } = useTranslation();
    const [alertSnackbar, showAlertSnackbar, hideAlertSnackbar] = useAlertSnackbar();

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

    const showUploadResultsSnackbar = (numFiles, numFilesUploadedSuccessfully) => {
        const [messageSeverity, message] = getMessage(numFiles, numFilesUploadedSuccessfully);
        const autoHideDuration = messageSeverity === "success" ? 5000 : null;
        return showAlertSnackbar(message, messageSeverity, autoHideDuration);
    };

    return [alertSnackbar, showUploadResultsSnackbar, hideAlertSnackbar];
}
