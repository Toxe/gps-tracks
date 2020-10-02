import React from "react";
import "../../i18n-tests";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest-extended";
import "expect-more-jest";
import Duration from "./Duration";

describe("Duration", () => {
    describe("With durations from 0 to 59 seconds", () => {
        test("When duration is 0 seconds, shows 0 minutes", () => {
            const { getByText } = render(<Duration duration={0.0} />);
            getByText("00:00");
        });

        test("When duration is 1 second, shows 0 minutes", () => {
            const { getByText } = render(<Duration duration={1.0} />);
            getByText("00:00");
        });

        test("When duration is 29 seconds, shows 0 minutes", () => {
            const { getByText } = render(<Duration duration={29.0} />);
            getByText("00:00");
        });

        test("When duration is 30 seconds, shows 1 minute", () => {
            const { getByText } = render(<Duration duration={30.0} />);
            getByText("00:01");
        });

        test("When duration is 59 seconds, shows 1 minute", () => {
            const { getByText } = render(<Duration duration={59.0} />);
            getByText("00:01");
        });
    });

    describe("With durations from 1 to 59 minutes", () => {
        test("When duration is 60 seconds, shows 1 minute", () => {
            const { getByText } = render(<Duration duration={60.0} />);
            getByText("00:01");
        });

        test("When duration is 1 minute and 1 second, shows 1 minute", () => {
            const { getByText } = render(<Duration duration={61.0} />);
            getByText("00:01");
        });

        test("When duration is 59 minutes, shows 59 minutes", () => {
            const { getByText } = render(<Duration duration={59.0 * 60.0} />);
            getByText("00:59");
        });
    });

    describe("With durations of 1 hour and upwards", () => {
        test("When duration is 1 hour, shows 1 hour", () => {
            const { getByText } = render(<Duration duration={3600.0} />);
            getByText("01:00");
        });

        test("When duration is 1 hour and 1 minute, shows 01:01", () => {
            const { getByText } = render(<Duration duration={3600.0 + 60.0} />);
            getByText("01:01");
        });

        test("When duration is 12 hours, shows 12:00", () => {
            const { getByText } = render(<Duration duration={12.0 * 3600.0} />);
            getByText("12:00");
        });

        test("When duration is 24 hours, shows 24:00", () => {
            const { getByText } = render(<Duration duration={24.0 * 3600.0} />);
            getByText("24:00");
        });

        test("When duration is 48 hours, shows 48:00", () => {
            const { getByText } = render(<Duration duration={48.0 * 3600.0} />);
            getByText("48:00");
        });

        test("When duration is 250 hours, shows 250:00", () => {
            const { getByText } = render(<Duration duration={250.0 * 3600.0} />);
            getByText("250:00");
        });
    });

    describe("With faulty data", () => {
        test("When duration is negative, shows 00:00", () => {
            const { getByText } = render(<Duration duration={-1234.0} />);
            getByText("00:00");
        });

        test("When duration is null, shows 00:00", () => {
            const { getByText } = render(<Duration duration={null} />);
            getByText("00:00");
        });

        test("When duration is undefined, shows 00:00", () => {
            const { getByText } = render(<Duration duration={undefined} />);
            getByText("00:00");
        });

        test("When no duration given, shows 00:00", () => {
            const { getByText } = render(<Duration />);
            getByText("00:00");
        });
    });
});
