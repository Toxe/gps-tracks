import React from "react";
import "../../../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import { spyOnHook } from "../../../../test";
import * as useFilter from "./hooks/useFilter";
import Filter from "./Filter";

function renderFilter(activityFilter, yearFilter) {
    const availableActivities = ["0", "1"];
    const availableYears = ["2018", "2019", "2020"];
    const handleChangeFilter = jest.fn();

    spyOnHook(useFilter).mockReturnValue({
        activityFilter,
        yearFilter,
        availableActivities,
        availableYears,
        handleChangeFilter,
    });

    return { ...render(<Filter />), handleChangeFilter };
}

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("Filter", () => {
    describe("With no specific filter settings", () => {
        test('When available activities are "0" and "1", should show filter menu with 2 activities', async () => {
            const { getByLabelText, findByRole } = renderFilter("", "");

            userEvent.click(getByLabelText("Activity"));

            await findByRole("option", { name: "All" });
            await findByRole("option", { name: "Bike" });
            await findByRole("option", { name: "Hiking" });
        });

        test('When available years are "2018", "2019" and "2020", should show filter menu with 3 years', async () => {
            const { getByLabelText, findByRole } = renderFilter("", "");

            userEvent.click(getByLabelText("Year"));

            await findByRole("option", { name: "All" });
            await findByRole("option", { name: "2018" });
            await findByRole("option", { name: "2019" });
            await findByRole("option", { name: "2020" });
        });
    });

    describe("With selected activity filter option", () => {
        test('When activity filter is "0", selected option should be "Bike"', async () => {
            const { getByLabelText } = renderFilter("0", "");

            getByLabelText("Activity");
            getByLabelText("Bike");
        });

        test('When activity filter is "all", selected option should be "All"', async () => {
            const { getByLabelText } = renderFilter("all", "");

            getByLabelText("Activity");
            getByLabelText("All");
        });
    });

    describe("With selected year filter option", () => {
        test('When year filter is "2019", selected option should be "2019"', async () => {
            const { getByLabelText } = renderFilter("", "2019");

            getByLabelText("Year");
            getByLabelText("2019");
        });

        test('When year filter is "all", selected option should be "All"', async () => {
            const { getByLabelText } = renderFilter("", "all");

            getByLabelText("Year");
            getByLabelText("All");
        });
    });

    describe("Selecting a filter option", () => {
        test("When selecting a different activity, should call handleChangeFilter", async () => {
            const { getByLabelText, findByRole, handleChangeFilter } = renderFilter("", "");

            userEvent.click(getByLabelText("Activity"));
            userEvent.click(await findByRole("option", { name: "Bike" }));

            expect(handleChangeFilter).toHaveBeenCalled();
        });

        test("When selecting a different year, should call handleChangeFilter", async () => {
            const { getByLabelText, findByRole, handleChangeFilter } = renderFilter("", "");

            userEvent.click(getByLabelText("Year"));
            userEvent.click(await findByRole("option", { name: "2020" }));

            expect(handleChangeFilter).toHaveBeenCalled();
        });
    });
});
