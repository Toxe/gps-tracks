import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import Pager from "./Pager";

describe("Pager", () => {
    describe("Show Pager", () => {
        test("With numPages 3, should show pager with 3 pages", () => {
            const { getByRole } = render(<Pager showPager={true} numPages={3} page={1} handleChangePage={jest.fn()} />);

            getByRole("button", { name: "page 1" });
            getByRole("button", { name: "Go to page 2" });
            getByRole("button", { name: "Go to page 3" });
            getByRole("button", { name: "Go to next page" });
            getByRole("button", { name: "Go to previous page" });
        });

        test("With click on page, should call handleChangePage", () => {
            const handleChangePage = jest.fn();

            const { getByRole } = render(
                <Pager showPager={true} numPages={3} page={1} handleChangePage={handleChangePage} />
            );

            userEvent.click(getByRole("button", { name: "Go to next page" }));

            expect(handleChangePage).toHaveBeenCalled();
        });
    });

    describe("Hide Pager", () => {
        test("When showPager is false, should not show pager and return null", () => {
            const { container } = render(<Pager showPager={false} numPages={5} page={1} handleChangePage={jest.fn()} />);
            expect(container).toBeEmptyDOMElement();
        });

        test("When numPages is 0, should not show pager and return null", () => {
            const { container } = render(<Pager showPager={true} numPages={0} page={1} handleChangePage={jest.fn()} />);
            expect(container).toBeEmptyDOMElement();
        });

        test("When page is 0, should not show pager and return null", () => {
            const { container } = render(<Pager showPager={true} numPages={5} page={0} handleChangePage={jest.fn()} />);
            expect(container).toBeEmptyDOMElement();
        });
    });
});
