import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import i18n from "../../../test/i18n";
import { matchByTextContent } from "../../../test";
import LanguageSelection from "./LanguageSelection";

afterEach(async () => {
    await waitFor(() => i18n.changeLanguage("en"));
});

describe("LanguageSelection", () => {
    describe('With language set to "en"', () => {
        test('When clicking on "Deutsch" in the mobile language selection menu, change language to German', async () => {
            const { findByText, findAllByRole } = render(<LanguageSelection />);

            // find and open language selection menu
            const menuButtons = await findAllByRole("button", { name: "Change language" });
            userEvent.click(menuButtons.find((el) => el.className.includes("MuiIconButton-root")));

            // click on "Deutsch"
            userEvent.click(await findByText(matchByTextContent("Deutsch")));

            // the language menu should now be labeled "Sprache wechseln"
            expect(await findAllByRole("button", { name: "Sprache wechseln" })).toHaveLength(2);
        });

        test('When clicking on "Deutsch" in the normal language selection menu, change language to German', async () => {
            const { findByText, findAllByRole } = render(<LanguageSelection />);

            // find and open language selection menu
            const menuButtons = await findAllByRole("button", { name: "Change language" });
            userEvent.click(menuButtons.find((el) => el.className.includes("MuiButton-root")));

            // click on "Deutsch"
            userEvent.click(await findByText(matchByTextContent("Deutsch")));

            // the language menu should now be labeled "Sprache wechseln"
            expect(await findAllByRole("button", { name: "Sprache wechseln" })).toHaveLength(2);
        });
    });
});
