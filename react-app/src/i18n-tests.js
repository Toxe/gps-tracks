import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translation_en from "../public/locales/en/translation.json";
import translation_de from "../public/locales/de/translation.json";

i18n.use(initReactI18next).init({
    keySeparator: false,
    interpolation: {
        escapeValue: false,
    },
    lng: "en",
    resources: {
        en: { translation: translation_en },
        de: { translation: translation_de },
    },
});

export default i18n;
