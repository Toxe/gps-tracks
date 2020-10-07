import { useTranslation } from "react-i18next";

export default function TracksCounter({ count }) {
    const { t } = useTranslation();

    return t("tracks_counter", { count });
}
