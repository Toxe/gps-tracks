import React from "react";
import "../../../../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import axiosMock from "axios";
import { sampleAuthTokens, sampleTracks, sampleUser } from "../../../../../test";
import { AuthProvider } from "../../../../../Auth";
import { TokenStorage } from "../../../../../Auth/api";
import { App } from "../../../../../App";

jest.mock("axios");

describe("UploadTrackButton", () => {
    afterEach(() => {
        axiosMock.get.mockReset();
        TokenStorage.clearTokens();
    });

    describe("With authenticated user", () => {
        test('When "Upload" button clicked, show upload dialog', async () => {
            TokenStorage.saveTokens(sampleAuthTokens(1));

            axiosMock.get
                .mockResolvedValueOnce({ data: sampleUser(1) })
                .mockResolvedValueOnce({ data: sampleTracks() });

            const { findByText, findByRole } = render(
                <AuthProvider>
                    <App />
                </AuthProvider>
            );

            userEvent.click(await findByRole("button", { name: "Upload" }));

            await findByRole("heading", { name: "Upload file" });
            await findByText("Drag and drop one or more .gpx files here or click");
        });
    });
});
