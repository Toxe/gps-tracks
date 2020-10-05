import React from "react";
import "../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { AuthProvider } from "../../auth/AuthProvider";
import { saveAuthTokensToLocalStorage, removeAuthTokensFromLocalStorage } from "../../auth/API";
import { sampleAuthTokens } from "../../test/sampleAuthTokens";
import { sampleTracks } from "../../test/sampleTracks";
import { sampleUser } from "../../test/sampleUsers";
import App from "../../app/App";

jest.mock("axios");

describe("UploadTrackButton", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
        removeAuthTokensFromLocalStorage();
    });

    describe("With authenticated user", () => {
        test('When "Upload" button clicked, show upload dialog', async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            saveAuthTokensToLocalStorage(access_token, refresh_token);

            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() });

            const { findByText, findByRole } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            userEvent.click(await findByRole("button", { name: "Upload" }));

            await findByText("Upload file");
            await findByText("Drag and drop one or more .gpx files here or click");
        });
    });
});
