import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import axiosMock from "axios";
import { AuthProvider } from "../../../Auth";
import { UserProvider } from "../../AuthenticatedApp/UserProvider";
import { LoginPage } from ".";

jest.mock("axios");

describe("LoginPage", () => {
    describe("Without authenticated user", () => {
        test("When login request fails, show error message", async () => {
            axiosMock.post.mockRejectedValueOnce({
                message: "Request failed with status code 401",
                response: {
                    status: 401,
                    data: { error: "Unauthorized", message: "Login email address or password missing." },
                },
            });

            const { getByRole, getByLabelText, findByText } = render(
                <AuthProvider>
                    <BrowserRouter>
                        <UserProvider>
                            <LoginPage />
                        </UserProvider>
                    </BrowserRouter>
                </AuthProvider>
            );

            const passwordTextbox = getByLabelText(/Password/i);
            const emailTextbox = getByRole("textbox", { name: /Email Address/i });
            const loginButton = getByRole("button", { name: /Sign in/i });

            // enter email and password
            userEvent.clear(emailTextbox);
            userEvent.type(emailTextbox, "user@example.com");

            userEvent.clear(passwordTextbox);
            userEvent.type(passwordTextbox, "password");

            // login
            userEvent.click(loginButton);

            await waitFor(() => expect(axiosMock.post).toHaveBeenCalledTimes(1));
            expect(axiosMock.post).toHaveBeenCalledWith("/auth/login", {
                email: "user@example.com",
                password: "password",
            });

            await findByText("Request error: Request failed with status code 401");
            await findByText("Server response: 401 Unauthorized");
            await findByText('"Login email address or password missing."');
        });
    });
});
