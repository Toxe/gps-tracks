import React from "react";
import { render } from "@testing-library/react";
import Loading from "./Loading";

describe("Loading", () => {
    describe("With visible component", () => {
        test("When component is visible, should show progress indicator", () => {
            const { getByRole } = render(<Loading />);

            expect(getByRole("progressbar")).toBeInTheDocument();
        });
    });
});
