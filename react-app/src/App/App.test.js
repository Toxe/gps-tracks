import { render } from "@testing-library/react";
import { useAuth } from "../Auth";
import { App } from ".";

jest.mock("../Auth");

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("App", () => {
    describe("With authenticated user", () => {
        test("When user is logged in, show AuthenticatedApp", () => {
            useAuth.mockReturnValue({ authId: 1 });
            const { getByRole } = render(<App />);

            getByRole("button", { name: "Upload" });
        });
    });

    describe("Without authenticated user", () => {
        test("When user is not logged in, show UnauthenticatedApp", () => {
            useAuth.mockReturnValue({ authId: null });
            const { getByRole } = render(<App />);

            getByRole("button", { name: "Sign in" });
        });
    });
});
