import React from "react";
import "../../../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavigationYearList from "./NavigationYearList";

jest.mock("../../TracksProvider");

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("NavigationYearList", () => {
    describe("With available years", () => {
        test("When clicking on a list item, should call handleNavigationClick", async () => {
            const countedYears = new Map([
                [2019, 2],
                [2020, 3],
            ]);
            const handleNavigationClick = jest.fn();

            const { findByText } = render(
                <NavigationYearList countedYears={countedYears} handleNavigationClick={handleNavigationClick} />
            );

            userEvent.click(await findByText("2020"));

            expect(handleNavigationClick).toHaveBeenCalled();
        });
    });
});
