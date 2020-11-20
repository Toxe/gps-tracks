import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { spyOnHook } from "../../../../../test";
import * as useSnackbar from "./hooks/useSnackbar";
import Snackbar from "./Snackbar";

describe("Snackbar", () => {
    describe("With component visible", () => {
        test("When component is visible, should show message text", async () => {
            const message = "an alert message";
            const { getByText } = render(<Snackbar message={message} severity="success" autoHideDuration={3000} />);

            expect(getByText(message)).toBeInTheDocument();
        });

        test('When "Close" button clicked, should call handleClose', () => {
            const handleClose = jest.fn();
            spyOnHook(useSnackbar).mockReturnValue({ open: true, handleClose });

            const { getByRole } = render(<Snackbar />);

            userEvent.click(getByRole("button", { name: "Close" }));
            expect(handleClose).toHaveBeenCalled();
        });
    });
});
