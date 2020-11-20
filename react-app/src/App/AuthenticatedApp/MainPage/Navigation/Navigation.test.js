import React from "react";
import "../../../../i18n-tests";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { spyOnHook } from "../../../../test";
import { useTracks } from "../../TracksProvider";
import * as useNavigation from "./hooks/useNavigation";
import { Navigation } from ".";

jest.mock("../../TracksProvider");

afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
});

describe("Navigation", () => {
    describe("With navigation visible", () => {
        test("When clicking on the all tracks menu item, should call handleNavigationClick", async () => {
            const navigateToAllTracks = jest.fn();
            const handleMobileNavigationToggle = jest.fn();
            const handleNavigationClick = jest.fn();

            spyOnHook(useNavigation).mockReturnValue({ numTracks: 5, handleNavigationClick });
            useTracks.mockReturnValue({ uploadTracks: jest.fn() });

            const { findByRole } = render(
                <Navigation
                    mobileNavigationOpen={false}
                    handleMobileNavigationToggle={handleMobileNavigationToggle}
                    navigateToAllTracks={navigateToAllTracks}
                />
            );

            userEvent.click(await findByRole("button", { name: "5 Tracks" }));

            expect(handleNavigationClick).toHaveBeenCalled();
        });
    });
});
