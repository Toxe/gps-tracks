import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { sampleAuthTokens, matchByTextContent } from "../test";
import { TokenStorage } from "./api/TokenStorage";
import { AuthProvider } from "./AuthProvider";
import AuthInfo from "./AuthInfo";

describe("AuthInfo", () => {
    afterEach(() => {
        TokenStorage.clearTokens();
    });

    describe("With authenticated user", () => {
        test("When user is logged in, show identity, access_token and refresh_token", async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            TokenStorage.saveTokens({ access_token, refresh_token });

            const { findByText } = render(
                <AuthProvider>
                    <AuthInfo />
                </AuthProvider>
            );

            await findByText(matchByTextContent(`identity: 1`));
            await findByText(matchByTextContent(`access_token: ${access_token}`));
            await findByText(matchByTextContent(`refresh_token: ${refresh_token}`));
            await findByText(matchByTextContent("expires: in 15 minutes"));
            await findByText(matchByTextContent("expires: in 30 days"));
        });

        test("When minimize button clicked, show only identity and access_token expiration time", async () => {
            const { access_token, refresh_token } = sampleAuthTokens(1);
            TokenStorage.saveTokens({ access_token, refresh_token });

            const { findByText, getByLabelText } = render(
                <AuthProvider>
                    <AuthInfo />
                </AuthProvider>
            );

            userEvent.click(getByLabelText("minimize"));

            await findByText(matchByTextContent(`identity: 1`));
            await findByText(matchByTextContent("access_token: expires in 15 minutes"));
        });
    });

    describe("Without authenticated user", () => {
        test("When no user is logged in, return null", () => {
            const { container } = render(
                <AuthProvider>
                    <AuthInfo />
                </AuthProvider>
            );

            expect(container).toBeEmptyDOMElement();
        });
    });
});
