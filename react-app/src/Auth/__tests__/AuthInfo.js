import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import jwt from "jsonwebtoken";
import { AuthProvider } from "../../Auth/AuthProvider";
import AuthInfo from "../AuthInfo";

function matchByTextContent(queryText) {
    return (content, node) => node.textContent === queryText;
}

describe("AuthInfo", () => {
    afterEach(() => {
        localStorage.clear();
    });

    describe("With authenticated user", () => {
        test("When user is logged in, show identity, access_token and refresh_token", async () => {
            const identity = 1;
            const access_token = jwt.sign({ identity }, "secret", { expiresIn: "15m" });
            const refresh_token = jwt.sign({ identity }, "secret", { expiresIn: "30d" });

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

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
            const identity = 1;
            const access_token = jwt.sign({ identity }, "secret", { expiresIn: "15m" });
            const refresh_token = jwt.sign({ identity }, "secret", { expiresIn: "30d" });

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);

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
