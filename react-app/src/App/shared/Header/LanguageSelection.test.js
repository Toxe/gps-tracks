import React from "react";
import "../../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { useAuth } from "../../../Auth";
import { App } from "../../../App";

jest.mock("../../../Auth");

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("LanguageSelection", () => {
    describe('With language set to "en"', () => {
        test('When click on "Deutsch", change language to German', async () => {
            useAuth.mockReturnValue({ authId: 1 });
            const { findByRole, findByLabelText } = render(<App />);

            // open language selection menu and click on "Deutsch"
            userEvent.click(await findByLabelText("English"));
            userEvent.click(await findByLabelText("Deutsch"));

            // the "Upload" button should now be called "Hochladen"
            await findByRole("button", { name: "Hochladen" });
        });
    });
});
