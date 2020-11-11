import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../Auth";

export default function useHeader() {
    const { authId } = useAuth();

    return { authId };
}
