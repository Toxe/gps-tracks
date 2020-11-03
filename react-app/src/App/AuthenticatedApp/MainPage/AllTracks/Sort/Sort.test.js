import React from "react";
import "../../../../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { Sort } from ".";

describe("Sort", () => {
    describe("With default settings", () => {
        test("When selecting different sortBy option, should call handleChangeSortBy", async () => {
            const handleChangeSortBy = jest.fn();

            const { findByLabelText, findByRole } = render(
                <Sort
                    sortBy="date"
                    sortOrder="desc"
                    handleChangeSortBy={handleChangeSortBy}
                    handleFlipSortOrder={jest.fn()}
                />
            );

            userEvent.click(await findByLabelText("Sort by"));
            userEvent.click(await findByRole("option", { name: "Name" }));

            expect(handleChangeSortBy).toHaveBeenCalledWith("name");
        });

        test("When clicking on reverse order button, should call handleFlipSortOrder", async () => {
            const handleFlipSortOrder = jest.fn();

            const { findByTitle } = render(
                <Sort
                    sortBy="date"
                    sortOrder="desc"
                    handleChangeSortBy={jest.fn()}
                    handleFlipSortOrder={handleFlipSortOrder}
                />
            );

            userEvent.click(await findByTitle("Change sort order"));

            expect(handleFlipSortOrder).toHaveBeenCalled();
        });
    });
});
