import React from "react";
import "../../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { sampleAuthTokens, sampleTracks, sampleUser } from "../../../test";
import { AuthProvider } from "../../../Auth";
import { TokenStorage } from "../../../Auth/api";
import { App } from "../../../App";

jest.mock("axios");

describe("LanguageSelection", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
        TokenStorage.clearTokens();
    });

    describe('With language set to "en"', () => {
        test('When click on "Deutsch", change language to German', async () => {
            TokenStorage.saveTokens(sampleAuthTokens(1));

            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() });

            const { findByRole, findByLabelText } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            // open language selection menu and click on "Deutsch"
            userEvent.click(await findByLabelText("English"));
            userEvent.click(await findByLabelText("Deutsch"));

            // the "Upload" button should now be called "Hochladen"
            await findByRole("button", { name: "Hochladen" });
        });
    });
});
