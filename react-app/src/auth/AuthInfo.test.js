import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { sampleAuthTokens } from "../test/sampleAuthTokens";
import { AuthProvider } from "./AuthProvider";
import { saveAuthTokensToLocalStorage, removeAuthTokensFromLocalStorage } from "./API";
import AuthInfo from "./AuthInfo";

function matchByTextContent(queryText) {
    return (content, node) => node.textContent === queryText;
}

describe("AuthInfo", () => {
    afterEach(() => {
        removeAuthTokensFromLocalStorage();
    });

    describe("With authenticated user", () => {
        test("When user is logged in, show identity, access_token and refresh_token", async () => {
            const { access_token, refresh_token, identity } = sampleAuthTokens(1);
            saveAuthTokensToLocalStorage(access_token, refresh_token);

            const { findByText } = render(
                <AuthProvider>
                    <AuthInfo />
                </AuthProvider>
            );

            await findByText(matchByTextContent(`identity: ${identity}`));
            await findByText(matchByTextContent(`access_token: ${access_token}`));
            await findByText(matchByTextContent(`refresh_token: ${refresh_token}`));
            await findByText(matchByTextContent("expires: in 15 minutes"));
            await findByText(matchByTextContent("expires: in 30 days"));
        });

        test("When minimize button clicked, show only identity and access_token expiration time", async () => {
            const { access_token, refresh_token, identity } = sampleAuthTokens(1);
            saveAuthTokensToLocalStorage(access_token, refresh_token);

            const { findByText, getByLabelText } = render(
                <AuthProvider>
                    <AuthInfo />
                </AuthProvider>
            );

            userEvent.click(getByLabelText("minimize"));

            await findByText(matchByTextContent(`identity: ${identity}`));
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
